import { ICodeEditorProps } from "./interfaces";

export const defaultJS: ICodeEditorProps = {
    language: "javascript",
    defaultCode: "console.log(🤓🤓🤓)",
    theme: "monakai",
    onChange() {
        
    },
}

export const defaultPy: ICodeEditorProps = {
    language: "python",
    defaultCode: "print(🤓🤓🤓)",
    theme: "monakai",
    onChange() {
        
    },
}