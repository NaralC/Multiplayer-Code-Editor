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
import defaultCode from "../constants/defaultCode";
import OutputBox from "../components/OutputBox";
import { GiLaptop } from "react-icons/gi";

const EditorPage: FC = () => {
  const [clients, setClients] = useState<IClientProps[]>([]);
  const routerNavigator = useNavigate();
  const { roomId } = useParams(); // Pull room id from url

  const [currentLanguage, setCurrentLanguage] = useState<string>(
    Object.keys(languages)[0]
  );
  const [currentTheme, setCurrentTheme] = useState<string>(
    Object.keys(themes)[0]
  );
  const [currentCode, setCurrentCode] = useState<string>(
    defaultCode["JavaScript"]
  );
  const codeRef = useRef(currentCode);
  const themeRef = useRef(currentTheme);
  const languageRef = useRef(currentLanguage);

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
          console.log("someone joined, sending results", resultRef.current);
          socketRef.current?.emit(ACTIONS.JOIN_SYNC, {
            code: codeRef.current,
            socketId,
            newTheme: themeRef.current,
            newLanguage: languageRef.current,
            newOutput: resultRef.current,
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
          setIsCompiling(compilationStatus);
        }
      );

      socketRef.current.on(ACTIONS.THEME_CHANGE, ({ newTheme }) => {
        setCurrentTheme(newTheme);
      });

      socketRef.current.on(ACTIONS.LANGUAGE_CHANGE, ({ newLanguage }) => {
        setCurrentLanguage(newLanguage);
      });

      socketRef.current.on(ACTIONS.OUTPUT_CHANGE, ({ newOutput }) => {
        setResult(newOutput);
        resultRef.current = newOutput;
      });
    };
    if (effectRan.current === false) init();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off(ACTIONS.JOINED);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
      socketRef.current?.off(ACTIONS.COMPILATION_STATUS_CHANGE);
      socketRef.current?.off(ACTIONS.THEME_CHANGE);
      socketRef.current?.off(ACTIONS.LANGUAGE_CHANGE);
      socketRef.current?.off(ACTIONS.OUTPUT_CHANGE);
      effectRan.current = true;
    };
  }, []);

  // Prevents hard typing the url
  if (!location.state) {
    return <Navigate to="/" />;
  }

  const [isCompiling, setIsCompiling] = useState(false);
  const [result, setResult] = useState<any>({});
  const resultRef = useRef(result);
  const handleCompilation = (): void => {
    const api = {
      host: import.meta.env.VITE_REACT_API_RAPID_API_HOST,
      key: import.meta.env.VITE_REACT_API_RAPID_API_KEY,
      url: import.meta.env.VITE_REACT_API_RAPID_API_URL,
    };

    const requestOptions = {
      method: "POST",
      url: `${api.url}`,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Key": `${api.key}`,
        "X-RapidAPI-Host": `${api.host}`,
      },
      data: `{"language_id":${
        languages[currentLanguage][1]
      },"source_code":"${window.btoa(codeRef.current)}","stdin":"SnVkZ2Uw"}`,
    };

    const getOptions = {
      method: "GET",
      url: `${api.url}`,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Key": `${api.key}`,
        "X-RapidAPI-Host": `${api.host}`,
      },
    };

    if (isCompiling) return;

    setIsCompiling(true);

    socketRef.current?.emit(ACTIONS.COMPILATION_STATUS_CHANGE, {
      roomId,
      compilationStatus: true,
      newOutput: null,
    });
    axios
      .request(requestOptions)
      .then(async (response) => {
        // console.log(response.data);
        const fetchOptions = {
          ...getOptions,
          url: getOptions.url + response.data.token,
        };

        const checkOutcome = async () => {
          axios.request(fetchOptions).then(({ data }) => {
            // console.log(data);
            setIsCompiling(false);
            setResult(data);
            resultRef.current = data;
            console.log(resultRef.current);

            socketRef.current?.emit(ACTIONS.COMPILATION_STATUS_CHANGE, {
              roomId,
              compilationStatus: false,
            });

            socketRef.current?.emit(ACTIONS.OUTPUT_CHANGE, {
              roomId,
              newOutput: data,
            });
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
        <div className="h-screen min-w-0 w-40 duration-300 md:w-64 p-5 bg-slate-900 text-4xl flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex flex-row justify-center text-5xl text-white md:text-7xl">
              <GiLaptop />
            </div>
            <p className="text-xl text-center text-white md:text-3xl duration-300 font-mono">
              Code Crush
            </p>
            <div className="">
              {clients.map((client, idx) => (
                <Client
                  key={idx}
                  nickname={client.nickname}
                  socketId={client.socketId}
                />
              ))}
            </div>
          </div>
          <div>
            <button
              type="button"
              className="w-full text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm md:text-lg px-5 py-2.5 text-center mr-2 mb-2"
              onClick={() => copyToClipboard(roomId)}
            >
              Copy Room ID
            </button>
            <button
              type="button"
              className="w-full text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm md:text-lg px-5 py-2.5 text-center mr-2 mb-2"
              onClick={() => routerNavigator("/")}
            >
              Leave Room
            </button>
          </div>
        </div>
        <div className="h-screen w-full text-4xl overflow-y-scroll bg-slate-900">
          <div className="flex flex-row mx-6 my-3 justify-between gap-5">
            <div className="flex flex-row w-28 sm:w-44 gap-5 duration-150">
              <Dropdown
                content={Object.keys(languages)}
                selected={currentLanguage}
                setSelected={setCurrentLanguage}
                roomId={roomId}
                socketRef={socketRef}
                auxiliaryRef={languageRef}
                dropdownType={"Language"}
                setCurrentCode={setCurrentCode}
              />
              <Dropdown
                content={Object.keys(themes)}
                selected={currentTheme}
                setSelected={setCurrentTheme}
                roomId={roomId}
                socketRef={socketRef}
                auxiliaryRef={themeRef}
                dropdownType={"Theme"}
                setCurrentCode={setCurrentCode}
              />
            </div>
            <AiFillPlayCircle
              className="hover:cursor-pointer text-white duration-150 md:text-4xl my-auto hover:scale-125 min-w-min sm:mr-6 drop-shadow-md shadow-lg rounded-full"
              onClick={handleCompilation}
              // onClick={() => {
              //   // currently using a mock version since the code judge API only allows 50 calls/day
              //   setIsCompiling(true);
              //   socketRef.current?.emit(ACTIONS.COMPILATION_STATUS_CHANGE, {
              //     roomId,
              //     compilationStatus: true,
              //   });

              //   setTimeout(() => {
              //     setIsCompiling(false);

              //     socketRef.current?.emit(ACTIONS.COMPILATION_STATUS_CHANGE, {
              //       roomId,
              //       compilationStatus: false,
              //     });
              //   }, 5000);
              // }}
            />
          </div>
          <div className="flex flex-col justify-evenly">
            <div className="bg-gray-800">
              <CodeMirrorEditor
                socketRef={socketRef}
                roomId={roomId}
                onCodeChange={(code) => {
                  codeRef.current = code;
                  // console.log(codeRef.current);
                }}
                currentTheme={themes[currentTheme]}
                currentCode={currentCode}
                setCurrentCode={setCurrentCode}
              />
            </div>
            <div className="">
              <div className="border-solid border-[2px] border-gray-600 m-3 bg-gray-600 rounded-full"></div>
              <OutputBox
                description={result?.status?.description}
                memory={result?.memory}
                stdout={result?.stdout}
                time={result?.time}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditorPage;