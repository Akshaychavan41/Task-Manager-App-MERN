import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loader from "./utils/Loader";
import Tooltip from "./utils/Tooltip";

const Tasks = () => {
  const authState = useSelector((state) => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [fetchData, { loading }] = useFetch();

  const fetchTasks = useCallback(() => {
    const config = {
      url: "/tasks",
      method: "get",
      headers: { Authorization: authState.token },
    };
    fetchData(config, { showSuccessToast: false }).then((data) => {
      setTasks(data.tasks);
      setFilteredTasks(data.tasks);
    });
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);

  const handleDelete = (id) => {
    const config = {
      url: `/tasks/${id}`,
      method: "delete",
      headers: { Authorization: authState.token },
    };
    fetchData(config).then(() => fetchTasks());
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "done":
        return "bg-green-100";
      case "inprogress":
        return "bg-yellow-100";
      case "todo":
        return "bg-blue-100";
      default:
        return "bg-gray-100";
    }
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    if (status === "all") {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter((task) => task.status === status));
    }
  };

  return (
    <>
      <div className="my-2 mx-auto max-w-[95%] md:max-w-[700px] py-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h2 className="text-xl mb-2 md:mb-0">
            Your tasks ({filteredTasks.length})
          </h2>
          <Link
            to="/tasks/add"
            className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2"
          >
            + Add new task
          </Link>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-4 py-2 rounded ${
              filterStatus === "all"
                ? "bg-gray-700 text-white"
                : "bg-gray-300 text-gray-700"
            } `}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange("todo")}
            className={`px-4 py-2 rounded ${
              filterStatus === "todo"
                ? "bg-blue-500 text-white"
                : "bg-blue-100 text-blue-700"
            } `}
          >
            To Do
          </button>
          <button
            onClick={() => handleFilterChange("inprogress")}
            className={`px-4 py-2 rounded ${
              filterStatus === "inprogress"
                ? "bg-yellow-500 text-white"
                : "bg-yellow-100 text-yellow-700"
            } `}
          >
            In Progress
          </button>
          <button
            onClick={() => handleFilterChange("done")}
            className={`px-4 py-2 rounded ${
              filterStatus === "done"
                ? "bg-green-500 text-white"
                : "bg-green-100 text-green-700"
            } `}
          >
            Done
          </button>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div>
            {filteredTasks.length === 0 ? (
              <div className="w-full h-[300px] flex items-center justify-center gap-4">
                <span>No tasks found</span>
              </div>
            ) : (
              filteredTasks.map((task, index) => (
                <div
                  key={task._id}
                  className={`my-4 p-4 md:p-6 text-gray-600 rounded-md shadow-md ${getStatusColor(
                    task.status
                  )}`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                    <span className="font-medium mb-2 md:mb-0">
                      Task #{index + 1}
                    </span>
                    <div className="flex space-x-2">
                      <Tooltip text={"Edit this task"} position={"top"}>
                        <Link
                          to={`/tasks/${task._id}`}
                          className="text-green-600 cursor-pointer"
                        >
                          <i className="fa-solid fa-pen"></i>
                        </Link>
                      </Tooltip>

                      <Tooltip text={"Delete this task"} position={"top"}>
                        <span
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleDelete(task._id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Title: </span>
                    <span>{task.title}</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Description: </span>
                    <span>{task.description}</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Status: </span>
                    <span>
                      {task.status.charAt(0).toUpperCase() +
                        task.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Tasks;
