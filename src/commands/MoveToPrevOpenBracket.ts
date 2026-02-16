import * as vscode from "vscode";
import { brackets } from "../helpers/brackets";
export function MoveToPrevOpenBracket() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  const position = editor.selection.active;
  const cursorOffset = editor.document.offsetAt(position);
  const text = editor.document.getText(
    new vscode.Range(editor.document.lineAt(0).range.start, position),
  );
  let nearestBracketIndex = -1;

  for (const bracket of brackets) {
    let closingBracketFound = false;
    for (let i = cursorOffset - 1; i >= 0; i--) {
      if (text[i] === bracket.close) {
        closingBracketFound = true;
        continue;
      }
      if (text[i] !== bracket.open) continue;
      if (i > nearestBracketIndex && closingBracketFound) {
        nearestBracketIndex = i;
        break;
      }
    }
  }
  if (nearestBracketIndex === -1) return;
  const newPosition = editor.document.positionAt(
    editor.document.offsetAt(position) -
      (text.length - nearestBracketIndex) +
      1,
  );
  editor.selection = new vscode.Selection(newPosition, newPosition);
}

//(())
