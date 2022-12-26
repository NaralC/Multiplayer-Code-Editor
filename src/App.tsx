import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import HomePage from "./pages/HomePage";
import "./App.css";

const App: FC = () => {
  return (
    <div className="w-screen min-h-screen bg-white flex flex-col justify-center items-center">
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/editor" element={<EditorPage />}/>
      </Routes>
    </div>
  );
};

export default App;
