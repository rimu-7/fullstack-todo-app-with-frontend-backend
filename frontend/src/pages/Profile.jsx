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

  const token = localStorage.getItem("token");

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get("/users/current", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        toast.error("Failed to load user profile");
      }
    };

    fetchUser();
  }, [token]);

  // Fetch todos
  useEffect(() => {
    if (user) {
      fetchTodos();
    }
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFormData({ title: "", description: "" });
      fetchTodos();
      toast.success("Todo created successfully");
    } catch (error) {
      toast.error("Failed to create todo");
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      const response = await API.put(
        `/todos/${todo._id}`,
        { completed: !todo.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Optimistic UI update - update local state immediately
      setTodos(
        todos.map((t) =>
          t._id === todo._id ? { ...t, completed: !t.completed } : t
        )
      );

      toast.success("Todo updated successfully");
    } catch (error) {
      console.error("Update failed:", error);
      // Revert if API call fails
      setTodos([...todos]);
      alert("Failed to update todo status");
    }
  };

  const handleDeleteTodo = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this todo?")) return;

    try {
      await API.delete(`/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Todo deleted successfully");
      fetchTodos();
    } catch (error) {
      alert("Failed to delete todo");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Profile</h2>
      {user ? (
        <div className="space-y-2 mb-8 max-w-2xl mx-auto text-center">
          <p>{/* <strong>ID:</strong> {user.id} */}</p>
          <p className="text-lg ">
            <strong>Hello, </strong> {user.name}, welcome to your profile,
            <br />
            create your task here, and don't forgot to complete your tasks.
          </p>
          <p>{/* <strong>Email:</strong> {user.email} */}</p>
          <LogoutButton />
        </div>
      ) : (
        <p className="text-center">Loading profile...</p>
      )}

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
            className=" px-3 py-2 rounded border focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className=" px-3 py-2 rounded border focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Todo
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Your Todos</h3>
        {loading ? (
          <p>Loading todos...</p>
        ) : todos.length === 0 ? (
          <p>No todos found.</p>
        ) : (
          <ul className="space-y-4">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className={`flex items-center justify-between p-4 border rounded-lg shadow hover:shadow-md transition-all ${
                  todo.completed ? "bg-green-200" : ""
                }`}
              >
                <div className="flex items-center gap-4 w-full">
                  <input
                    type="checkbox"
                    checked={todo.completed || false}
                    onChange={() => handleToggleComplete(todo)}
                    className="w-5 h-5 cursor-pointer rounded"
                  />
                  <div className="flex-1">
                    <h4
                      className={`font-semibold text-lg ${
                        todo.completed
                          ? "line-through text-black "
                          : "text-gray-50"
                      }`}
                    >
                      {todo.title}
                    </h4>
                    <p
                      className={`${
                        todo.completed
                          ? "line-through text-gray-500"
                          : "text-gray-500"
                      }`}
                    >
                      {todo.description}
                    </p>
                    <small className="text-gray-500 block mt-1">
                      {new Date(todo.createdAt).toLocaleString()}
                    </small>
                  </div>
                  {todo.completed && (
                    <button
                      onClick={() => handleDeleteTodo(todo._id)}
                      className="text-red-500 hover:text-red-700 transition p-2"
                      aria-label="Delete todo"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
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
