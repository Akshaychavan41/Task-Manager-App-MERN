import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Tasks from "../components/Tasks";
import MainLayout from "../layouts/MainLayout";

const Home = () => {
  const authState = useSelector((state) => state.authReducer);
  const { isLoggedIn } = authState;

  useEffect(() => {
    document.title = authState.isLoggedIn
      ? `${authState.user.name}'s tasks`
      : "Task Manager";
  }, [authState]);

  return (
    <>
      <MainLayout>
        {!isLoggedIn ? (
          <div className="flex items-center justify-center bg-teal-600 text-white h-[60vh] py-8 text-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">
                Welcome to Task Manager App
              </h1>
              <p className="text-lg mb-8">
                Join now to manage your tasks efficiently and effectively
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center text-xl bg-white text-teal-600 font-semibold px-6 py-3 rounded-md shadow-md hover:bg-gray-100 transition duration-300"
              >
                Join Now
                <i className="fa-solid fa-arrow-right ml-3"></i>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8 mx-8 p-4 bg-teal-100  rounded-md shadow-sm">
              <h1 className="text-2xl font-semibold mb-2">
                Welcome, {authState.user.name}
              </h1>
              <p className="text-gray-600">Here are your tasks for today:</p>
            </div>
            <Tasks />
          </>
        )}
      </MainLayout>
    </>
  );
};

export default Home;
