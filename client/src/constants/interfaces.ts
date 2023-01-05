import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export interface IClientProps {
    socketId: number;
    nickname: string;
  };

export interface IMonacoEditorProps {
  onChange: () => void;
  language: string;
  defaultCode: string;
  theme: string;
}

export interface ICodeMirrorEditorProps {
  socketRef: MutableRefObject<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>;
  roomId: string | undefined;
  onCodeChange: (code: any) => void;
  currentTheme: "light" | "dark" | "none" | undefined
}

export interface IDropdownProps {
  content: string[];
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  socketRef: MutableRefObject<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>;
  auxiliaryRef: MutableRefObject<any>;
  roomId: string | undefined;
}

export interface IModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  description: string;
}