import { vscode } from "./utilities/vscode";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { BrowserRouter, Link, Route, Routes, MemoryRouter } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Content from "./pages/Content";

import "./App.css";

function App() {
  function handleHowdyClick() {
    vscode.postMessage({
      command: "hello",
      text: "Hey there partner! 🤠",
    });
  }

  return (
    <MemoryRouter>
      <header className="className=w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]">
        <Link
          to="/content"
          className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">
          Create1
        </Link>
      </header>
      <main className="sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/content" element={<Content />} />
        </Routes>

        {/* <HomePage /> */}
      </main>
    </MemoryRouter>
  );
}

export default App;