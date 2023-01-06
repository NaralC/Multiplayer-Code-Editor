import { FC, useCallback, useEffect, useRef, useState } from "react";
import { ViewUpdate } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";
import ACTIONS from "../constants/actions";
import { ICodeMirrorEditorProps } from "../constants/interfaces";

const CodeMirrorEditor: FC<ICodeMirrorEditorProps> = ({ socketRef, roomId, onCodeChange, currentTheme, currentCode, setCurrentCode }) => {

  const onChange = useCallback((newCode: string, viewUpdate: ViewUpdate) => {
    socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: newCode,
    });
    onCodeChange(newCode);
  }, []);

  const effectRan = useRef(false)
  useEffect(() => {
      if (socketRef.current) {
        socketRef.current?.on(ACTIONS.CODE_CHANGE, ({ code }) => {
          if (code !== null) {
            setCurrentCode(code);
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
        value={currentCode}
        height="350px"
        extensions={[javascript({ jsx: true, typescript: true })]}
        onChange={onChange}
        theme={currentTheme}
      />
  );
};

export default CodeMirrorEditor;
