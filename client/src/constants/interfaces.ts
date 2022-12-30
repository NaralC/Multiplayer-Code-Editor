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