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
}

const CodeMirrorEditor: FC<ICodeMirrorEditorProps> = ({ socketRef, roomId }) => {
  const [code, setCode] = useState<string>('console.log("hello world")')

  const onChange = useCallback((value: string, viewUpdate: ViewUpdate) => {
    console.log(value);
    socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: value,
    });
  }, []);

  useEffect(() => {
    if (socketRef) {
      socketRef.current?.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        console.log('receiving')
        if (code !== null) {
          setCode(code);
        }
      });
    }
  }, [socketRef.current]);

  return (
    <div>
      <CodeMirror
        value={code}
        height="200px"
        extensions={[javascript({ jsx: true })]}
        onChange={onChange}
      />
    </div>
  );
};

export default CodeMirrorEditor;
