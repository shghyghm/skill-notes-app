import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getSkills, createSkill, updateSkill, deleteSkill } from "../api";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";

export default function Skills({ token, onSelect }) {
  const [skills, setSkills] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  async function loadSkills() {
    try {
      setLoading(true);
      const data = await getSkills(token);
      setSkills(data);
    } catch (error) {
      toast.error("خطا در بارگذاری مهارت‌ها");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSkills();
  }, [token]);

  async function addSkill() {
    if (!title.trim()) {
      toast.error("نام مهارت خالی است");
      return;
    }

    try {
      await createSkill(title, token);
      setTitle("");
      toast.success("مهارت اضافه شد");
      loadSkills();
    } catch (error) {
      toast.error("خطا در اضافه کردن مهارت");
    }
  }

  async function handleUpdate(skillId) {
    if (!editTitle.trim()) {
      toast.error("نام مهارت خالی است");
      return;
    }

    try {
      await updateSkill(skillId, editTitle, token);
      toast.success("مهارت بروز شد");
      setEditingId(null);
      loadSkills();
    } catch (error) {
      toast.error("خطا در بروز‌رسانی مهارت");
    }
  }

  async function handleDelete(skillId) {
    if (!window.confirm("آیا می‌خواهید این مهارت را حذف کنید؟")) {
      return;
    }

    try {
      await deleteSkill(skillId, token);
      toast.success("مهارت حذف شد");
      loadSkills();
    } catch (error) {
      toast.error("خطا در حذف مهارت");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">مهارت‌های من</h2>
        <div className="flex gap-2">
          <input
            placeholder="نام مهارت جدید"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addSkill()}
            className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
          />
          <button
            onClick={addSkill}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {skills.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>هنوز مهارتی اضافه نشده</p>
          </div>
        ) : (
          skills.map((skill) => (
            <div key={skill.id}>
              {editingId === skill.id ? (
                <div className="flex gap-2 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    autoFocus
                    className="flex-1 px-3 py-1 rounded border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleUpdate(skill.id)}
                    className="bg-green-500 hover:bg-green-600 text-white p-1 rounded transition"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 hover:bg-gray-500 text-white p-1 rounded transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => onSelect(skill)}
                  className="p-3 rounded-lg border-l-4 border-blue-500 bg-blue-50 hover:bg-blue-100 cursor-pointer transition group flex items-center justify-between"
                >
                  <span className="font-medium text-gray-800">{skill.title}</span>
                  <div className="opacity-0 group-hover:opacity-100 transition flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(skill.id);
                        setEditTitle(skill.title);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(skill.id);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
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