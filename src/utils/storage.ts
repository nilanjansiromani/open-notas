// Storage utilities for Chrome extension
export interface StorageData {
  notes: Note[];
}

export interface Note {
  id: string;
  content: string;
  todos: Todo[];
  createdAt: number;
  updatedAt: number;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export const StorageManager = {
  async getNotes(): Promise<Note[]> {
    return new Promise((resolve) => {
      chrome.storage.local.get(['notes'], (result: any) => {
        resolve(result.notes || []);
      });
    });
  },

  async saveNotes(notes: Note[]): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ notes }, () => {
        resolve();
      });
    });
  },

  async addNote(note: Note): Promise<void> {
    const notes = await this.getNotes();
    notes.unshift(note);
    await this.saveNotes(notes);
  },

  async updateNote(noteId: string, updates: Partial<Note>): Promise<void> {
    const notes = await this.getNotes();
    const index = notes.findIndex((n) => n.id === noteId);
    if (index !== -1) {
      notes[index] = { ...notes[index], ...updates };
      await this.saveNotes(notes);
    }
  },

  async deleteNote(noteId: string): Promise<void> {
    const notes = await this.getNotes();
    const filtered = notes.filter((n) => n.id !== noteId);
    await this.saveNotes(filtered);
  },

  async clearAllNotes(): Promise<void> {
    await this.saveNotes([]);
  },
};
