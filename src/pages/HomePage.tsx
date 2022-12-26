import { FC } from "react";
import { FaLaptopCode } from "react-icons/fa";

type HomePageProps = {};

const HomePage: FC = (props: HomePageProps) => {
  return (
    <div className="w-screen min-h-screen bg-gray-600 flex flex-col justify-center items-center">
      <div className="bg-white p-5 rounded-md flex flex-col gap-5 shadow-black shadow-md">
        <FaLaptopCode className="text-7xl mx-auto" />
        <div className="font-semibold mx-auto">
          Code Crush — Multiplayer Code Editor
        </div>
        <form>
          <div className="mb-6">
            <label
              htmlFor="nickname"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your Nickname
            </label>
            <input
              type="textInput"
              id="nickname"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Nickname"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="roomId"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Room ID
            </label>
            <input
              type="textInput"
              id="roomId"
              placeholder="Room ID"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
        <div className="underline underline-offset-2">
          If you don't have an invite, click here to generate one.
        </div>
      </div>
    </div>
  );
};

export default HomePage;
