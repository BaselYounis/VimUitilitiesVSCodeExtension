// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Command } from "./constants/command-type";
import { MoveToNextOpenBracket } from "./commands/MoveToNextOpenBracket";
import { SelectBetweenBrackets } from "./commands/SelectBetweenBrackets";
import { MoveToNextClosedBracket } from "./commands/MoveToNextClosedBracket";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
  const commands: Command[] = [
    {
      id: "baselcustomkeybinds.moveToNextOpenBracket",
      handler: MoveToNextOpenBracket,
    },
    {
      id: "baselcustomkeybinds.moveToNextClosedBracket",
      handler: MoveToNextClosedBracket,
    },
    {
      id: "baselcustomkeybinds.selectBetweenBrackets",
      handler: () =>
        SelectBetweenBrackets({ delete: false, copy: false, cut: false }),
    },
    {
      id: "baselcustomkeybinds.deleteBetweenBrackets",
      handler: () => SelectBetweenBrackets({ delete: true }),
    },
    {
      id: "baselcustomkeybinds.copyBetweenBrackets",
      handler: () => SelectBetweenBrackets({ copy: true }),
    },
    {
      id: "baselcustomkeybinds.cutBetweenBrackets",
      handler: () => SelectBetweenBrackets({ cut: true }),
    },
  ];

  commands.forEach((element) => {
    context.subscriptions.push(
      vscode.commands.registerCommand(element.id, element.handler),
    );
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
