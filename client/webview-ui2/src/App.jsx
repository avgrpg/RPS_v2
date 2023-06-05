import { Route, Routes, MemoryRouter, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo, useEffect } from "react";
import { vscode } from "./utilities/vscode";

import { themeSettings } from "./theme";

import HomePage from "./scenes/homePage";
import LoginPage from "./scenes/loginPage";
import ExamPage from "./scenes/examPage";
import CandidatePage from "./scenes/CandiadtePage";
import { setApiUrl } from "./state";
// import Navbar from "./scenes/navbar";


function App() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  useEffect(() => {
    window.addEventListener("message", (event) => {
      const message = event.data;
      if (message.type === "api") {
        dispatch(setApiUrl({ apiUrl: message.message}));
      }
    });
    vscode.postMessage({
      command: "message",
    });
  }, []);

  return (
    <div className="App">
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/" />} />
            <Route path="/exam/:examId" element={<ExamPage />} />
            <Route path="/can/:canId" element={<CandidatePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ThemeProvider>
      </MemoryRouter>
    </div>
  );
}

export default App;
