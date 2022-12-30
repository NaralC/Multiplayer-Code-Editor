import { FC, useEffect, useState } from "react";
import { IMonacoEditorProps } from "../constants/interfaces";
import Editor from "@monaco-editor/react";

const MonacoEditor: FC<IMonacoEditorProps> = (props) => {
  const [code, setCode] = useState<string>(props.defaultCode || "");

  return (
    <div className="p-10">
      <Editor
        height="85vh"
        width={`90%`}
        language={props.language || "javascript"}
        value={code}
        theme={props.theme}
        defaultValue={props.defaultCode}
        onChange={props.onChange}
      />
    </div>
  );
};

export default MonacoEditor;
