import {
  CancellationToken,
  commands,
  Uri,
  Webview,
  WebviewPanel,
  WebviewView,
  WebviewViewProvider,
  WebviewViewResolveContext,
  window,
} from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";
import { apiUrl } from "../constants";
//   import * as weather from "weather-js";

export class SideViewPanel implements WebviewViewProvider {
  public static readonly viewType = "rps.sideview";
  // private readonly _panel!: WebviewPanel;
  private _view?: WebviewView;

  constructor(private readonly _extensionUri: Uri) {}

  public resolveWebviewView(
    webviewView: WebviewView,
    context: WebviewViewResolveContext,
    _token: CancellationToken
  ) {
    this._view = webviewView;
    // Allow scripts in the webview
    webviewView.webview.options = {
      // Enable JavaScript in the webview
      enableScripts: true,
      // Restrict the webview to only load resources from the `out` directory
      localResourceRoots: [
        Uri.joinPath(this._extensionUri, "out"),
        Uri.joinPath(this._extensionUri, "webview-ui/build"),
      ],
    };

    // Set the HTML content that will fill the webview view
    webviewView.webview.html = this._getWebviewContent(webviewView.webview, this._extensionUri);

    // Sets up an event listener to listen for messages passed from the webview view context
    // and executes code based on the message that is recieved
    this._setWebviewMessageListener(webviewView);
  }

  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    // The CSS file from the React build output
    const stylesUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.css"]);
    // The JS file from the React build output
    const scriptUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.js"]);
    const nonce = getNonce();

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; connect-src ${apiUrl}; style-src ${webview.cspSource} 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
        <link rel="stylesheet" type="text/css" href="${stylesUri}">
        <title>Hello World</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" nonce="${nonce}" src="${scriptUri}">
          const apiUrl = "${apiUrl}";
        </script>
      </body>
    </html>
          `;
  }

  public doRefactor(type: string, value: string) {
    // Send a message to the webview webview.
    // You can send any JSON serializable data.
    if (this._view) {
      this._view.webview.postMessage({ type: type, message: value });
    }
  }

  private _setWebviewMessageListener(webviewView: WebviewView) {
    webviewView.webview.onDidReceiveMessage((message) => {
      const command = message.command;
      const text = message.text;

      switch (command) {
        case "hello":
          // Code that should run in response to the hello message command
          window.showInformationMessage(text);
          return;
        // Add more switch case statements here as more webview message commands
        // are created within the webview context (i.e. inside media/main.js)
        case "start":
          window.showInformationMessage("start");
          commands.executeCommand("rps.onstart", text);
          return;
        case "submit":
          window.showInformationMessage(text);
          commands.executeCommand("rps.onsubmit");
          return;
        case "examNotFound":
          window.showErrorMessage("Exam code not found. Please try again.");
          return;
        case "confirm":
          commands.executeCommand("rps.onconfirm", text);
          return;
        case "message":
          // window.showInformationMessage("start");
          commands.executeCommand("rps.sendmessage", "side");
          return;
      }
    });
  }
}
