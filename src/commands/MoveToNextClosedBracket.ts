import * as vscode from "vscode";
import { brackets } from "../helpers/brackets";
export function MoveToNextClosedBracket() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  const position = editor.selection.active;
  const text = editor.document.getText(
    new vscode.Range(
      position,
      editor.document.lineAt(editor.document.lineCount - 1).range.end,
    ),
  );
  let nearestBracketIndex = Number.MAX_SAFE_INTEGER;
  for (const bracket of brackets) {
    const index = text.indexOf(bracket.close);
    if (index === -1) continue; // bracket not found...
    if (index < nearestBracketIndex) nearestBracketIndex = index;
  }
  if (nearestBracketIndex === Number.MAX_SAFE_INTEGER) return;
  const newPosition = editor.document.positionAt(
    editor.document.offsetAt(position) + nearestBracketIndex,
  );
  editor.selection = new vscode.Selection(newPosition, newPosition);
}
