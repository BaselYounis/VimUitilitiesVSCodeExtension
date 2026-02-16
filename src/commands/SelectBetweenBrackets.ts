import { Bracket, brackets } from "../helpers/brackets";
import { log } from "../helpers/log";
import * as vscode from "vscode";
type BracketMatch = { bracket: Bracket; index: number };
export function SelectBetweenBrackets(shouldDelete?: boolean) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  const cursorPosition = editor.selection.active;
  const document = editor.document;
  const cursorOffset = document.offsetAt(cursorPosition);
  const text = document.getText();
  const prevBracketMatches: BracketMatch[] = [];
  const nextBracketMatches: BracketMatch[] = [];
  for (const bracket of brackets) {
    for (let i = cursorOffset - 1; i >= 0; i--) {
      if (text[i] === bracket.close) break;
      if (text[i] === bracket.open)
        prevBracketMatches.push({ bracket: bracket, index: i });
    }
  }
  for (const bracket of brackets) {
    for (let i = cursorOffset + 1; i < text.length; i++) {
      if (text[i] === bracket.open) break;
      if (text[i] === bracket.close)
        nextBracketMatches.push({ bracket: bracket, index: i });
    }
  }
  if (nextBracketMatches.length !== prevBracketMatches.length) return;
  if (nextBracketMatches.length === 0) return;
  if (prevBracketMatches.length === 0) return;
  const lastNextMatch = nextBracketMatches[nextBracketMatches.length - 1];
  const lastPrevMatch = prevBracketMatches[prevBracketMatches.length - 1];
  if (lastNextMatch.bracket.close !== lastPrevMatch.bracket.close) return;
  const nextPos = document.positionAt(lastNextMatch.index - 1);
  const prevPos = document.positionAt(lastPrevMatch.index + 1);
  editor.selection = new vscode.Selection(prevPos, nextPos);
  if (shouldDelete === true)
    editor.edit((editBuilder) => {
      editBuilder.delete(editor.selection);
    });
}
