import { javascript, javascriptLanguage, typescriptLanguage } from "@codemirror/lang-javascript";
import { cpp, cppLanguage } from "@codemirror/lang-cpp";
import { php, phpLanguage } from "@codemirror/lang-php";
import { python, pythonLanguage } from "@codemirror/lang-python";
import { rust, rustLanguage } from "@codemirror/lang-rust";
import { java, javaLanguage } from "@codemirror/lang-java";

const languages: {
  [key: string]: [any, number];
} =
  {
    'JavaScript': [[javascript({ jsx: true, typescript: false })], 63],
    'TypeScript': [[javascript({ jsx: true, typescript: true })], 74],
    'Python': [[python()], 71],
    'C++': [[cpp()], 54],
    'Java': [[java()], 62],
    'PHP': [[php()], 68],
    'Rust': [[rust()], 73],
    // 'JavaScript': [javascriptLanguage],
    // 'TypeScript': [typescriptLanguage],
    // 'Python': [pythonLanguage],
    // 'C++': [cppLanguage],
    // 'PHP': [phpLanguage],
    // 'Rust': [rustLanguage],
  };

export default languages;
