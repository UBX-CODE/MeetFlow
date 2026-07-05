import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MeetingPage from "./pages/MeetingPage";
import PreJoinPage from "./pages/PreJoinPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pre-join" element={<PreJoinPage />} />
        <Route path="/meeting/:roomId" element={<MeetingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;