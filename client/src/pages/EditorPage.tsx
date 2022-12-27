import { FC, MutableRefObject, useEffect, useRef, useState } from "react";

import Client from "../components/Client";
import CodeEditor from "../components/CodeEditor";
import { IClientProps } from "../constants/interfaces";
import { defaultJS } from "../constants/defaultCode";
import "../App.css";

import initSocket from "../socket/socket";
import ACTIONS from "../constants/actions";

const EditorPage: FC = () => {
  const socketRef: MutableRefObject<any> = useRef();

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.emit(ACTIONS.JOIN);
    };
    init();
  }, []);

  const [clients, setClients] = useState<IClientProps[]>([
    {
      socketId: 1,
      nickname: "Mark Krit",
    },
    {
      socketId: 2,
      nickname: "Ice Wallow Come",
    },
    {
      socketId: 3,
      nickname: "Your Mom",
    },
  ]);

  return (
    <div className="page-background">
      <div className="h-screen min-w-fit p-5 basis-1/5 bg-gray-300">
        <div className="text-4xl flex flex-col justify-around">
          Navbar
          <div className="">
            {clients.map((client, idx) => (
              <Client
                key={idx}
                nickname={client.nickname}
                socketId={client.socketId}
              />
            ))}
          </div>
          <button
            type="button"
            className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            Copy Room ID
          </button>
          <button
            type="button"
            className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            Leave Room
          </button>
        </div>
      </div>
      <div className="h-screen basis-4/5 bg-white text-4xl">
        Code Editor
        <CodeEditor
          defaultCode={defaultJS.defaultCode}
          language={defaultJS.language}
          onChange={defaultJS.onChange}
          theme={defaultJS.theme}
        />
      </div>
    </div>
  );
};

export default EditorPage;
