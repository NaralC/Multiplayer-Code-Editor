import { javascript, javascriptLanguage, typescriptLanguage } from "@codemirror/lang-javascript";
import { cpp, cppLanguage } from "@codemirror/lang-cpp";
import { php, phpLanguage } from "@codemirror/lang-php";
import { python, pythonLanguage } from "@codemirror/lang-python";
import { rust, rustLanguage } from "@codemirror/lang-rust";
import { java, javaLanguage } from "@codemirror/lang-java";

const languages: {
  [key: string]: any;
} =
  {
    'JavaScript': [javascript({ jsx: true, typescript: false })],
    'TypeScript': [javascript({ jsx: true, typescript: true })],
    'Python': [python()],
    'C++': [cpp()],
    'Java': [java()],
    'PHP': [php()],
    'Rust': [rust()],
    // 'JavaScript': [javascriptLanguage],
    // 'TypeScript': [typescriptLanguage],
    // 'Python': [pythonLanguage],
    // 'C++': [cppLanguage],
    // 'PHP': [phpLanguage],
    // 'Rust': [rustLanguage],
  };

export default languages;
