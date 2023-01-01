import { Dispatch, MutableRefObject } from "react";
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
}

export interface IDropdownProps {
  content: string[];
  selected: string;
  setSelected: Dispatch<React.SetStateAction<string>>
}