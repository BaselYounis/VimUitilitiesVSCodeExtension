import * as vscode from "vscode";
import { BRACKET_OPENINGS, BRACKETS } from "../helpers/brackets";
export function MoveToPrevOpenBracket() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  const cursorPosition = editor.selection.active;
  const cursorOffset = editor.document.offsetAt(cursorPosition);
  const text = editor.document.getText(
    new vscode.Range(editor.document.lineAt(0).range.start, cursorPosition),
  );
  let bracketIndex = null;
  let deltaChar = 0;

  for (let i = cursorOffset - 2; i >= 0; i--) {
    deltaChar += 1;
    if (BRACKET_OPENINGS.includes(text[i])) {
      bracketIndex = i;
      break;
    }
  }
  if (!bracketIndex) return;
  const newPosition = editor.document.positionAt(
    editor.document.offsetAt(cursorPosition) - deltaChar ,
  );
  editor.selection = new vscode.Selection(newPosition, newPosition);
  editor.revealRange(
    new vscode.Range(newPosition, newPosition),
    vscode.TextEditorRevealType.InCenterIfOutsideViewport,
  );
}

//(
//(adfadf )
//)
