"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const HelloWorldPanel_1 = require("./panels/HelloWorldPanel");
const SideViewPanel_1 = require("./panels/SideViewPanel");
const node_fetch_1 = require("node-fetch");
const path = require("path");
const Diff = require("diff");
// import * as diff from "diff";
const constants_1 = require("./constants");
const getNonce_1 = require("./utilities/getNonce");
const REPORT_PATH = "report";
const TIME_INTERVAL = 5000;
let CLIPBOARD_SUSPICIOUS_LENGTH = 15;
let SD_SUSPICIOUS = 2;
let DISALLOWED_EXTENSIONS = [
    "TabNine.tabnine-vscode",
    "GitHub.copilot",
    "VisualStudioExptTeam.vscodeintellicode",
    "timkmecl.chatgpt",
    "gencay.vscode-chatgpt",
];
// fastest typing speed in WPM is around 200, average is around 50
// https://www.ratatype.com/learn/average-typing-speed/#:~:text=The%20highest%20typing%20speed%20ever,using%20a%20Dvorak%20simplified%20keyboard.
// average character count pre word is 5
// http://www.asarif.com/pub/Arif_TIC-STH2009.pdf
let SUSPICIOUS_SPEED = (150 * 5) / 60;
let webToken = "";
let examLanguage = "";
function activate(context) {
    // Create the show RPS panel command
    context.subscriptions.push(vscode.commands.registerCommand("rps.openpanel", () => {
        HelloWorldPanel_1.HelloWorldPanel.render(context.extensionUri);
    }));
    const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
    item.text = "RPS_Panel";
    item.command = "rps.openpanel";
    item.show();
    // Capture the history log
    var historylog;
    let file = [];
    let text;
    let averageSpeed = [];
    context.subscriptions.push(vscode.commands.registerCommand("rps.historylog", () => __awaiter(this, void 0, void 0, function* () {
        file = [];
        // let count = 0; // For testing purposes
        historylog = setInterval(() => {
            vscode.workspace.textDocuments.map((change) => {
                var tmp;
                let tmpFileN = change.fileName.split(path.sep).pop();
                if ((tmp = file.find((x) => x.fileN === tmpFileN))) {
                    let tmp1 = tmp.content;
                    if (tmp1[tmp1.length - 1].content === change.getText()) {
                        tmp1[tmp1.length - 1].count++;
                    }
                    else {
                        tmp1.push({ content: change.getText(), count: 1 });
                    }
                }
                else {
                    let tmp2 = new Array();
                    tmp2.push({ content: change.getText(), count: 1 });
                    file.push({ fileN: tmpFileN, content: tmp2 });
                }
            });
        }, 5000); // 5s time interval
    })));
    const composeSpeedLog = () => {
        averageSpeed = [];
        let fileNum = 0;
        file.map((file) => {
            averageSpeed.push({ fileN: file.fileN, speed: [] });
            for (let i = 0; i < file.content.length; i++) {
                let speed;
                if (i === 0) {
                    speed = file.content[i].content.length;
                }
                else {
                    speed = file.content[i].content.length - file.content[i - 1].content.length;
                }
                speed = speed / 5;
                averageSpeed[fileNum].speed.push(speed);
                for (let j = 0; j < file.content[i].count - 1; j++) {
                    averageSpeed[fileNum].speed.push(0);
                }
            }
            fileNum++;
        });
    };
    context.subscriptions.push(vscode.commands.registerCommand("rps.stophistory", () => {
        clearInterval(historylog);
        console.log(file);
        composeSpeedLog();
        console.log(averageSpeed);
    }));
    // Capture the clipboard log
    let clipboardText = [];
    // let pasteEvent = vscode.commands.registerCommand(
    //   "editor.action.clipboardPasteAction",
    //   async () => {
    //     captureClipboard(pasteEvent);
    //   }
    // );
    // async function captureClipboard(pasteEvent: vscode.Disposable) {
    //   // Dispose event to prevent inifinite loop when excuting the default paste command
    //   pasteEvent.dispose();
    //   await vscode.commands.executeCommand("editor.action.clipboardPasteAction");
    //   const tmp = await vscode.env.clipboard.readText();
    //   const time = new Date().toLocaleString();
    //   console.log("Clipboard: ", tmp);
    //   if (!clipboardText.find((text) => text.content === tmp)) {
    //     clipboardText.push({ content: tmp, time: time });
    //   }
    //   // Re-trigger the event
    //   pasteEvent = vscode.commands.registerCommand("editor.action.clipboardPasteAction", async () => {
    //     captureClipboard(pasteEvent);
    //   });
    // }
    let pasteEvent;
    context.subscriptions.push(vscode.commands.registerCommand("rps.clipboard", () => {
        pasteEvent = vscode.commands.registerCommand("editor.action.clipboardPasteAction", () => __awaiter(this, void 0, void 0, function* () {
            captureClipboard(pasteEvent);
        }));
        const captureClipboard = (pasteEvent) => __awaiter(this, void 0, void 0, function* () {
            // Dispose event to prevent inifinite loop when excuting the default paste command
            pasteEvent.dispose();
            yield vscode.commands.executeCommand("editor.action.clipboardPasteAction");
            const tmp = yield vscode.env.clipboard.readText();
            const time = new Date().toLocaleString();
            let isCopy = true;
            if (!clipboardText.find((text) => text.content === tmp)) {
                clipboardText.push({ content: tmp, time: time });
                if (tmp.length > CLIPBOARD_SUSPICIOUS_LENGTH) {
                    historyLog.map((item) => {
                        if (item.currentContent.indexOf(tmp) >= 0) {
                            isCopy = false;
                            return;
                        }
                    });
                }
            }
            else {
                isCopy = false;
            }
            if (isCopy) {
                scoreBoard.clipboardLog += 60;
            }
            // Re-trigger the event
            pasteEvent = vscode.commands.registerCommand("editor.action.clipboardPasteAction", () => __awaiter(this, void 0, void 0, function* () {
                captureClipboard(pasteEvent);
            }));
        });
        // console.log(clipboardText);
        // //testing workplace folder
        // const folder = vscode.workspace.workspaceFolders?.map((folder) => folder.uri.path);
        // console.log(folder);
        // const options: vscode.OpenDialogOptions = {
        //   canSelectMany: false,
        //   openLabel: "Select location for storing report",
        //   canSelectFiles: false,
        //   canSelectFolders: true,
        // };
        // vscode.window.showOpenDialog(options).then((fileUri) => {
        //   if (fileUri && fileUri[0]) {
        //     console.log("Selected file: " + fileUri[0].fsPath);
        //   }
        // });
        // console.log(__dirname);
    }));
    // compile report
    const compileReport = (fs, path, language) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const writeStream = fs.createWriteStream(path);
        const pathName = writeStream.path;
        writeStream.write("# Report\n");
        writeStream.write(`This report is to show candidate: ${candidate.name} EID: ${candidate.EID}'s cheating suspicious level. \n\n Disclaimer: This report is to provide the suspicious cheating level of a particular candidate. Please be noted that the evaluation of cheating suspicion can be biased. The suspicious cheating score is only for reference. Its accuracy and reliability are not guaranteed. The report also provides various statistics related to cheating. In addition, please refer to the RPS interface for more detailed information.\n`);
        // write the scoreboard log
        writeStream.write("## Scoreboard\n");
        writeStream.write("Overall Score : " + candidate.score + "\n\n");
        let typingSpeedScore = 0;
        (_b = (_a = candidate.scoreBoard) === null || _a === void 0 ? void 0 : _a.averageSpeed) === null || _b === void 0 ? void 0 : _b.map(({ speed }) => {
            typingSpeedScore += speed;
        });
        typingSpeedScore /= (_c = candidate.averageSpeed) === null || _c === void 0 ? void 0 : _c.length;
        writeStream.write("Typing Score : " + typingSpeedScore + "\n\n");
        writeStream.write("Clipboard Score : " + ((_d = candidate.scoreBoard) === null || _d === void 0 ? void 0 : _d.clipboardLog) + "\n\n");
        writeStream.write("Extension Score : " + ((_e = candidate.scoreBoard) === null || _e === void 0 ? void 0 : _e.extensionLog) + "\n\n");
        // time stat
        writeStream.write("## Time Stat\n");
        writeStream.write("Start Time : " + candidate.startTime + "\n\n");
        writeStream.write("End Time : " + candidate.endTime + "\n\n");
        // meanSpeed and standardDeviation
        (_f = candidate.scoreBoard) === null || _f === void 0 ? void 0 : _f.meanSpeed.map((item, index) => {
            writeStream.write((index + 1) + ". " + item.file + " mean Speed : " + item.mean + "\n\n");
        });
        (_g = candidate.scoreBoard) === null || _g === void 0 ? void 0 : _g.standardDeviation.map((item, index) => {
            writeStream.write((index + 1) + ". " + item.file + " standard deviation : " + item.sd + "\n\n");
        });
        // write the extension list
        // const codeBlock = "```";
        yield writeStream.write("## Enabled Extension\n");
        // Writing the clipboard history as code blocks
        yield ((_h = candidate.extensionList) === null || _h === void 0 ? void 0 : _h.forEach((value, i = 0) => {
            i++;
            writeStream.write(`${i}: ${value.id}\n`);
            writeStream.write("\n");
        }));
        // write the clipboard history
        const codeBlock = "```";
        yield writeStream.write("## Clipboard History\n");
        // Writing the clipboard history as code blocks
        yield clipboardText.forEach((value, i = 0) => {
            i++;
            writeStream.write(`${i}: \n`);
            writeStream.write(`${codeBlock}${language}\n`);
            writeStream.write(`${value.content}\n`);
            writeStream.write("```\n");
        });
        writeStream.on("finish", () => {
            console.log(`finished writing to ${pathName}`);
        });
        writeStream.on("error", (err) => {
            console.error(`error writing to ${pathName} => ${err}`);
        });
        // close the stream
        writeStream.end();
        // modified from https://stackoverflow.com/a/51362713
    });
    // generate report
    context.subscriptions.push(vscode.commands.registerCommand("rps.report", () => __awaiter(this, void 0, void 0, function* () {
        vscode.window.showInformationMessage("Compiling Report");
        let fs = require("fs");
        const options = {
            canSelectMany: false,
            openLabel: "Select location for storing report",
            canSelectFiles: false,
            canSelectFolders: true,
        };
        const selectedPath = yield vscode.window.showOpenDialog(options).then((fileUri) => {
            if (fileUri && fileUri[0]) {
                console.log("Selected file: " + fileUri[0].fsPath);
                return fileUri[0].fsPath;
            }
        });
        if (selectedPath) {
            const path = selectedPath + "/" + REPORT_PATH + (0, getNonce_1.getNonce)(5) + ".md";
            yield compileReport(fs, path, examLanguage);
            yield vscode.commands.executeCommand("markdown.showPreviewToSide", vscode.Uri.file(path));
        }
        else {
            vscode.window.showErrorMessage("Please select a folder to store the report");
        }
    })));
    // generate extension list
    context.subscriptions.push(vscode.commands.registerCommand("rps.extension", () => __awaiter(this, void 0, void 0, function* () {
        // const terminal = vscode.window.createTerminal();
        // const path = context.asAbsolutePath(REPORT_PATH);
        // await terminal.sendText(`cd "${path}"`);
        // await terminal.sendText(`code --list-extensions --show-versions >> ext.txt`);
        // // console.log(terminal.state);
        // // await vscode.window.showInformationMessage("Extension list exported");
        // // console.log(terminal.state.isInteractedWith);
        // const closeTerminal = vscode.window.onDidChangeTerminalState(() => {
        //   terminal.dispose();
        //   closeTerminal.dispose();
        // });
        let extensionDisallowCount = 0;
        // DISALLOWED_EXTENSIONS.map((extension) => {
        //   let extensiontmp = vscode.extensions.getExtension(extension);
        //   if (extensiontmp?.isActive) {
        //     console.log("found");
        //     return extensionDisallowCount++;}
        // });
        let extensionList = [];
        vscode.extensions.all.map((extension) => {
            if (extension.isActive) {
                let id = extension.id;
                if (DISALLOWED_EXTENSIONS.find((e) => e === id)) {
                    extensionDisallowCount++;
                    extensionList.push({ id: id, disallow: true });
                    return;
                }
                extensionList.push({ id: id, disallow: false });
                return;
            }
        });
        extensionList.sort((a, b) => (a.disallow > b.disallow ? -1 : 1));
        candidate.extensionList = extensionList;
        if (extensionDisallowCount > 0) {
            scoreBoard.extensionLog = 100;
        }
        console.log(extensionList);
        // let mathExt = vscode.extensions.getExtension("");
        // console.log(mathExt?.isActive);
        console.log(extensionDisallowCount);
    })));
    // compute standard deviation
    const computeSD = (input, file) => {
        let n = input.length;
        let mean = input.reduce((acc, x) => acc + x, 0) / n;
        // scoreBoard.meanSpeed = mean;
        scoreBoard.meanSpeed.push({ file: file, mean: mean });
        let variance = input.reduce((acc, x) => acc + Math.pow((x - mean), 2), 0) / n;
        return Math.sqrt(variance);
    };
    const composeSpeedScore = () => {
        averageSpeed.map((file, index) => {
            // determine cheating with extreme typing speed
            let susCount = file.speed.reduce((acc, speed) => {
                if (speed > SUSPICIOUS_SPEED) {
                    return ++acc;
                }
                return acc;
            }, 0);
            let tmpAverageSpeed = 0;
            if (susCount > 0) {
                // scoreBoard.averageSpeed += susCount * 50;
                tmpAverageSpeed += 50;
            }
            scoreBoard.averageSpeed.push({ file: file.fileN, speed: tmpAverageSpeed });
            // determine cheating with standard deviation
            let sd = computeSD(file.speed, file.fileN);
            scoreBoard.standardDeviation.push({ file: file.fileN, sd: sd });
            // if standard deviation is higher than threshold
            if (sd > SD_SUSPICIOUS) {
                // scoreBoard.averageSpeed += 50;
                scoreBoard.averageSpeed[index].speed += 50;
            }
            else if (sd > SD_SUSPICIOUS - 1) {
                // scoreBoard.averageSpeed += 20;
                scoreBoard.averageSpeed[index].speed += 20;
            }
        });
    };
    let scoreBoard = {
        clipboardLog: 0,
        averageSpeed: [],
        extensionLog: 0,
        standardDeviation: [],
        meanSpeed: [],
    };
    let candidate = {
        name: "",
        EID: "",
        historyLog: [],
        clipboardLog: [],
        averageSpeed: [],
        score: 0,
        scoreBoard: {
            clipboardLog: 0,
            averageSpeed: [],
            extensionLog: 0,
            standardDeviation: [],
            meanSpeed: [],
        },
        extensionList: [],
        examId: "",
        startTime: "",
        endTime: "",
    };
    context.subscriptions.push(vscode.commands.registerCommand("rps.onstart", ({ name, EID, examId, suspiciousTypingSpeed, suspiciousClipboardLength, suspiciousStandardDeviation, disallowedExtensions, language, token }) => __awaiter(this, void 0, void 0, function* () {
        candidate = {
            name: "",
            EID: "",
            historyLog: [],
            clipboardLog: [],
            averageSpeed: [],
            score: 0,
            scoreBoard: {
                clipboardLog: 0,
                averageSpeed: [],
                extensionLog: 0,
                standardDeviation: [],
                meanSpeed: [],
            },
            extensionList: [],
            examId: "",
            startTime: "",
            endTime: "",
        };
        scoreBoard = {
            clipboardLog: 0,
            averageSpeed: [],
            extensionLog: 0,
            standardDeviation: [],
            meanSpeed: [],
        };
        candidate.name = name;
        candidate.EID = EID;
        candidate.examId = examId;
        candidate.startTime = new Date().toLocaleString();
        SUSPICIOUS_SPEED = suspiciousTypingSpeed;
        SD_SUSPICIOUS = suspiciousStandardDeviation;
        CLIPBOARD_SUSPICIOUS_LENGTH = suspiciousClipboardLength;
        DISALLOWED_EXTENSIONS = disallowedExtensions;
        webToken = token;
        examLanguage = language;
        console.log(token);
        vscode.commands.executeCommand("rps.startlog");
    })));
    const handleCandidateAdd = (examId) => __awaiter(this, void 0, void 0, function* () {
        const reponse = yield (0, node_fetch_1.default)(`${constants_1.apiUrl}/exams/${examId}/addcan`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${webToken}`,
            },
            body: JSON.stringify(candidate),
        });
        const result = yield reponse.json();
        vscode.window.showInformationMessage(result);
        if (!reponse.ok) {
            const response = yield vscode.window.showInformationMessage("Submission failed, please try again", "Yes", "No");
            if (response === "Yes") {
                handleCandidateAdd(examId);
            }
        }
    });
    context.subscriptions.push(vscode.commands.registerCommand("rps.onsubmit", () => __awaiter(this, void 0, void 0, function* () {
        pasteEvent.dispose();
        yield vscode.commands.executeCommand("rps.onsubmit_v2");
        yield vscode.commands.executeCommand("rps.extension");
        // composeSpeedLog();
        candidate.score =
            scoreBoard.clipboardLog * 0.6 +
                (scoreBoard.averageSpeed.reduce((a, b) => a + b.speed, 0) /
                    scoreBoard.averageSpeed.length) *
                    0.4;
        // candidate.score = scoreBoard.clipboardLog * 0.6 + scoreBoard.averageSpeed * 0.4;
        if (scoreBoard.extensionLog > 0) {
            candidate.score += 100;
        }
        candidate.scoreBoard = scoreBoard;
        candidate.historyLog = historyLog;
        candidate.clipboardLog = clipboardText;
        candidate.averageSpeed = averageSpeed;
        candidate.endTime = new Date().toLocaleString();
        console.log(candidate);
        yield handleCandidateAdd(candidate.examId);
        const response = yield vscode.window.showInformationMessage("Do you want to compile the report?", "Yes", "No");
        if (response === "Yes") {
            vscode.commands.executeCommand("rps.report");
        }
    })));
    const sidePanel = new SideViewPanel_1.SideViewPanel(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(SideViewPanel_1.SideViewPanel.viewType, sidePanel));
    let historyLogEvent;
    let historyLog = [];
    let fileContent;
    context.subscriptions.push(vscode.commands.registerCommand("rps.startlog", () => __awaiter(this, void 0, void 0, function* () {
        vscode.commands.executeCommand("rps.clipboard");
        historyLog = [];
        averageSpeed = [];
        clipboardText = [];
        historyLogEvent = setInterval(() => {
            vscode.workspace.textDocuments.map((doc) => {
                let currentFileName = doc.fileName.split(path.sep).pop();
                let currentContent = doc.getText();
                let currentSpeedLog;
                let currentHistoryLog;
                if ((currentHistoryLog = historyLog.find((item) => item.fileName === currentFileName))) {
                    let speed = 0;
                    if ((currentSpeedLog = averageSpeed.find((log) => log.fileN === currentFileName))) {
                        speed = (currentContent.length - currentHistoryLog.currentContent.length) / 5;
                        currentSpeedLog.speed.push(speed);
                    }
                    else {
                        speed = currentContent.length / 5;
                        averageSpeed.push({
                            fileN: currentFileName,
                            speed: [0, speed],
                        });
                    }
                    let diff = Diff.diffChars(currentHistoryLog.currentContent, currentContent);
                    if (!diff[0].added && !diff[0].removed) {
                        diff[0].value = "";
                    }
                    currentHistoryLog.fileContent.push(diff.map(({ count, value, added, removed }) => {
                        if (removed) {
                            return { count, removed };
                        }
                        return { count, added, value };
                    }));
                    currentHistoryLog.currentContent = currentContent;
                }
                else {
                    let diff = Diff.diffChars("", currentContent);
                    historyLog.push({
                        fileName: currentFileName.split(path.sep).pop(),
                        fileContent: [diff],
                        currentContent: currentContent,
                    });
                }
            });
        }, TIME_INTERVAL);
    })));
    context.subscriptions.push(vscode.commands.registerCommand("rps.onsubmit_v2", (text) => __awaiter(this, void 0, void 0, function* () {
        // console.log(text);
        // const response = await vscode.window.showInformationMessage(
        //   "Do you want to start the exam?",
        //   "Yes",
        //   "No"
        // );
        // if (response === "Yes") {
        //   sidePanel.doRefactor("Yes", "handleStart");
        // }
        clearInterval(historyLogEvent);
        console.log(historyLog);
        vscode.workspace.textDocuments.map((doc) => {
            let currentFileName = doc.fileName.split(path.sep).pop();
            let currentContent = doc.getText();
            let currentSpeedLog;
            let currentHistoryLog;
            if ((currentHistoryLog = historyLog.find((item) => item.fileName === currentFileName))) {
                let speed = 0;
                if ((currentSpeedLog = averageSpeed.find((log) => log.fileN === currentFileName))) {
                    speed = (currentContent.length - currentHistoryLog.currentContent.length) / 5;
                    currentSpeedLog.speed.push(speed);
                }
                else {
                    speed = currentContent.length / 5;
                    averageSpeed.push({
                        fileN: currentFileName,
                        speed: [0, speed],
                    });
                }
                let diff = Diff.diffChars(currentHistoryLog.currentContent, currentContent);
                if (!diff[0].added && !diff[0].removed) {
                    diff[0].value = "";
                }
                currentHistoryLog.fileContent.push(diff.map(({ count, value, added, removed }) => {
                    if (removed) {
                        return { count, removed };
                    }
                    return { count, added, value };
                }));
                currentHistoryLog.currentContent = currentContent;
            }
            else {
                let diff = Diff.diffChars("", currentContent);
                historyLog.push({
                    fileName: currentFileName.split(path.sep).pop(),
                    fileContent: [diff],
                    currentContent: currentContent,
                });
            }
        });
        let index = 0;
        let acc = "";
        // compute full log every 30s + last log
        // let historyFullLog: Array<{ fileN: string; content: [string] }> = [];
        // historyLog.map((file, fileIndex) => {
        //   acc = "";
        //   historyFullLog.push({ fileN: file.fileName, content: [""] });
        //   file.fileContent.map((item, timeCount) => {
        //     index = 0;
        //     item.map(({ count, value, added, removed }, x) => {
        //       if (removed) {
        //         acc = acc.slice(0, index);
        //         index += count!;
        //         return;
        //       }
        //       if (added) {
        //         // acc = acc.slice(0, index) + value + acc.slice(index);
        //         acc = acc.slice(0, index) + value;
        //         index += count!;
        //         return;
        //       }
        //       if (value) {
        //         index += count!;
        //         return (acc = acc + value);
        //       }
        //       if (!value) {
        //         index += count!;
        //         return;
        //       }
        //     });
        //     // timeCount++;
        //     if ((timeCount + 1) % 6 === 0) {
        //       historyFullLog[fileIndex].content.push(acc);
        //       return;
        //     }
        //     if (timeCount === file.fileContent.length - 1) {
        //       historyFullLog[fileIndex].content.push(acc);
        //       return;
        //     }
        //   });
        // });
        vscode.commands.executeCommand("rps.extension");
        composeSpeedScore();
        // console.log(historyFullLog);
        console.log(averageSpeed);
        console.log(clipboardText);
        console.log(scoreBoard);
        // console.log(final);
        // let diff = Diff.diffChars("dfdsf"," dfdfdsfsf34");
        // acc="";
        // index=0;
        // diff.map(({ count, value, added, removed }) => {
        //     index += count! - 1;
        //     let firstS = acc.slice(0,index);
        //     let secondS = acc.slice(index);
        //     console.log({ count, value, added, removed });
        //     if (removed) {
        //       index -= count!;
        //       secondS = secondS.slice(count);
        //       return acc = firstS + secondS;
        //     }
        //     if (added) {
        //       index += count!;
        //       return (acc = firstS + value + secondS);
        //     }
        //     if (value) {
        //       return acc = acc + value;
        //     }
        //     if (!value) {
        //       index += count!;
        //       return;
        //     }
        // });
        // console.log(acc);
    })));
    context.subscriptions.push(vscode.commands.registerCommand("rps.sendmessage", (panel) => {
        if (constants_1.apiUrl) {
            switch (panel) {
                case "side": {
                    sidePanel.doRefactor("api", constants_1.apiUrl);
                    break;
                }
                case "main": {
                    if (HelloWorldPanel_1.HelloWorldPanel.currentPanel) {
                        HelloWorldPanel_1.HelloWorldPanel.currentPanel.doRefactor("api", constants_1.apiUrl);
                    }
                    break;
                }
            }
        }
    }));
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map