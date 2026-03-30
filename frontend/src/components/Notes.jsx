import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getNotes, createNote, updateNote, deleteNote } from "../api";
import { Plus, Edit2, Trash2, Check, X, ArrowLeft } from "lucide-react";

export default function Notes({ skill, token, onBack }) {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  async function loadNotes() {
    try {
      setLoading(true);
      const data = await getNotes(skill.id, token);
      setNotes(data);
    } catch (error) {
      toast.error("خطا در بارگذاری یادداشت‌ها");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, [skill]);

  async function addNote() {
    if (!content.trim()) {
      toast.error("متن یادداشت خالی است");
      return;
    }

    try {
      await createNote(skill.id, content, token);
      setContent("");
      toast.success("یادداشت اضافه شد");
      loadNotes();
    } catch (error) {
      toast.error("خطا در اضافه کردن یادداشت");
    }
  }

  async function handleUpdate(noteId) {
    if (!editContent.trim()) {
      toast.error("متن یادداشت خالی است");
      return;
    }

    try {
      await updateNote(skill.id, noteId, editContent, token);
      toast.success("یادداشت بروز شد");
      setEditingId(null);
      loadNotes();
    } catch (error) {
      toast.error("خطا در بروز‌رسانی یادداشت");
    }
  }

  async function handleDelete(noteId) {
    if (!window.confirm("آیا می‌خواهید این یادداشت را حذف کنید؟")) {
      return;
    }

    try {
      await deleteNote(skill.id, noteId, token);
      toast.success("یادداشت حذف شد");
      loadNotes();
    } catch (error) {
      toast.error("خطا در حذف یادداشت");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition lg:hidden"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{skill.title}</h3>
          <p className="text-gray-600">
            {notes.length} یادداشت
          </p>
        </div>
      </div>

      {/* Add Note */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          یادداشت جدید
        </label>
        <div className="flex gap-2">
          <input
            placeholder="یادداشت خود را اینجا بنویسید..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && e.ctrlKey) {
                addNote();
              }
            }}
            className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
          />
          <button
            onClick={addNote}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">اضافه</span>
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-4">📝</div>
            <p>هنوز یادداشتی اضافه نشده</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id}>
              {editingId === note.id ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    autoFocus
                    className="w-full px-3 py-2 rounded border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                    rows="3"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleUpdate(note.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition flex items-center gap-2"
                    >
                      <Check size={18} />
                      ذخیره
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded transition flex items-center gap-2"
                    >
                      <X size={18} />
                      کنسل
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-l-4 border-blue-400 p-4 rounded-lg group hover:shadow-md transition">
                  <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {new Date(note.created_at).toLocaleDateString("fa-IR")}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(note.id);
                          setEditContent(note.content);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="text-red-600 hover:text-red-800 transition flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}