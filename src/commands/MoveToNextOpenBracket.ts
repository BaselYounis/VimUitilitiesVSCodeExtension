import { BRACKETS } from "../helpers/brackets";
import { log } from "../helpers/log";
import * as vscode from "vscode";
import { MoveToNextClosedBracket } from "./MoveToNextClosedBracket";
export function MoveToNextOpenBracket() {
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
  for (const bracket of BRACKETS) {
    const bracketIndex = text.indexOf(bracket.open);
    if (bracketIndex === -1) continue;
    if (bracketIndex < nearestBracketIndex) nearestBracketIndex = bracketIndex;
  }
  if (nearestBracketIndex === Number.MAX_SAFE_INTEGER)
    return MoveToNextClosedBracket(); // no open bracket has been found so try to find the next closest
  const newPosition = editor.document.positionAt(
    editor.document.offsetAt(position) + nearestBracketIndex + 1,
  );
  editor.selection = new vscode.Selection(newPosition, newPosition);
  editor.revealRange(
    new vscode.Range(newPosition, newPosition),
    vscode.TextEditorRevealType.InCenterIfOutsideViewport,
  );
}
