import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";

function App() {
  const [isAuth, setIsAuth] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          isAuth ? (
            <Navigate to="/profile" />
          ) : (
            <Login onLogin={() => setIsAuth(true)} />
          )
        }
      />

      {/* Dashboard */}
      <Route
        path="/profile"
        element={
          isAuth ? <Dashboard /> : <Navigate to="/login" />
        }
      />

      {/* Chat */}
      <Route
        path="/ask"
        element={
          isAuth ? <ChatPage /> : <Navigate to="/login" />
        }
      />

      {/* Default */}
      <Route
        path="*"
        element={
          <Navigate to={isAuth ? "/profile" : "/login"} />
        }
      />
    </Routes>
  );
}

export default App;
