import { IMonacoEditorProps } from "./interfaces";

export const defaultJS: IMonacoEditorProps = {
    language: "javascript",
    defaultCode: "console.log(🤓🤓🤓)",
    theme: "monakai",
    onChange() {
        
    },
}

export const defaultPy: IMonacoEditorProps = {
    language: "python",
    defaultCode: "print(🤓🤓🤓)",
    theme: "monakai",
    onChange() {
        
    },
}