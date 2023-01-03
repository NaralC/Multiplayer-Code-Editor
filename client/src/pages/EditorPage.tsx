import { FC, useEffect, useRef, useState } from "react";
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
import axios from "axios";
import Modal from "../components/Modal";
import { AiFillPlayCircle } from "react-icons/ai";

const EditorPage: FC = () => {
  const [clients, setClients] = useState<IClientProps[]>([]);
  const codeRef = useRef(null);
  const routerNavigator = useNavigate();
  const { roomId } = useParams(); // Pull room id from url

  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const [currentTheme, setCurrentTheme] = useState(themes[0]);

  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  const location: any = useLocation();
  const effectRan = useRef(false);

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

      socketRef.current.on(
        ACTIONS.COMPILATION_STATUS_CHANGE,
        ({ compilationStatus }) => {
          console.log('ayo received something here', compilationStatus);
          setIsCompiling(isCompiling);
        }
      );
    };
    if (effectRan.current === false) init();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off(ACTIONS.JOINED);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
      socketRef.current?.off(ACTIONS.COMPILATION_STATUS_CHANGE);
      effectRan.current = true;
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  const [isCompiling, setIsCompiling] = useState(false);
  const handleCompilation = (): void => {
    if (isCompiling) return;

    setIsCompiling(true);
    axios
      .request({
        method: "POST",
        url: "https://judge0-ce.p.rapidapi.com/submissions",
        params: { base64_encoded: "true", fields: "*" },
        headers: {
          "content-type": "application/json",
          "Content-Type": "application/json",
          "X-RapidAPI-Key":
            "4af38674cfmshe4a55f5494063dep1de90djsn4445d89292fa",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        data: '{"language_id":52,"source_code":"I2luY2x1ZGUgPHN0ZGlvLmg+CgppbnQgbWFpbih2b2lkKSB7CiAgY2hhciBuYW1lWzEwXTsKICBzY2FuZigiJXMiLCBuYW1lKTsKICBwcmludGYoImhlbGxvLCAlc1xuIiwgbmFtZSk7CiAgcmV0dXJuIDA7Cn0=","stdin":"SnVkZ2Uw"}',
      })
      .then(async (response) => {
        console.log(response.data);

        const checkOutcome = async () => {
          axios
            .request({
              method: "GET",
              url: `https://judge0-ce.p.rapidapi.com/submissions/${response.data?.token}`,
              params: { base64_encoded: "true", fields: "*" },
              headers: {
                "X-RapidAPI-Key":
                  "4af38674cfmshe4a55f5494063dep1de90djsn4445d89292fa",
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
              },
            })
            .then(({ data }) => {
              console.log(data);
              setIsCompiling(false);
            });
        };

        checkOutcome();
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          console.log(err);
        } else {
          console.error(err);
        }

        setIsCompiling(false);
      });
  };

  return (
    <>
      <Modal
        isOpen={isCompiling}
        setIsOpen={setIsCompiling}
        title={"Code is Being Compiled..."}
        description={"Please wait — we appreciate your patience!"}
      />
      <div className="page-background">
        <div className="min-h-screen min-w-fit p-5 basis-1/5 bg-gray-300">
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
              onClick={() => routerNavigator("/")}
            >
              Leave Room
            </button>
          </div>
        </div>
        <div className="min-h-screen basis-4/5 bg-white text-4xl overflow-x-scroll">
          <div>Code Editor</div>
          <div className="flex flex-row m-6 gap-6 z-0">
            <Dropdown
              content={languages}
              selected={currentLanguage}
              setSelected={setCurrentLanguage}
            />
            <Dropdown
              content={themes}
              selected={currentTheme}
              setSelected={setCurrentTheme}
            />
            <AiFillPlayCircle
              className="hover:cursor-pointer"
              // onClick={handleCompilation}
              onClick={() => {
                // currently using a mock version since the code judge API only allows 50 calls/day
                setIsCompiling(true);
                socketRef.current?.emit(ACTIONS.COMPILATION_STATUS_CHANGE, {
                  roomId,
                  compilationStatus: true
                });

                setTimeout(() => {
                  setIsCompiling(false);

                  socketRef.current?.emit(ACTIONS.COMPILATION_STATUS_CHANGE, {
                    roomId,
                    compilationStatus: false
                  });
                }, 5000);
              }}
            />
            <div>{isCompiling === true ? "Compiling" : "Not Compiling"}</div>
          </div>
          <CodeMirrorEditor
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
          />
        </div>
      </div>
    </>
  );
};

export default EditorPage;
