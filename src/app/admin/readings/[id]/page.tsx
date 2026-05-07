'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/FormField';
import { readingService } from '@/services/readingService';
import type { Reading, Question } from '@/types/domain';

interface QuestionForm {
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const emptyForm: QuestionForm = { questionText: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' };

export default function AdminReadingDetailPage() {
  const { user, token } = useAuth();
  const params = useParams();
  const readingId = params.id as string;

  const [reading, setReading] = useState<Reading | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<QuestionForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin' || !token) return;

    Promise.all([
      readingService.getById(readingId, token),
      readingService.getAdminQuestions(readingId, token),
    ])
      .then(([readingData, questionsData]) => {
        setReading(readingData);
        setQuestions(questionsData);
      })
      .catch(err => console.error('Failed to fetch:', err))
      .finally(() => setLoading(false));
  }, [user, token, readingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    try {
      if (editingId) {
        const updated = await readingService.updateQuestion(token, editingId, {
          questionText: form.questionText,
          options: form.options,
          correctAnswer: form.correctAnswer,
          explanation: form.explanation || undefined,
        });
        setQuestions(questions.map(q => q.id === editingId ? updated : q));
      } else {
        const created = await readingService.createQuestion(token, {
          readingId,
          questionText: form.questionText,
          options: form.options,
          correctAnswer: form.correctAnswer,
          explanation: form.explanation || undefined,
        });
        setQuestions([...questions, created]);
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      console.error('Failed to save:', err);
      alert('Gagal menyimpan soal');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (q: Question) => {
    setEditingId(q.id);
    setForm({
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus soal ini?')) return;
    if (!token) return;

    try {
      await readingService.deleteQuestion(token, id);
      setQuestions(questions.filter(q => q.id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Gagal menghapus soal');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/readings" className="text-sm text-slate-500 hover:text-slate-700 mb-1 block">← Kembali</Link>
          <h2 className="text-2xl font-bold">{loading ? 'Memuat...' : (reading?.title || 'Detail Bacaan')}</h2>
        </div>
        <Button onClick={() => { setShowForm(!showForm); if (!showForm) { setEditingId(null); setForm(emptyForm); } }}>
          {showForm ? 'Batal' : '+ Tambah Soal'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-semibold">{editingId ? 'Edit Soal' : 'Tambah Soal Baru'}</h3>
            <Textarea
              label="Pertanyaan"
              value={form.questionText}
              onChange={e => setForm({ ...form, questionText: e.target.value })}
              rows={2}
              required
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium">Opsi Jawaban</label>
              {form.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct"
                    checked={form.correctAnswer === i}
                    onChange={() => setForm({ ...form, correctAnswer: i })}
                  />
                  <Input
                    value={opt}
                    onChange={e => {
                      const newOpts = [...form.options];
                      newOpts[i] = e.target.value;
                      setForm({ ...form, options: newOpts });
                    }}
                    placeholder={`Opsi ${String.fromCharCode(65 + i)}`}
                    required
                  />
                </div>
              ))}
            </div>
            <Input
              label="Penjelasan (opsional)"
              value={form.explanation}
              onChange={e => setForm({ ...form, explanation: e.target.value })}
            />
            <div className="flex gap-2">
              <Button type="submit" isLoading={saving}>{editingId ? 'Update' : 'Simpan'}</Button>
              <Button type="button" variant="secondary" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}>Batal</Button>
            </div>
          </form>
        </Card>
      )}

      <h3 className="font-semibold mb-4">Daftar Soal ({questions.length})</h3>
      {loading ? (
        <p className="text-slate-500">Memuat...</p>
      ) : questions.length === 0 ? (
        <p className="text-slate-500">Belum ada soal.</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <Card key={q.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="text-xs font-medium text-slate-500">Soal {idx + 1}</span>
                  <p className="font-medium mt-1">{q.questionText}</p>
                  <div className="mt-2 space-y-1">
                    {q.options.map((opt, oi) => (
                      <p key={oi} className={`text-sm ${oi === q.correctAnswer ? 'text-green-600 font-medium' : 'text-slate-600'}`}>
                        {String.fromCharCode(65 + oi)}. {opt} {oi === q.correctAnswer && '✓'}
                      </p>
                    ))}
                  </div>
                  {q.explanation && <p className="text-xs text-slate-500 mt-2">💡 {q.explanation}</p>}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(q)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(q.id)}>Hapus</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}