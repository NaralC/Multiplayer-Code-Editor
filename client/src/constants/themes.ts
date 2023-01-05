import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { xcodeDark, xcodeLight } from "@uiw/codemirror-theme-xcode";
import { solarizedDark, solarizedLight } from "@uiw/codemirror-theme-solarized";
import { androidstudio } from "@uiw/codemirror-theme-androidstudio";
import { dracula } from "@uiw/codemirror-theme-dracula";

const themes: {
    [key: string]: any;
  } = {
    'Okaidia': okaidia,
    'VSCode': vscodeDark,
    'XCode': xcodeDark,
    'Solarized': solarizedDark,
    'Android Studio': androidstudio,
    'Dracula': dracula,
}

export default themes;