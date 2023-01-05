import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaLaptopCode } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useKeyPress from "../hooks/useKeyPress";
import "../App.css";
import { Transition } from "@headlessui/react";

const HomePage: FC = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");

  const enterIsDown = useKeyPress("Enter");
  const enterIsDownRef = useRef(false); // This makes the hook run only once

  useEffect(() => {
    if (enterIsDownRef.current) return;
    enterIsDownRef.current = true;
  }, [enterIsDown]);

  const createNewRoom = (): void => {
    const newId = uuidv4();
    setRoomId(newId);

    toast.success("Created new room");
  };

  const joinRoom = (e: ChangeEvent<any>): void | Promise<void> => {
    e.preventDefault();

    if (!nickname || !roomId) {
      toast.error("Missing credentials");
      return;
    }

    setTimeout(() => {
      // Send data to the next page
      navigate(`/editor/${roomId}`, {
        state: {
          nickname: nickname,
        },
      });
    }, 1000);
  };

  // For initial page load animation
  const [isShowing, setIsShowing] = useState<boolean>(false);
  const effectRan = useRef<boolean>(false);
  useEffect(() => {
    if (effectRan.current === false) {
      setIsShowing(true);
    }
    return () => {
      effectRan.current = true;
    };
  });

  return (
    <div className="page-background">
      <Transition
        show={isShowing}
        enter="transition-all duration-500"
        enterFrom="opacity-0 scale-50"
        enterTo="opacity-100 scale-100"
        leave="transition-all duration-150"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-50"
      >
        <div className="bg-white p-5 rounded-md flex flex-col gap-5 shadow-black shadow-md duration">
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
                type="text"
                id="nickname"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Nickname"
                onChange={(e) => setNickname(e.target.value)}
                value={nickname}
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
                onChange={(e) => setRoomId(e.target.value)}
                value={roomId}
                required
              />
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={(e) => joinRoom(e)}
            >
              Submit
            </button>
          </form>
          <div
            className="underline underline-offset-2 cursor-pointer"
            onClick={createNewRoom}
          >
            If you don't have a room ID, click here to generate one.
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default HomePage;
