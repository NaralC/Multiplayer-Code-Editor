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
    <div className='text-xs md:text-xl lg:text-2xl rounded-md duration-150 h-[70vh] overflow-y-auto overflow-x-auto'>
      <CodeMirror
        value={currentCode}
        height="100%"
        extensions={[javascript({ jsx: true, typescript: true })]}
        onChange={onChange}
        theme={currentTheme}
      />
    </div>
  );
};

export default CodeMirrorEditor;