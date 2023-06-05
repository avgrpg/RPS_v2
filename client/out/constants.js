"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiUrl = void 0;
const vscode_1 = require("vscode");
const config = vscode_1.workspace.getConfiguration("rps");
exports.apiUrl = config.get("apiUrl") ? config.get("apiUrl") : "";
// export const apiUrl = "http://localhost:3001";
// when compiling the interfaces, we need to set the apiUrl as non import
//# sourceMappingURL=constants.js.map