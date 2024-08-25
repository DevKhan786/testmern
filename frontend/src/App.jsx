import React, { useEffect, useState } from "react";
import axios from "axios";
import "./app.css";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [todoValue, setTodoValue] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/todos");
        setTodos(response.data);
      } catch (err) {
        console.error("Error fetching todos: ", err);
      }
    };

    fetchTodos();
  }, []);

  const addTask = async () => {
    if (!todoValue.trim()) {
      return alert("Task cannot be empty");
    }
    try {
      const response = await axios.post("http://localhost:5000/todos", {
        text: todoValue,
      });
      setTodos([...todos, response.data]);
      setTodoValue("");
    } catch (err) {
      console.error("Error adding todo: ", err);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const response = await axios.put(`http://localhost:5000/todos/${id}`, {
        completed: !completed,
      });
      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, completed: response.data.completed } : todo
        )
      );
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const startEditing = (todo) => {
    setEditingTodo(todo);
    setEditText(todo.text);
  };

  const saveEdit = async () => {
    if (!editText.trim()) {
      return alert("Text cannot be empty");
    }
    try {
      const response = await axios.put(`http://localhost:5000/todos/${editingTodo._id}`, {
        text: editText,
        completed: editingTodo.completed,
      });
      setTodos(
        todos.map((todo) =>
          todo._id === editingTodo._id ? response.data : todo
        )
      );
      setEditingTodo(null);
      setEditText("");
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-900">ToDo App</h1>
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex mb-6">
          <input
            type="text"
            value={todoValue}
            placeholder="Enter Task"
            onChange={(e) => setTodoValue(e.target.value)}
            className="flex-1 p-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300 ease-in-out"
          />
          <button
            onClick={addTask}
            className="p-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 ease-in-out"
          >
            Add
          </button>
        </div>
        {editingTodo && (
          <div className="mb-6 border-t border-gray-300 pt-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Edit Task</h2>
            <div className="flex mb-4">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 p-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300 ease-in-out"
              />
              <button
                onClick={saveEdit}
                className="p-4 bg-green-600 text-white rounded-r-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 transition-all duration-300 ease-in-out"
              >
                Save
              </button>
              <button
                onClick={() => setEditingTodo(null)}
                className="ml-2 p-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all duration-300 ease-in-out"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <ul className="list-none">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className={`p-4 mb-4 border border-gray-300 rounded-lg flex justify-between items-center transition-transform duration-300 ease-in-out transform ${
                todo.completed ? "bg-green-50 scale-105" : "bg-white"
              }`}
            >
              <span
                onClick={() => toggleComplete(todo._id, todo.completed)}
                className={`cursor-pointer text-lg transition-all duration-300 ease-in-out ${
                  todo.completed ? "line-through text-gray-600" : "text-gray-800"
                }`}
              >
                {todo.text}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => startEditing(todo)}
                  className="text-blue-600 hover:text-blue-700 transition-all duration-300 ease-in-out"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(todo._id)}
                  className="text-red-600 hover:text-red-700 transition-all duration-300 ease-in-out"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
