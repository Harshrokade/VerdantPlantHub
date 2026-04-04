import React, { useState } from 'react';
import { plants } from '../data/plants';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from '../hooks/useToast';
import styles from './Notes.module.css';

const EMPTY_NOTE = { plantId: '', title: '', content: '', date: '' };

export default function Notes() {
  const [notes, setNotes] = useLocalStorage('verdant_notes', []);
  const [form, setForm] = useState(EMPTY_NOTE);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const showToast = useToast();

  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim()) return;
    if (editing !== null) {
      setNotes(prev => prev.map((n, i) => i === editing ? { ...form, date: new Date().toLocaleDateString() } : n));
      showToast('Note updated!', '✏️');
      setEditing(null);
    } else {
      setNotes(prev => [...prev, { ...form, date: new Date().toLocaleDateString() }]);
      showToast('Note saved!', '📝');
    }
    setForm(EMPTY_NOTE);
    setShowForm(false);
  };

  const handleEdit = (idx) => {
    setForm(notes[idx]);
    setEditing(idx);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (idx) => {
    setNotes(prev => prev.filter((_, i) => i !== idx));
    setDeleteConfirm(null);
    showToast('Note deleted', '🗑️');
  };

  const handleCancel = () => {
    setForm(EMPTY_NOTE);
    setEditing(null);
    setShowForm(false);
  };

  const linkedPlant = (id) => id ? plants.find(p => p.id === Number(id)) : null;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        <div className={styles.header}>
          <div>
            <h1 className="section-title">My Herbal Journal</h1>
            <p className="section-subtitle">Track your herbal experiences, dosage notes, and personal observations</p>
          </div>
          {!showForm && (
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              + New Note
            </button>
          )}
        </div>

        {/* Note Form */}
        {showForm && (
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>{editing !== null ? '✏️ Edit Note' : '📝 New Note'}</h3>

            <div className={styles.formGroup}>
              <label className={styles.label}>Note Title *</label>
              <input
                className={styles.input}
                type="text"
                placeholder="e.g. Ashwagandha Week 1 Observations"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Link to Plant (optional)</label>
              <select
                className={styles.select}
                value={form.plantId}
                onChange={e => setForm(f => ({ ...f, plantId: e.target.value }))}
              >
                <option value="">— None —</option>
                {plants.map(p => (
                  <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Notes *</label>
              <textarea
                className={styles.textarea}
                rows={5}
                placeholder="Describe your experience, dosage used, effects noticed, duration, side effects…"
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              />
            </div>

            <div className={styles.formActions}>
              <button className="btn-outline" onClick={handleCancel}>Cancel</button>
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={!form.title.trim() || !form.content.trim()}
              >
                {editing !== null ? 'Update Note' : 'Save Note'}
              </button>
            </div>
          </div>
        )}

        {/* Notes List */}
        {notes.length === 0 && !showForm ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📓</span>
            <h3>Your journal is empty</h3>
            <p>Start documenting your herbal journey — track what you're taking, when, and how it affects you.</p>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              Write First Note
            </button>
          </div>
        ) : (
          <div className={styles.notesList}>
            {[...notes].reverse().map((note, revIdx) => {
              const idx = notes.length - 1 - revIdx;
              const plant = linkedPlant(note.plantId);
              return (
                <div key={idx} className={styles.noteCard}>
                  <div className={styles.noteHeader}>
                    <div className={styles.noteMeta}>
                      {plant && (
                        <span className={styles.plantPill}>
                          {plant.emoji} {plant.name}
                        </span>
                      )}
                      <span className={styles.noteDate}>📅 {note.date}</span>
                    </div>
                    <div className={styles.noteActions}>
                      <button className={styles.actionBtn} onClick={() => handleEdit(idx)} title="Edit">✏️</button>
                      {deleteConfirm === idx ? (
                        <span className={styles.confirmDelete}>
                          Delete?
                          <button className={styles.confirmYes} onClick={() => handleDelete(idx)}>Yes</button>
                          <button className={styles.confirmNo} onClick={() => setDeleteConfirm(null)}>No</button>
                        </span>
                      ) : (
                        <button className={styles.actionBtn} onClick={() => setDeleteConfirm(idx)} title="Delete">🗑️</button>
                      )}
                    </div>
                  </div>
                  <h3 className={styles.noteTitle}>{note.title}</h3>
                  <p className={styles.noteContent}>{note.content}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
