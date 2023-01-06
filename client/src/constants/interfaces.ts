import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export interface IClientProps {
    socketId: number;
    nickname: string;
  };
export interface ICodeMirrorEditorProps {
  socketRef: MutableRefObject<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>;
  roomId: string | undefined;
  onCodeChange: (code: string) => void;
  currentTheme: "light" | "dark" | "none" | undefined;
  currentCode: string;
  setCurrentCode: Dispatch<SetStateAction<string>>;
}

export interface IDropdownProps {
  content: string[];
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  socketRef: MutableRefObject<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>;
  auxiliaryRef: MutableRefObject<string>;
  roomId: string | undefined;
  dropdownType: string;
  setCurrentCode: Dispatch<SetStateAction<string>>;
}

export interface IModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  description: string;
}

export interface IOutputBox {
  time: string;
  memory: string;
  stdout: string;
  description: string;
}