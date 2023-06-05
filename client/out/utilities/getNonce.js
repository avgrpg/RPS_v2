"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNonce = void 0;
/**
 * A helper function that returns a unique alphanumeric identifier called a nonce.
 *
 * @remarks This function is primarily used to help enforce content security
 * policies for resources/scripts being executed in a webview context.
 *
 * @returns A nonce
 */
function getNonce(length) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    if (length) {
        return text.substring(0, length);
    }
    return text;
}
exports.getNonce = getNonce;
//# sourceMappingURL=getNonce.js.map