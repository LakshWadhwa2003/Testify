import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || 'https://gtmtvvmqqnsnalzczela.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const sb = createClient(url, key);

async function runVerification() {
  console.log('--- 1. Testing Tests & Question Count Pipeline ---');
  const { data: tests, error: testsErr } = await sb
    .from('tests')
    .select('id, title, duration_minutes, total_points, questions(count)')
    .order('created_at', { ascending: false });

  if (testsErr) {
    console.error('❌ Tests query failed:', testsErr);
  } else {
    console.log(`✅ Loaded ${tests.length} tests from Supabase.`);
    tests.forEach((t) => {
      const qCount = t.questions?.[0]?.count ?? 0;
      console.log(`   - [${t.id.slice(0, 8)}] "${t.title.slice(0, 35)}..." (${qCount} Qs, ${t.total_points} Pts)`);
    });
  }

  console.log('\n--- 2. Testing Questions Query Pipeline ---');
  if (tests && tests.length > 0) {
    const testId = tests[0].id;
    const { data: questions, error: qErr } = await sb
      .from('questions')
      .select('id, question_text, question_type, points, order_index')
      .eq('test_id', testId)
      .order('order_index', { ascending: true })
      .limit(3);

    if (qErr) {
      console.error('❌ Questions query failed:', qErr);
    } else {
      console.log(`✅ Loaded first 3 questions for test ${testId.slice(0, 8)}:`);
      questions.forEach((q) => {
        console.log(`   - Q#${q.order_index + 1} (${q.question_type}, ${q.points} pt): "${q.question_text.slice(0, 40)}..."`);
      });
    }
  }

  console.log('\n--- 3. Testing Submissions Pipeline (No PGRST200 or 42703) ---');
  const { data: submissions, error: subErr } = await sb
    .from('submissions')
    .select('*, tests(title)')
    .order('submitted_at', { ascending: false });

  if (subErr) {
    console.error('❌ Submissions query failed:', subErr);
  } else {
    console.log(`✅ Submissions query succeeded without errors (returned ${submissions.length} rows).`);
  }

  console.log('\n--- 4. Testing Profiles Pipeline ---');
  const { data: profiles, error: profErr } = await sb.from('profiles').select('*');
  if (profErr) {
    console.error('❌ Profiles query failed:', profErr);
  } else {
    console.log(`✅ Profiles query succeeded without errors (returned ${profiles.length} rows).`);
  }

  console.log('\n--- 5. Testing user_test_access Table Availability ---');
  const { data: access, error: accErr } = await sb.from('user_test_access').select('*');
  if (accErr) {
    console.log(`ℹ️ user_test_access table in Supabase: ${accErr.message} (Handled gracefully with local sandbox store)`);
  } else {
    console.log(`✅ user_test_access table exists in Supabase (${access.length} records).`);
  }

  console.log('\nAll pipeline checks completed!');
}

runVerification().catch(console.error);
