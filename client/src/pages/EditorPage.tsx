import { FC, MutableRefObject, useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import CodeEditor from "../components/CodeEditor";
import ACTIONS from "../constants/actions";
import { IClientProps } from "../constants/interfaces";
import { defaultJS } from "../constants/defaultCode";
import "../App.css";

import initSocket from "../socket/socket";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const EditorPage: FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams(); // Pull room id from url

  const socketRef: MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null> = useRef(null);
  const location: any = useLocation();

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err: any) => handleErrors(err));
      socketRef.current.on("connect_failed", (err: any) => handleErrors(err));

      const handleErrors = (err: any): void => {
        console.log("socket error 💀", err);
        toast.error("Web socket connection failure lmao 👌");

        navigate("/");
      };

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        nickname: location.state.nickname,
      });

      // Listen for joined events
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, nickname, socketId }: any) => {
          if (nickname !== location.state.nickname) {
            toast.success(`${nickname} just joned the room!`);
          }
          setClients(clients);
        }
      );

      socketRef.current.on(
        ACTIONS.DISCONNECTED,
        ({ socketId, nickname }: any) => {
          toast.success(`${nickname} left the room.`);
          setClients((prev) => {
            return prev.filter((client) => client.socketId !== socketId);
          });
        }
      );
    };
    init();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off(ACTIONS.JOINED);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
    }
  }, []);

  const [clients, setClients] = useState<IClientProps[]>([]);

  if (!location.state) {
    return <Navigate to="/" />;
  }

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
