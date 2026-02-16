import {
  Bracket as char,
  BRACKET_OPENINGS,
  BRACKET_CLOSINGS,
  isValidBracketPair,
} from "../helpers/brackets";
import * as vscode from "vscode";
type BracketMatch = { bracket: string; index: number };
type SelectionOptions = {
  delete?: boolean;
  cut?: boolean;
  copy?: boolean;
};
export function SelectBetweenBrackets(options: SelectionOptions) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  const cursorPosition = editor.selection.active;
  const document = editor.document;
  const cursorOffset = document.offsetAt(cursorPosition);
  const text = document.getText();
  const bracketMatches = getBracketMatchesFromText(text);
  const matchingPairs = findMatchingPairInBracketsMatches(bracketMatches);
  if (!matchingPairs) return;
  const cursorPair = findCursorPair(matchingPairs, cursorOffset);
  if (!cursorPair) return;
  const openBracket = cursorPair[0];
  const closeBracket = cursorPair[1];
  const prevPos = document.positionAt(openBracket.index + 1);
  const nextPos = document.positionAt(closeBracket.index);
  editor.selection = new vscode.Selection(prevPos, nextPos);
  const selectedText = document.getText(editor.selection);
  if (options.copy === true || options.cut === true) {
    vscode.env.clipboard.writeText(selectedText);
  }
  if (options.delete === true || options.cut === true)
    editor.edit((editBuilder) => {
      editBuilder.delete(editor.selection);
    });
}

function getBracketMatchesFromText(text: string) {
  const bracketMatches: BracketMatch[] = [];
  for (let idx = 0; idx < text.length; idx++) {
    const char = text[idx];
    if (BRACKET_CLOSINGS.includes(char) || BRACKET_OPENINGS.includes(char))
      bracketMatches.push({ bracket: char, index: idx });
  }
  return bracketMatches;
}

function findMatchingPairInBracketsMatches(bracketMatches: BracketMatch[]) {
  const completeMatches: [BracketMatch, BracketMatch][] = [];
  const inCompleteMatches: [BracketMatch, boolean][] = [];

  bracketMatches.forEach((match, index) => {
    if (BRACKET_OPENINGS.includes(match.bracket)) {
      inCompleteMatches.push([match, false]);
    }
    if (
      BRACKET_CLOSINGS.includes(match.bracket) &&
      inCompleteMatches.length !== 0
    ) {
      let currInCompleteMatch = null;
      for (const inCompleteMatch of inCompleteMatches) {
        if (
          isValidBracketPair(inCompleteMatch[0].bracket, match.bracket) &&
          inCompleteMatch[1] === false
        ) {
          currInCompleteMatch = inCompleteMatch;
        }
      }
      if (currInCompleteMatch) {
        currInCompleteMatch[1] = true;
        completeMatches.push([currInCompleteMatch[0], match]);
      }
    }
  });

  if (completeMatches.length === 0) return null;
  return completeMatches;
}

function findCursorPair(
  completeMatches: [BracketMatch, BracketMatch][],
  cursorOffset: number,
) {
  for (const match of completeMatches) {
    if (match[0].index < cursorOffset && match[1].index > cursorOffset)
      return match;
  }
  return null;
}

function parsePairs(matchingPairs: [BracketMatch, BracketMatch][]) {
  let s = "";
  matchingPairs.forEach((pair) => {
    s += `${pair[0].bracket} ${pair[1]?.bracket}`;
  });
  return s;
}
