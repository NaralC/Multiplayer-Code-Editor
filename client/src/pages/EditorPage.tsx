import { FC, MutableRefObject, useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import ACTIONS from "../constants/actions";
import { IClientProps } from "../constants/interfaces";
import "../App.css";

import initSocket from "../utility/socket";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import CodeMirrorEditor from "../components/CodeMirrorEditor";
import Dropdown from "../components/Dropdown";
import themes from "../constants/themes";
import languages from "../constants/languages";
import { copyToClipboard } from "../utility/helpers";

const EditorPage: FC = () => {
  const [clients, setClients] = useState<IClientProps[]>([]);
  const codeRef = useRef(null);
  const routerNavigator = useNavigate();
  const { roomId } = useParams(); // Pull room id from url

  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const [currentTheme, setCurrentTheme] = useState(themes[0]);

  const socketRef: MutableRefObject<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null> = useRef(null);
  const location: any = useLocation();
  const effectRan = useRef<boolean>(false);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err: any) => handleErrors(err));
      socketRef.current.on("connect_failed", (err: any) => handleErrors(err));

      const handleErrors = (err: any): void => {
        console.log("socket error 💀", err);
        toast.error("Web socket connection failure lmao 👌");

        routerNavigator("/");
      };

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        nickname: location.state.nickname,
      });

      // Listen for joined events
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, nickname, socketId }: any) => {
          if (nickname !== location.state?.nickname) {
            toast.success(`${nickname} just joined the room!`);
          }
          setClients(clients);
          socketRef.current?.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
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
    if (effectRan.current === false) init();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off(ACTIONS.JOINED);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
      effectRan.current = true;
    };
  }, []);

  const leaveRoom = () => {
    routerNavigator("/");
  };

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
            onClick={() => copyToClipboard(roomId)}
          >
            Copy Room ID
          </button>
          <button
            type="button"
            className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            onClick={leaveRoom}
          >
            Leave Room
          </button>
        </div>
      </div>
      <div className="min-h-screen basis-4/5 bg-white text-4xl overflow-x-scroll">
        <div>Code Editor</div>
        <div className="flex flex-row m-6">
          <Dropdown content={languages} selected={currentLanguage} setSelected={setCurrentLanguage}/>
          <Dropdown content={themes} selected={currentTheme} setSelected={setCurrentTheme}/>
        </div>
        {/* <MonacoEditor
          defaultCode={defaultJS.defaultCode}
          language={defaultJS.language}
          onChange={defaultJS.onChange}
          theme={defaultJS.theme}
        /> */}
        <CodeMirrorEditor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
