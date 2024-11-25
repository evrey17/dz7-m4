import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // Получение списка задач
  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке задач:", error);
    }
  };

  // Добавление новой задачи
  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post(API_URL, {
        title: newTodo,
        completed: false,
      });
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.error("Ошибка при добавлении задачи:", error);
    }
  };

  // Удаление задачи
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error);
    }
  };

  // Обновление статуса задачи
  const toggleTodo = async (id, completed) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, { completed });
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: response.data.completed } : todo
        )
      );
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Todo List</h1>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Новая задача"
        />
        <button onClick={addTodo}>Добавить</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{ marginBottom: "10px" }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id, !todo.completed)}
            />
            <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
