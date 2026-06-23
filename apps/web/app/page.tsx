"use client";

import { useState, useEffect } from "react";
import { Todo } from "@repo/utils";
import Image from "next/image";
import { PiPlus, PiPencilSimpleLine, PiTrashSimple, PiFloppyDisk } from "react-icons/pi";

const C = {
  bg: "#FEF9E6",
  border: "#69701D",
  olive: "#69701D",
  muted: "#B6B98E",
  brown: "#3B2200",
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const API_URL = "http://localhost:5000/todos";

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) setTodos(await response.json());
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => { fetchTodos(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todo: newTodoText }),
      });
      if (res.ok) { setNewTodoText(""); fetchTodos(); }
    } catch (error) { console.error("Error creating todo:", error); }
  };

  const handleUpdate = async (id: string) => {
    if (!editingText.trim()) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todo: editingText }),
      });
      if (res.ok) { setEditingId(null); setEditingText(""); fetchTodos(); }
    } catch (error) { console.error("Error updating todo:", error); }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) fetchTodos();
    } catch (error) { console.error("Error deleting todo:", error); }
  };

  return (
    <div className="todo-wrapper" style={{ background: C.bg, fontFamily: "var(--font-patrick-hand), cursive" }}>

      {/* Header */}
      <header className="todo-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Image src="/assets/MainIcon.png" alt="Todo icon" width={60} height={60} />
          <h1 className="todo-title" style={{ fontFamily: "var(--font-voltaire), sans-serif", color: C.olive }}>
            To Do Lists
          </h1>
        </div>

        <form onSubmit={handleCreate} className="todo-form">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a new task..."
            className="todo-form-input"
            style={{
              border: `2px solid ${C.border}`,
              background: "transparent",
              color: C.brown,
              fontFamily: "var(--font-patrick-hand), cursive",
            }}
          />
          <button type="submit" style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "9px 20px",
            borderRadius: "999px",
            border: "none",
            background: C.olive,
            color: "white",
            fontFamily: "var(--font-patrick-hand), cursive",
            fontWeight: 400,
            fontSize: "15px",
            cursor: "pointer",
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
          }}>
            <PiPlus size={20} />
            Add
          </button>
        </form>
      </header>

      {/* Content Card */}
      <div className="todo-card" style={{ border: `2px solid ${C.border}`, background: C.bg }}>
        {todos.length === 0 ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "calc(100vh - 180px)",
            color: C.muted,
          }}>
            <Image src="/assets/CatNote.png" alt="No tasks" width={200} height={200} style={{ marginBottom: "0.20rem" }} />
            <p style={{ fontSize: "30px", margin: 0, fontFamily: "var(--font-patrick-hand), cursive" }}>
              No tasks yet. Add one above!
            </p>
          </div>
        ) : (
          <ul style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            alignContent: "flex-start",
          }}>
            {todos.map((item) => (
              <li key={item.id} className="todo-item">
                {editingId === item.id ? (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 12px",
                    borderRadius: "10px",
                    border: `2px solid ${C.border}`,
                    background: C.bg,
                  }}>
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="todo-edit-input"
                      style={{
                        border: `2px solid ${C.muted}`,
                        background: "white",
                        color: C.brown,
                        fontFamily: "var(--font-patrick-hand), cursive",
                      }}
                    />
                    <button onClick={() => handleUpdate(item.id)} title="Save"
                      style={{ background: "none", border: "none", cursor: "pointer", color: C.olive, display: "flex", padding: 0 }}>
                      <PiFloppyDisk size={22} />
                    </button>
                    <button onClick={() => setEditingId(null)} title="Cancel"
                      style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: "16px", display: "flex", padding: 0 }}>
                      ✕
                    </button>
                  </div>
                ) : (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "6px 16px",
                    borderRadius: "10px",
                    border: `2px solid ${C.border}`,
                    background: C.bg,
                    width: "100%",
                  }}>
                    <span style={{
                      color: C.brown,
                      fontSize: "20px",
                      fontFamily: "var(--font-patrick-hand), cursive",
                      flex: 1,
                      wordBreak: "break-word",
                    }}>{item.todo}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                      <button onClick={() => { setEditingId(item.id); setEditingText(item.todo); }} title="Edit"
                        style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, display: "flex", padding: 0 }}>
                        <PiPencilSimpleLine size={18} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} title="Delete"
                        style={{
                          width: "24px", height: "24px", borderRadius: "50%", border: "none",
                          background: C.muted, cursor: "pointer", display: "flex",
                          alignItems: "center", justifyContent: "center", color: "white", padding: 0,
                        }}>
                        <PiTrashSimple size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
