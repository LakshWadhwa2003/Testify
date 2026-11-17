import React, { useState } from 'react';
import { QuestionType } from '../types/database';
import { testsService } from '../services/api';
import { 
  Plus, 
  Trash2, 
  UploadCloud, 
  FileCode, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  ListChecks, 
  AlertCircle,
  ChevronLeft
} from 'lucide-react';

interface QuestionDraft {
  question_text: string;
  question_type: QuestionType;
  options: string[];
  correct_answer: string;
  explanation: string;
  points: number;
}

interface AdminUploadPaperProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

const SAMPLE_JSON_TEMPLATE = [
  {
    "question_text": "What is the capital city of France?",
    "question_type": "multiple_choice",
    "options": ["Berlin", "Madrid", "Paris", "Rome"],
    "correct_answer": "Paris",
    "explanation": "Paris is the capital and most populous city of France.",
    "points": 5
  },
  {
    "question_text": "Water boils at 100 degrees Celsius under standard atmospheric pressure.",
    "question_type": "true_false",
    "options": ["True", "False"],
    "correct_answer": "True",
    "explanation": "At sea level (1 atm), the boiling point of pure water is 100°C.",
    "points": 5
  },
  {
    "question_text": "What is the primary gas found in Earth's atmosphere?",
    "question_type": "short_answer",
    "options": [],
    "correct_answer": "Nitrogen",
    "explanation": "Nitrogen makes up approximately 78% of Earth's atmosphere.",
    "points": 5
  }
];

export const AdminUploadPaper: React.FC<AdminUploadPaperProps> = ({ onSuccess, onCancel }) => {
  const [mode, setMode] = useState<'form' | 'json'>('form');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [category, setCategory] = useState('General');
  const [isPublished, setIsPublished] = useState(true);

  // Form mode questions
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    {
      question_text: '',
      question_type: 'multiple_choice',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correct_answer: 'Option 1',
      explanation: '',
      points: 5,
    },
  ]);

  // JSON mode input
  const [jsonInput, setJsonInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: '',
        question_type: 'multiple_choice',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct_answer: 'Option A',
        explanation: '',
        points: 5,
      },
    ]);
  };

  const removeQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, updates: Partial<QuestionDraft>) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...updates };
      return copy;
    });
  };

  const updateOption = (qIdx: number, optIdx: number, val: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const newOpts = [...copy[qIdx].options];
      const oldVal = newOpts[optIdx];
      newOpts[optIdx] = val;
      copy[qIdx].options = newOpts;
      // if this was the correct answer, update correct_answer too
      if (copy[qIdx].correct_answer === oldVal) {
        copy[qIdx].correct_answer = val;
      }
      return copy;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!title.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter a test title.' });
      return;
    }

    let finalQuestions: QuestionDraft[] = [];

    if (mode === 'json') {
      try {
        finalQuestions = JSON.parse(jsonInput);
        if (!Array.isArray(finalQuestions) || finalQuestions.length === 0) {
          throw new Error('JSON must be a non-empty array of questions.');
        }
      } catch (err: any) {
        setStatusMessage({ type: 'error', text: 'Invalid JSON format: ' + err.message });
        return;
      }
    } else {
      // Validate form questions
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.question_text.trim()) {
          setStatusMessage({ type: 'error', text: `Question ${i + 1} is missing text.` });
          return;
        }
        if (!q.correct_answer.trim()) {
          setStatusMessage({ type: 'error', text: `Question ${i + 1} has no correct answer selected.` });
          return;
        }
      }
      finalQuestions = questions;
    }

    setSaving(true);
    try {
      await testsService.createTest(
        {
          title: title.trim(),
          description: description.trim(),
          duration_minutes: Number(durationMinutes) || 20,
          category: category.trim() || 'General',
          is_published: isPublished,
        },
        finalQuestions
      );

      setStatusMessage({ type: 'success', text: 'Test Paper successfully published!' });
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Failed to create test: ' + (err.message || 'Error') });
    } finally {
      setSaving(false);
    }
  };

  const loadSampleJson = () => {
    setTitle('General Science & Geography Assessment');
    setDescription('Curated multiple-choice and short-answer questions testing fundamental knowledge.');
    setDurationMinutes(15);
    setCategory('Science');
    setJsonInput(JSON.stringify(SAMPLE_JSON_TEMPLATE, null, 2));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-28">
      {/* Back button if cancelable */}
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition-all active:scale-95 touch-manipulation mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Tests</span>
        </button>
      )}

      {/* Page Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Create Test Paper
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Upload questions, choices, answers, and scoring criteria for students.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('form')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'form'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Form Builder
          </button>
          <button
            type="button"
            onClick={() => setMode('json')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'json'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Bulk JSON
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className={`mb-6 p-4 rounded-2xl text-xs font-medium border flex items-center gap-2 ${
          statusMessage.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
            : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Test Metadata Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Assessment Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Paper Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Advanced Bioethics & Medical Law"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Description / Context
              </label>
              <textarea
                rows={2}
                placeholder="Brief summary or reading passage..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="360"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value) || 20)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <input
                type="text"
                placeholder="General, Biology, Reasoning..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="publish-check"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
              />
              <label htmlFor="publish-check" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                Publish immediately (make visible in catalog)
              </label>
            </div>
          </div>
        </div>

        {/* JSON Mode Area */}
        {mode === 'json' ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-600" />
                Raw JSON Definition
              </h3>
              <button
                type="button"
                onClick={loadSampleJson}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Load Sample Template
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste an array of question objects containing <code>question_text</code>, <code>question_type</code> (multiple_choice, true_false, short_answer), <code>options</code>, <code>correct_answer</code>, and <code>points</code>.
            </p>

            <textarea
              rows={12}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste JSON array here..."
              className="w-full p-4 font-mono text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ) : (
          /* Form Mode Questions List */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-indigo-600" />
                Questions ({questions.length})
              </h3>
              <button
                type="button"
                onClick={addQuestion}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Question
              </button>
            </div>

            {questions.map((q, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    Question #{idx + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(idx)}
                      className="text-xs text-rose-500 hover:text-rose-700 p-1 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Question Prompt *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Enter the question text..."
                    value={q.question_text}
                    onChange={(e) => updateQuestion(idx, { question_text: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Question Type
                    </label>
                    <select
                      value={q.question_type}
                      onChange={(e) => {
                        const newType = e.target.value as QuestionType;
                        let newOpts = q.options;
                        let newAns = q.correct_answer;
                        if (newType === 'true_false') {
                          newOpts = ['True', 'False'];
                          newAns = 'True';
                        } else if (newType === 'short_answer') {
                          newOpts = [];
                          newAns = '';
                        } else if (newOpts.length === 0) {
                          newOpts = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
                          newAns = 'Option 1';
                        }
                        updateQuestion(idx, {
                          question_type: newType,
                          options: newOpts,
                          correct_answer: newAns,
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="true_false">True / False</option>
                      <option value="short_answer">Short Answer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Points
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={q.points}
                      onChange={(e) => updateQuestion(idx, { points: Number(e.target.value) || 1 })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Multiple choice options editor */}
                {q.question_type === 'multiple_choice' && (
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Options & Correct Answer Choice
                    </label>
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${idx}`}
                          checked={q.correct_answer === opt}
                          onChange={() => updateQuestion(idx, { correct_answer: opt })}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                          title="Select as correct answer"
                        />
                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={(e) => updateOption(idx, oIdx, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    ))}
                    <p className="text-[10px] text-slate-400">
                      Click the radio circle next to an option to mark it as the correct answer.
                    </p>
                  </div>
                )}

                {/* True False options */}
                {q.question_type === 'true_false' && (
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Correct Answer
                    </label>
                    <div className="flex gap-4">
                      {['True', 'False'].map((tf) => (
                        <label key={tf} className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                          <input
                            type="radio"
                            name={`tf-${idx}`}
                            checked={q.correct_answer === tf}
                            onChange={() => updateQuestion(idx, { correct_answer: tf })}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>{tf}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Short answer text */}
                {q.question_type === 'short_answer' && (
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Correct Answer Phrase (Case-insensitive) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Photosynthesis"
                      value={q.correct_answer}
                      onChange={(e) => updateQuestion(idx, { correct_answer: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {/* Explanation */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Explanation / Solution Notes (Shown in score report)
                  </label>
                  <input
                    type="text"
                    placeholder="Why this answer is correct..."
                    value={q.explanation}
                    onChange={(e) => updateQuestion(idx, { explanation: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <UploadCloud className="w-4 h-4" />
            )}
            <span>{saving ? 'Publishing Test Paper...' : 'Publish Test Paper'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
