"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidePanel = void 0;
// Class for Side panel
// Webview-view-sample
const vscode = require("vscode");
const getNonce_1 = require("../utilities/getNonce");
class SidePanel {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView) {
        this._view = webviewView;
        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage((data) => {
            switch (data.type) {
                case "get-token": {
                    webviewView.webview.postMessage({
                        type: "token",
                        //   value: TokenManager.getToken(),
                    });
                    break;
                }
                case "openPanel": {
                    vscode.commands.executeCommand("rps.openpanel");
                    break;
                }
                case "onError": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showErrorMessage(data.value);
                    break;
                }
                case "history": {
                    vscode.commands.executeCommand("rps.historylog");
                    break;
                }
                case "xhistory": {
                    vscode.commands.executeCommand("rps.xhistory");
                    break;
                }
                case "clipboard": {
                    vscode.commands.executeCommand("rps.clipboard");
                    break;
                }
                case 'showhistory': {
                    vscode.commands.executeCommand("rps.showhistory");
                    break;
                }
                case 'report': {
                    vscode.commands.executeCommand("rps.report");
                    break;
                }
            }
        });
    }
    revive(panel) {
        this._view = panel;
    }
    _getHtmlForWebview(webview) {
        // VSCode Default style sheet
        const resetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "reset.css"));
        const vscssUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css"));
        // Custom script and stylesheet sheet
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js"));
        const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css"));
        const nonce = (0, getNonce_1.getNonce)();
        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${resetUri}" rel="stylesheet">
				<link href="${vscssUri}" rel="stylesheet">
        <link href="${cssUri}" rel="stylesheet">
        <script nonce ="${nonce}">
          const tsvscode = acquireVsCodeApi();
        </script>
        </head>
        <body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
		</body>
		</html>`;
    }
}
exports.SidePanel = SidePanel;
//# sourceMappingURL=SidePanel.js.map