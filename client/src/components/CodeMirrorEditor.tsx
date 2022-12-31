import { FC, MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { ViewUpdate, EditorView } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import CodeMirror from "@uiw/react-codemirror";
import { useCodeMirror } from "@uiw/react-codemirror";

import Codemirror from "codemirror";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import ACTIONS from "../constants/actions";

interface ICodeMirrorEditorProps {
  socketRef: MutableRefObject<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>;
  roomId: string | undefined;
  onCodeChange: (code: any) => void;
}

const CodeMirrorEditor: FC<ICodeMirrorEditorProps> = ({ socketRef, roomId, onCodeChange }) => {
  const [code, setCode] = useState<string>('console.log("hello world")')

  const onChange = useCallback((newCode: string, viewUpdate: ViewUpdate) => {
    // console.log(value);
    socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: newCode,
    });
    onCodeChange(newCode);
  }, []);

  const effectRan = useRef<boolean>(false)

  useEffect(() => {
    if (effectRan.current===true) {
      console.log('True is working')
      if (socketRef.current) {
        socketRef.current?.on(ACTIONS.CODE_CHANGE, ({ code }) => {
          console.log('receiving')
          if (code !== null) {
            setCode(code);
          }
        });
      }
    }

    return () => {
      socketRef.current?.off(ACTIONS.CODE_CHANGE);
      effectRan.current = true;
      console.log('Working.')
    }
  }, [socketRef.current]);


  return (
      <CodeMirror
        value={code}
        height="200px"
        extensions={[javascript({ jsx: true })]}
        onChange={onChange}
        theme={okaidia}
      />
  );
};

export default CodeMirrorEditor;
