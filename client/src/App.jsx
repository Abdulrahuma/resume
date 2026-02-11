import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import Chat from "./pages/Chat";
import Navbar from "./components/Navbar";
import FloatingChatButton from "./components/FloatingChatButton";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
      <FloatingChatButton />
    </>
  );
}

export default App;
