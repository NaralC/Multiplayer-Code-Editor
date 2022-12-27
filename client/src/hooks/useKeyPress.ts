import { useEffect, useState } from "react";

const useKeyPress = (inputKey: string): boolean => {
  const [keyPress, setKeyPress] = useState(false);

  const handleUpstroke = ({ key }: KeyboardEvent) => {
    if (key === inputKey) {
      setKeyPress(false);
    }
  };

  const handleDownstroke = ({ key }: KeyboardEvent) => {
    if (key === inputKey) {
      setKeyPress(true);
    }
  };
  useEffect(() => {
    document.addEventListener("keyup", handleUpstroke);
    document.addEventListener("keydown", handleDownstroke);

    return () => {
      document.removeEventListener("keyup", handleUpstroke);
      document.removeEventListener("keydown", handleDownstroke);
    };
  }, []);

  return keyPress;
};

export default useKeyPress;
