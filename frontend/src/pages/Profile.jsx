import React, { useEffect, useState } from "react";
import API from "../../api";
import { Trash2 } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [selectedTodos, setSelectedTodos] = useState([]);
  const [userLoading, setUserLoading] = useState(true); // Add loading state for user

  const token = localStorage.getItem("token");

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUserLoading(true);
        const response = await API.get("/users/current", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        toast.error("Failed to load user profile");
        console.log("Failed to load user profile", error);
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  // Fetch todos
  useEffect(() => {
    if (user) fetchTodos();
  }, [user]);

  const fetchTodos = async () => {
    try {
      const response = await API.get("/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedTodos = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTodos(sortedTodos);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load todos");
      console.log("Failed to load todos", error);
      
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      await API.post(
        "/todos",
        { ...formData, completed: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData({ title: "", description: "" });
      fetchTodos();
      toast.success("Todo created successfully");
    } catch (error) {
      console.log("Failed to create todo", error);
      toast.error("Failed to create todo");
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      await API.put(
        `/todos/${todo._id}`,
        { completed: !todo.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos(
        todos.map((t) =>
          t._id === todo._id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (error) {
      console.log("Failed to update todo status", error);
      toast.error("Failed to update todo status");
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await API.delete(`/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Todo deleted successfully");
      fetchTodos();
      setSelectedTodos((prev) => prev.filter((todoId) => todoId !== id));
    } catch (error) {
      toast.error("Failed to delete todo");
    }
  };

  // Multi-select logic
  const toggleSelect = (id) => {
    setSelectedTodos((prev) =>
      prev.includes(id) ? prev.filter((todoId) => todoId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTodos.length === todos.length) {
      setSelectedTodos([]);
    } else {
      setSelectedTodos(todos.map((t) => t._id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedTodos.length === 0) return;

    try {
      await Promise.all(
        selectedTodos.map((id) =>
          API.delete(`/todos/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      toast.success("Selected todos deleted");
      setSelectedTodos([]);
      fetchTodos();
    } catch (error) {
      toast.error("Failed to delete selected todos");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Profile</h2>

      {userLoading ? (
        <div className="space-y-2 mb-8 max-w-2xl mx-auto text-center">
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4 animate-pulse"></div>
          <div className="h-10 bg-gray-300 rounded w-32 mx-auto animate-pulse"></div>
        </div>
      ) : user ? (
        <div className="space-y-2 mb-8 max-w-2xl mx-auto text-center">
          <p className="text-lg">
            <strong>Hello, </strong> {user.name}, welcome to your profile.
          </p>
          <LogoutButton />
        </div>
      ) : (
        <p className="text-center text-red-500">Failed to load profile</p>
      )}

      {/* Add New Todo */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Add New Todo</h3>
        <form
          onSubmit={handleAddTodo}
          className="flex flex-col md:flex-row gap-4 items-center"
        >
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="px-3 py-2 rounded border focus:outline-none focus:border-blue-500 flex-1"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="px-3 py-2 rounded border focus:outline-none focus:border-blue-500 flex-1"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Todo
          </button>
        </form>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mb-4 justify-end">
        <button
          onClick={toggleSelectAll}
          disabled={todos.length === 0}
          className={`px-3 py-1 rounded transition ${
            todos.length === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-700 text-white hover:bg-gray-800"
          }`}
        >
          {selectedTodos.length === todos.length && selectedTodos.length > 0
            ? "Deselect All"
            : "Select All"}
        </button>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedTodos.length === 0}
          className={`px-3 py-1 rounded transition ${
            selectedTodos.length === 0
              ? "bg-red-300 text-gray-500 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          Delete Selected ({selectedTodos.length})
        </button>
      </div>

      {/* Todos List */}
      <div>
        <h3 className="text-2xl font-semibold mb-4 flex justify-between items-center">
          Your Todos
        </h3>

        {loading ? (
          // Placeholder while loading todos
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg shadow animate-pulse">
                <div className="flex items-center gap-4 w-full">
                  <div className="w-5 h-5 bg-gray-300 rounded"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                  <div className="w-5 h-5 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : todos.length === 0 ? (
          <p className="text-center">No todos found.</p>
        ) : (
          <ul className="space-y-4">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className={`flex items-center justify-between p-4 border rounded-lg shadow hover:shadow-md transition-all ${
                  selectedTodos.includes(todo._id)
                    ? "bg-blue-300 text-black"
                    : ""
                }`}
              >
                <div className="flex items-center gap-4 w-full">
                  {/* Multi-select */}
                  <input
                    type="checkbox"
                    checked={selectedTodos.includes(todo._id)}
                    onChange={() => toggleSelect(todo._id)}
                    className="w-5 h-5 cursor-pointer"
                  />

                  <div className="flex-1">
                    <h4
                      className={`font-semibold mb-2 text-xl ${
                        todo.completed ? "line-through" : ""
                      }`}
                      onClick={() => handleToggleComplete(todo)}
                    >
                      {todo.title}
                    </h4>
                    <p className={todo.completed ? "line-through" : ""}>
                      {todo.description}
                    </p>
                    <small className="text-gray-400 block mt-1">
                      {new Date(todo.createdAt).toLocaleString()}
                    </small>
                  </div>

                  {/* Delete individual todo */}
                  <button
                    onClick={() => handleDeleteTodo(todo._id)}
                    className="ml-4 p-1 rounded hover:bg-red-200 transition"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Profile;