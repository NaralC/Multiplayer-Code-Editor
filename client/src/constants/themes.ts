import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { xcodeDark } from "@uiw/codemirror-theme-xcode";

const themes: {
    [key: string]: any;
  } = {
    'Okaidia': okaidia,
    'VSCode': vscodeDark,
    'XCode': xcodeDark
}

export default themes;