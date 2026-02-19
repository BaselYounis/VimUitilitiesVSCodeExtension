export type Bracket = {
  open: string;
  close: string;
};
export const BRACKETS: Bracket[] = [
  { open: "(", close: ")" },
  { open: "{", close: "}" },
  { open: "[", close: "]" },
  { open: "<", close: ">" }, 
];
export const BRACKET_OPENINGS = ["(", "{", "[", "<"];
export const BRACKET_CLOSINGS = [")", "}", "]", ">"];
export function isValidBracketPair(
  openBracket: string,
  closingBracket: string,
) {
  for (const bracket of BRACKETS) {
    if (bracket.open === openBracket && bracket.close === closingBracket)
      return true;
  }
  return false;
}
