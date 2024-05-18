import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Input, { Textarea } from "../components/utils/Input";
import Loader from "../components/utils/Loader";
import useFetch from "../hooks/useFetch";
import MainLayout from "../layouts/MainLayout";
import validateManyFields from "../validations";

const Task = () => {
  const authState = useSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const [fetchData, { loading }] = useFetch();
  const { taskId } = useParams();

  const mode = taskId === undefined ? "add" : "update";
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo", // Default status
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    document.title = mode === "add" ? "Add task" : "Update Task";
  }, [mode]);

  useEffect(() => {
    if (mode === "update") {
      const config = {
        url: `/tasks/${taskId}`,
        method: "get",
        headers: { Authorization: authState.token },
      };
      fetchData(config, { showSuccessToast: false }).then((data) => {
        setTask(data.task);
        setFormData({
          description: data.task.description,
          title: data.task.title,
          status: data.task.status, // Set status from fetched data
        });
      });
    }
  }, [mode, authState, taskId, fetchData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      title: task.title,
      description: task.description,
      status: task.status,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateManyFields("task", formData);
    setFormErrors({});

    if (errors.length > 0) {
      setFormErrors(
        errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {})
      );
      return;
    }

    const endpoint = mode === "add" ? "/tasks" : `/tasks/${taskId}`;
    const method = mode === "add" ? "post" : "put";

    const config = {
      url: endpoint,
      method: method,
      data: formData,
      headers: { Authorization: authState.token },
    };

    fetchData(config).then(() => {
      navigate("/");
    });
  };

  const fieldError = (field) => (
    <p
      className={`mt-1 text-pink-600 text-sm ${
        formErrors[field] ? "block" : "hidden"
      }`}
    >
      <i className="mr-2 fa-solid fa-circle-exclamation"></i>
      {formErrors[field]}
    </p>
  );

  return (
    <>
      <MainLayout>
        <form className="m-auto my-16 max-w-[700px] bg-white p-8 border-2 shadow-md rounded-md">
          {loading ? (
            <Loader />
          ) : (
            <>
              <h2 className="text-center mb-4">
                {mode === "add" ? "Add New Task" : "Edit Task"}
              </h2>
              <div className="mb-4">
                <label htmlFor="title">Title</label>
                <Input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  placeholder="Write here.."
                  onChange={handleChange}
                />
                {fieldError("title")}
              </div>
              <div className="mb-4">
                <label htmlFor="description">Description</label>
                <Textarea
                  type="text"
                  name="description"
                  id="description"
                  value={formData.description}
                  placeholder="Write here.."
                  onChange={handleChange}
                />
                {fieldError("description")}
              </div>
              <div className="mb-4">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full mt-2 px-3 py-2 text-gray-600 rounded-[4px] border-2 border-gray-100 focus:border-primary transition outline-none hover:border-gray-300"
                >
                  <option value="todo">Todo</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <button
                className="bg-primary text-white px-4 py-2 font-medium hover:bg-primary-dark"
                onClick={handleSubmit}
              >
                {mode === "add" ? "Add task" : "Update Task"}
              </button>
              <button
                className="ml-4 bg-red-500 text-white px-4 py-2 font-medium"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
              {mode === "update" && (
                <button
                  className="ml-4 bg-blue-500 text-white px-4 py-2 font-medium hover:bg-blue-600"
                  onClick={handleReset}
                >
                  Reset
                </button>
              )}
            </>
          )}
        </form>
      </MainLayout>
    </>
  );
};

export default Task;
