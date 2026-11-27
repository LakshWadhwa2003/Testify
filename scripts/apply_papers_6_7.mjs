import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import {
  PAPER_6_TEST,
  PAPER_7_TEST,
  PAPER_6_QUESTIONS,
  PAPER_7_QUESTIONS,
  run as validateData
} from './papers_6_7_data.mjs';

async function main() {
  await validateData();

  // 1. Read .env for Supabase URL and Key
  const envContent = fs.readFileSync('.env', 'utf8');
  const urlMatch = envContent.match(/VITE_SUPABASE_URL\s*=\s*(.*)/);
  const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY\s*=\s*(.*)/);

  if (!urlMatch || !keyMatch) {
    throw new Error('Missing Supabase URL or Anon key in .env');
  }

  const supabaseUrl = urlMatch[1].trim();
  const supabaseKey = keyMatch[1].trim();
  const sb = createClient(supabaseUrl, supabaseKey);

  // Authenticate with admin user
  const adminEmail = 'tempadmin_1795765354369@testify-admin.local';
  const adminPass = 'TestAdminPass123!';

  const { data: authData, error: authError } = await sb.auth.signInWithPassword({
    email: adminEmail,
    password: adminPass,
  });

  if (authError || !authData.session) {
    throw new Error('Failed to sign in as admin: ' + (authError?.message || 'No session'));
  }

  console.log('✅ Authenticated as Admin:', authData.user.email);

  // 2. Insert Tests into Supabase
  const newTests = [PAPER_6_TEST, PAPER_7_TEST];
  console.log('Inserting/upserting tests into Supabase...');
  const { data: testsInserted, error: testsErr } = await sb
    .from('tests')
    .upsert(newTests, { onConflict: 'id' })
    .select();

  if (testsErr) {
    throw new Error('Failed to insert tests: ' + JSON.stringify(testsErr));
  }
  console.log(`✅ Successfully inserted ${testsInserted.length} tests into Supabase:`);
  testsInserted.forEach(t => console.log(`   - [${t.id}] ${t.title}`));

  // 3. Insert Questions in chunks into Supabase
  const allQuestions = [...PAPER_6_QUESTIONS, ...PAPER_7_QUESTIONS];
  console.log(`Inserting/upserting ${allQuestions.length} questions into Supabase...`);
  const chunkSize = 20;
  for (let i = 0; i < allQuestions.length; i += chunkSize) {
    const chunk = allQuestions.slice(i, i + chunkSize);
    const { error: qErr } = await sb.from('questions').upsert(chunk, { onConflict: 'id' });
    if (qErr) {
      throw new Error(`Failed to insert questions batch ${i}: ` + JSON.stringify(qErr));
    }
    console.log(`   - Upserted batch ${i + 1} - ${Math.min(i + chunkSize, allQuestions.length)} / ${allQuestions.length}`);
  }
  console.log('✅ All 84 questions successfully seeded into Supabase DB!');

  // 4. Update scripts/seed_lnat.mjs
  console.log('\nUpdating scripts/seed_lnat.mjs...');
  const seedMjsPath = path.resolve('scripts/seed_lnat.mjs');
  let seedMjs = fs.readFileSync(seedMjsPath, 'utf8');

  // Check if Paper 6 already present
  if (!seedMjs.includes(PAPER_6_TEST.id)) {
    // Insert into LNAT_TESTS
    const testClosingIndex = seedMjs.indexOf('export const LNAT_QUESTIONS');
    const testsBracketClose = seedMjs.lastIndexOf('];', testClosingIndex);
    const testsToAddStr = `,\n  ${JSON.stringify(PAPER_6_TEST, null, 2)},\n  ${JSON.stringify(PAPER_7_TEST, null, 2)}`;
    seedMjs = seedMjs.slice(0, testsBracketClose) + testsToAddStr + '\n' + seedMjs.slice(testsBracketClose);

    // Insert into LNAT_QUESTIONS
    const questionsEndIdx = seedMjs.lastIndexOf('];');
    const questionsToAddStr = `,\n` + allQuestions.map(q => `  ${JSON.stringify(q, null, 2)}`).join(',\n');
    seedMjs = seedMjs.slice(0, questionsEndIdx) + questionsToAddStr + '\n' + seedMjs.slice(questionsEndIdx);

    // Ensure seed() only runs when executed directly
    if (seedMjs.includes('seed();') && !seedMjs.includes('if (process.argv[1]')) {
      seedMjs = seedMjs.replace(
        'seed();',
        "if (process.argv[1] && (process.argv[1].endsWith('seed_lnat.mjs') || process.argv[1].includes('seed_lnat'))) {\n  seed();\n}"
      );
    }

    fs.writeFileSync(seedMjsPath, seedMjs, 'utf8');
    console.log('✅ Updated scripts/seed_lnat.mjs with Paper 6 & 7.');
  } else {
    console.log('ℹ️ scripts/seed_lnat.mjs already contains Paper 6 & 7.');
  }

  // 5. Update supabase/seed_lnat.sql
  console.log('\nUpdating supabase/seed_lnat.sql...');
  const seedSqlPath = path.resolve('supabase/seed_lnat.sql');
  let seedSql = fs.readFileSync(seedSqlPath, 'utf8');

  if (!seedSql.includes(PAPER_6_TEST.id)) {
    function generateTestSql(test, questions, num) {
      let sql = `\n-- ==============================================================================\n`;
      sql += `-- QUESTIONNAIRE ${num}: ${test.title} (42 Questions)\n`;
      sql += `-- ==============================================================================\n`;
      sql += `INSERT INTO public.tests (id, title, description, duration_minutes, total_points, is_published, category)\n`;
      sql += `VALUES (\n`;
      sql += `  '${test.id}',\n`;
      sql += `  '${test.title.replace(/'/g, "''")}',\n`;
      sql += `  '${test.description.replace(/'/g, "''")}',\n`;
      sql += `  ${test.duration_minutes},\n`;
      sql += `  ${test.total_points},\n`;
      sql += `  ${test.is_published},\n`;
      sql += `  '${test.category.replace(/'/g, "''")}'\n`;
      sql += `) ON CONFLICT (id) DO UPDATE SET\n`;
      sql += `  title = EXCLUDED.title,\n`;
      sql += `  description = EXCLUDED.description,\n`;
      sql += `  duration_minutes = EXCLUDED.duration_minutes,\n`;
      sql += `  total_points = EXCLUDED.total_points,\n`;
      sql += `  is_published = EXCLUDED.is_published,\n`;
      sql += `  category = EXCLUDED.category;\n\n`;

      sql += `INSERT INTO public.questions (id, test_id, question_text, question_type, options, correct_answer, explanation, points, order_index)\nVALUES\n`;

      const values = questions.map((q, idx) => {
        const escapedQ = q.question_text.replace(/'/g, "''");
        const escapedOpts = JSON.stringify(q.options).replace(/'/g, "''");
        const escapedAns = q.correct_answer.replace(/'/g, "''");
        const escapedExp = q.explanation ? `'${q.explanation.replace(/'/g, "''")}'` : 'NULL';
        return `  ('${q.id}', '${test.id}', '${escapedQ}', '${q.question_type}', '${escapedOpts}'::jsonb, '${escapedAns}', ${escapedExp}, ${q.points}, ${q.order_index})`;
      }).join(',\n');

      sql += values;
      sql += `\nON CONFLICT (id) DO UPDATE SET\n`;
      sql += `  question_text = EXCLUDED.question_text,\n`;
      sql += `  question_type = EXCLUDED.question_type,\n`;
      sql += `  options = EXCLUDED.options,\n`;
      sql += `  correct_answer = EXCLUDED.correct_answer,\n`;
      sql += `  explanation = EXCLUDED.explanation,\n`;
      sql += `  points = EXCLUDED.points,\n`;
      sql += `  order_index = EXCLUDED.order_index;\n`;
      return sql;
    }

    const sqlP6 = generateTestSql(PAPER_6_TEST, PAPER_6_QUESTIONS, 6);
    const sqlP7 = generateTestSql(PAPER_7_TEST, PAPER_7_QUESTIONS, 7);

    seedSql += sqlP6 + sqlP7;
    fs.writeFileSync(seedSqlPath, seedSql, 'utf8');
    console.log('✅ Appended Paper 6 & 7 to supabase/seed_lnat.sql.');
  } else {
    console.log('ℹ️ supabase/seed_lnat.sql already contains Paper 6 & 7.');
  }

  // 6. Update src/lib/mockData.ts
  console.log('\nUpdating src/lib/mockData.ts...');
  const mockPath = path.resolve('src/lib/mockData.ts');
  let mockContent = fs.readFileSync(mockPath, 'utf8');

  if (!mockContent.includes(PAPER_6_TEST.id)) {
    // Insert tests into INITIAL_TESTS
    const p6Mock = {
      ...PAPER_6_TEST,
      created_by: 'admin-user-01',
      created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
      question_count: 42,
    };
    const p7Mock = {
      ...PAPER_7_TEST,
      created_by: 'admin-user-01',
      created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
      question_count: 42,
    };

    const testsCloseIdx = mockContent.indexOf('];\n\nexport const INITIAL_QUESTIONS');
    const testsToAdd = `,\n  ${JSON.stringify(p6Mock, null, 2)},\n  ${JSON.stringify(p7Mock, null, 2)}`;
    mockContent = mockContent.slice(0, testsCloseIdx) + testsToAdd + mockContent.slice(testsCloseIdx);

    // Insert questions into INITIAL_QUESTIONS
    const qEndIdx = mockContent.lastIndexOf('];');
    const qToAdd = `,\n` + allQuestions.map(q => `  ${JSON.stringify(q, null, 2)}`).join(',\n');
    mockContent = mockContent.slice(0, qEndIdx) + qToAdd + mockContent.slice(qEndIdx);

    fs.writeFileSync(mockPath, mockContent, 'utf8');
    console.log('✅ Updated src/lib/mockData.ts with Paper 6 & 7.');
  } else {
    console.log('ℹ️ src/lib/mockData.ts already contains Paper 6 & 7.');
  }

  console.log('\nAll sync and seeding tasks finished successfully!');
}

main().catch(err => {
  console.error('Fatal error during apply:', err);
  process.exit(1);
});
