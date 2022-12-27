export interface IClientProps {
    socketId: number;
    nickname: string;
  };

export interface ICodeEditorProps {
  onChange: () => void;
  language: string;
  defaultCode: string;
  theme: string;
}