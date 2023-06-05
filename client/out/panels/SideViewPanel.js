"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SideViewPanel = void 0;
const vscode_1 = require("vscode");
const getUri_1 = require("../utilities/getUri");
const getNonce_1 = require("../utilities/getNonce");
const constants_1 = require("../constants");
//   import * as weather from "weather-js";
class SideViewPanel {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        // Allow scripts in the webview
        webviewView.webview.options = {
            // Enable JavaScript in the webview
            enableScripts: true,
            // Restrict the webview to only load resources from the `out` directory
            localResourceRoots: [
                vscode_1.Uri.joinPath(this._extensionUri, "out"),
                vscode_1.Uri.joinPath(this._extensionUri, "webview-ui/build"),
            ],
        };
        // Set the HTML content that will fill the webview view
        webviewView.webview.html = this._getWebviewContent(webviewView.webview, this._extensionUri);
        // Sets up an event listener to listen for messages passed from the webview view context
        // and executes code based on the message that is recieved
        this._setWebviewMessageListener(webviewView);
    }
    _getWebviewContent(webview, extensionUri) {
        // The CSS file from the React build output
        const stylesUri = (0, getUri_1.getUri)(webview, extensionUri, ["webview-ui", "build", "assets", "index.css"]);
        // The JS file from the React build output
        const scriptUri = (0, getUri_1.getUri)(webview, extensionUri, ["webview-ui", "build", "assets", "index.js"]);
        const nonce = (0, getNonce_1.getNonce)();
        // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
        return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; connect-src ${constants_1.apiUrl}; style-src ${webview.cspSource} 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
        <link rel="stylesheet" type="text/css" href="${stylesUri}">
        <title>Hello World</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" nonce="${nonce}" src="${scriptUri}">
          const apiUrl = "${constants_1.apiUrl}";
        </script>
      </body>
    </html>
          `;
    }
    doRefactor(type, value) {
        // Send a message to the webview webview.
        // You can send any JSON serializable data.
        if (this._view) {
            this._view.webview.postMessage({ type: type, message: value });
        }
    }
    _setWebviewMessageListener(webviewView) {
        webviewView.webview.onDidReceiveMessage((message) => {
            const command = message.command;
            const text = message.text;
            switch (command) {
                case "hello":
                    // Code that should run in response to the hello message command
                    vscode_1.window.showInformationMessage(text);
                    return;
                // Add more switch case statements here as more webview message commands
                // are created within the webview context (i.e. inside media/main.js)
                case "start":
                    vscode_1.window.showInformationMessage("start");
                    vscode_1.commands.executeCommand("rps.onstart", text);
                    return;
                case "submit":
                    vscode_1.window.showInformationMessage(text);
                    vscode_1.commands.executeCommand("rps.onsubmit");
                    return;
                case "examNotFound":
                    vscode_1.window.showErrorMessage("Exam code not found. Please try again.");
                    return;
                case "confirm":
                    vscode_1.commands.executeCommand("rps.onconfirm", text);
                    return;
                case "message":
                    // window.showInformationMessage("start");
                    vscode_1.commands.executeCommand("rps.sendmessage", "side");
                    return;
            }
        });
    }
}
exports.SideViewPanel = SideViewPanel;
SideViewPanel.viewType = "rps.sideview";
//# sourceMappingURL=SideViewPanel.js.map