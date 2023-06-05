import {workspace} from "vscode";

const config = workspace.getConfiguration("rps");

export const apiUrl:string | undefined = config.get("apiUrl")? config.get("apiUrl") : "";
// export const apiUrl = "http://localhost:3001";
// when compiling the interfaces, we need to set the apiUrl as non import