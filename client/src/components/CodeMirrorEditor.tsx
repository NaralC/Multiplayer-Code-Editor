import { FC, useCallback, useEffect, useRef, useState } from "react";
import { ViewUpdate } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
import ACTIONS from "../constants/actions";
import { ICodeMirrorEditorProps } from "../constants/interfaces";

const CodeMirrorEditor: FC<ICodeMirrorEditorProps> = ({ socketRef, roomId, onCodeChange, currentTheme }) => {
  const [code, setCode] = useState<string>('console.log("hello world")')

  const onChange = useCallback((newCode: string, viewUpdate: ViewUpdate) => {
    socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: newCode,
    });
    onCodeChange(newCode);
  }, []);

  const effectRan = useRef<boolean>(false)
  useEffect(() => {
      if (socketRef.current) {
        socketRef.current?.on(ACTIONS.CODE_CHANGE, ({ code }) => {
          if (code !== null) {
            setCode(code);
          }
        });
      }

    return () => {
      socketRef.current?.off(ACTIONS.CODE_CHANGE);
      effectRan.current = true;
    }
  }, [socketRef.current]);

  return (
      <CodeMirror
        value={code}
        height="250px"
        extensions={[javascript({ jsx: true, typescript: true })]}
        onChange={onChange}
        theme={currentTheme}
      />
  );
};

export default CodeMirrorEditor;
