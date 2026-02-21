import { Routes, Route, Navigate } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PageLoader from "./components/PageLoader";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import CustomToast from "./components/CustomToast";
import { useShallow } from "zustand/react/shallow";

const App = () => {
  const {checkAuth, authUser , isCheckingAuth} = useAuthStore(
    useShallow((state) => ({
      checkAuth: state.checkAuth,
      authUser: state.authUser,
      isCheckingAuth: state.isCheckingAuth,
    })),
  );

  useEffect(() => {
    checkAuth()
  },[checkAuth])

  if(isCheckingAuth) return <PageLoader />
  return (
    <div className="min-h-screen bg-zinc-900 relative flex justify-center items-center p-4 overflow-hidden">
     {/* DECORATORS - GRID BG & GLOW SHAPES */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-emerald-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-teal-500 opacity-20 blur-[100px]" />

    <Routes>
      <Route path="/" element={authUser ? <ChatPage />: <Navigate to={"/login"}/>} />
      <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
      <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
    </Routes>

    <CustomToast/>
    </div>
  );
};

export default App;
