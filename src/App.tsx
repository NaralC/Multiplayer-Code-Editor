import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import HomePage from "./pages/HomePage";
import "./App.css";

const App: FC = () => {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/editor/:roomId" element={<EditorPage />}/>
      </Routes>
    </div>
  );
};

export default App;
