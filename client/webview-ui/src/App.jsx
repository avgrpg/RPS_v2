import { vscode } from "./utilities/vscode";
import { VSCodeButton, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { useState, useEffect } from "react";
// import { apiUrl } from "../../src/constants"

import "./App.css";

function App() {
  const [examCode, setExamCode] = useState("");
  const [examId, setExamId] = useState("");
  const [suspiciousTypingSpeed, setSuspiciousTypingSpeed] = useState(0);
  const [suspiciousClipboardLength, setSuspiciousClipboardLength] = useState(0);
  const [suspiciousStandardDeviation, setSuspiciousStandardDeviation] = useState(0);
  const [disallowedExtensions, setDisallowedExtensions] = useState([]);
  const [language, setLanguage] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [EID, setEID] = useState("");
  const [state, setState] = useState(false);
  const [secondState, setSecondState] = useState(false);
  const [apiUrl, setAPIUrl] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    window.addEventListener("message", (event) => {
      const message = event.data;
      if (message.type === "api") {
        // switch (message.value) {
        //   case "handleStart":
        //     handleStart();
        //     break;
        // }
        // console.log(message.message);
        setAPIUrl(message.message);
      }
    });
    handleMessage();
    const previousState = vscode.getState();
    if (previousState) {
      setExamCode(previousState.examCode);
      setExamId(previousState.examId);
      setSuspiciousTypingSpeed(previousState.suspiciousTypingSpeed);
      setSuspiciousClipboardLength(previousState.suspiciousClipboardLength);
      setSuspiciousStandardDeviation(previousState.suspiciousStandardDeviation);
      setDisallowedExtensions(previousState.disallowedExtensions);
      setLanguage(previousState.language);
      setCandidateName(previousState.candidateName);
      setEID(previousState.EID);
      setState(previousState.state);
      setSecondState(previousState.secondState);
      setToken(previousState.token);
    }
  }, []);

  const getExam = async (examCode) => {
    const response = await fetch(`${apiUrl}/exams/code/${examCode}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (response.ok) {
      setExamId(data._id);
      setSuspiciousTypingSpeed(data.suspiciousTypingSpeed);
      setSuspiciousClipboardLength(data.suspiciousClipboardLength);
      setSuspiciousStandardDeviation(data.suspiciousStandardDeviation);
      setDisallowedExtensions(data.disallowedExtensions);
      setLanguage(data.language);
      setToken(data.token);
      setState(true);
      handleExamFound();
      vscode.setState({
        examCode,
        examId: data._id,
        suspiciousTypingSpeed: data.suspiciousTypingSpeed,
        suspiciousClipboardLength: data.suspiciousClipboardLength,
        suspiciousStandardDeviation: data.suspiciousStandardDeviation,
        disallowedExtensions: data.disallowedExtensions,
        language: data.language,
        token: data.token,
        candidateName,
        EID,
        state: true,
        secondState,
      });
      return;
    }
    handleExamNotFound();
  };

  const handleExamFound = () => {
    vscode.postMessage({
      type: "examFound",
      examId: examId,
    });
  };

  const handleExamNotFound = () => {
    vscode.postMessage({
      command: "examNotFound",
    });
  };

  const handleStart = () => {
    vscode.postMessage({
      command: "start",
      text: {
        name: candidateName,
        EID: EID,
        examId: examId,
        suspiciousTypingSpeed: suspiciousTypingSpeed,
        suspiciousClipboardLength: suspiciousClipboardLength,
        suspiciousStandardDeviation: suspiciousStandardDeviation,
        disallowedExtensions: disallowedExtensions,
        language: language,
        token: token
      },
    });
    setSecondState(true);
    vscode.setState({
      examCode,
      examId,
      suspiciousTypingSpeed,
      suspiciousClipboardLength,
      suspiciousStandardDeviation,
      disallowedExtensions,
      language,
      token,
      candidateName,
      EID,
      state,
      secondState: true,
    });
  };

  const handleSubmit = () => {
    vscode.postMessage({
      command: "submit",
      text: "On submit. Please wait and do not close the code editor.",
    });
    handleReset();
  };

  const handleEnter = () => {
    getExam(examCode);
  };

  const handleMessage = () => {
    vscode.postMessage({
      command: "message",
    });
  };

  const handleReset = () => {
    vscode.setState({
      examCode: "",
      examId: "",
      suspiciousTypingSpeed: 0,
      suspiciousClipboardLength: 0,
      suspiciousStandardDeviation: 0,
      disallowedExtensions: [],
      language: "",
      token: "",
      candidateName: "",
      EID: "",
      state: false,
      secondState: false,
    });
    setExamCode("");
    setExamId("");
    setSuspiciousTypingSpeed(0);
    setSuspiciousClipboardLength(0);
    setSuspiciousStandardDeviation(0);
    setDisallowedExtensions([]);
    setCandidateName("");
    setLanguage("")
    setToken("");
    setEID("");
    setState(false);
    setSecondState(false);
  };

  return (
    <main>
      <div>
        <VSCodeTextField
          placeholder="Eg. 2223A_EE1234"
          value={examCode}
          disabled={state}
          onInput={(e) => setExamCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // setExamCode(e.target.value);
              getExam(e.target.value);
            }
          }}>
          Exam Code:
        </VSCodeTextField>
        {state && (
          <div>
            <VSCodeTextField
              placeholder="Eg. Chan Tai Man"
              value={candidateName}
              disabled={secondState}
              onInput={(e) => setCandidateName(e.target.value)}>
              Name:
            </VSCodeTextField>

            <VSCodeTextField
              placeholder="12345678"
              value={EID}
              disabled={secondState}
              onInput={(e) => setEID(e.target.value)}>
              EID:
            </VSCodeTextField>

            <div className="button">
              <VSCodeButton
                disabled={secondState}
                onClick={() => {
                  handleStart();
                }}>
                start
              </VSCodeButton>
              <VSCodeButton onClick={handleSubmit}>submit</VSCodeButton>
            </div>
          </div>
        )}
        <div className="button">
          {!state && <VSCodeButton onClick={handleEnter}>enter</VSCodeButton>}
          <VSCodeButton onClick={handleReset}>reset</VSCodeButton>
        </div>
      </div>
    </main>
  );
}

export default App;
