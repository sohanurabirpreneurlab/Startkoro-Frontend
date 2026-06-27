import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/navbar/Navbar";
import { HomePage } from "./pages/HomePage";
import { ChatPage } from "./pages/ChatPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <div className="flex-1 min-h-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}
