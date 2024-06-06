"use client";
import axios from "axios";
import Todo from "./components/Todo";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [todoData, setTodoData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTodo = async () => {
    setIsLoading(true);
    try {
      const response = await axios("/api");
      setTodoData(response.data.todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      toast.error("Failed to load todos. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete("api", {
        params: {
          mongoId: id,
        },
      });
      toast.success(response.data.msg);
      fetchTodo();
    } catch (error) {
      toast.error("Error");
    }
  };

  const completeTodo = async (id) => {
    try {
      const response = await axios.put(
        "api",
        {},
        {
          params: {
            mongoId: id,
          },
        }
      );
      toast.success(response.data.msg);
      fetchTodo();
    } catch (error) {
      toast.error("Error");
    }
  };

  useEffect(() => {
    fetchTodo();
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api", formData);
      toast.success(response.data.message);
      setFormData({ title: "", description: "" });
      await fetchTodo();
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to add todo. Please try again later.");
    }
  };

  return (
    <>
      <ToastContainer theme="dark" />
      <form
        onSubmit={onSubmitHandle}
        className="flex items-start flex-col gap-2 w-[80%] max-w-[600px] mt-24 px-2 mx-auto"
      >
        <input
          value={formData.title}
          onChange={handleOnChange}
          type="text"
          name="title"
          placeholder="Enter title"
          className="px-3 py-2 border-2 w-full"
        />
        <textarea
          value={formData.description}
          onChange={handleOnChange}
          name="description"
          placeholder="Enter description"
          className="px-3 py-2 border-2 w-full"
        ></textarea>
        <button type="submit" className="bg-orange-600 py-3 px-11 text-white">
          Add Todo
        </button>
      </form>
      {isLoading && <div className="loading">Loading...</div>}
      <div className="relative overflow-x-auto mt-24 w-[60%] mx-auto">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs uppercase dark:bg-orange-600 text-white">
            <tr>
              <th scope="col" className="px-6 py-3 text-center">
                Id
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {todoData.map((item, index) => (
              <Todo
                key={index}
                id={index}
                title={item.title}
                description={item.description}
                complete={item.isCompleted}
                mongoId={item._id}
                deleteTodo={deleteTodo}
                completeTodo={completeTodo}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
