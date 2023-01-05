import { javascript } from "@codemirror/lang-javascript";

const languages: {
  [key: string]: any;
} =
  {
    'JavaScript': [javascript({ jsx: true, typescript: false })],
    'TypeScript': [javascript({ jsx: true, typescript: true })],
  };

export default languages;
