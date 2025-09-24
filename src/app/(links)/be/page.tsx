'use client';

import { useEffect, useState } from 'react';

type Comment = { id: number; comment: string; created_at: string };

export default function ClientCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch('/api/comments', { cache: 'no-store' });
    if (!res.ok) return;
    const data = (await res.json()) as Comment[];
    setComments(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Failed to submit');
      }
      setComment('');
      await load();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      style={{ maxWidth: 520, margin: '2rem auto', display: 'grid', gap: 16 }}
    >
      <h1>Client-side Comments</h1>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8 }}>
        <input
          type="text"
          placeholder="write a comment"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit'}
        </button>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
      </form>

      <ul style={{ display: 'grid', gap: 8 }}>
        {comments.map((c, i) => (
          <li key={i}>
            <strong>#{i + 1}</strong> — {c.comment}
          </li>
        ))}
      </ul>
    </main>
  );
}
