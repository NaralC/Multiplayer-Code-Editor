import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import HomePage from "./pages/HomePage";
import { ToastContainer } from "react-toastify";
import "./App.css";

const App: FC = () => {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor/:roomId" element={<EditorPage />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
      />
    </div>
  );
};

export default App;
