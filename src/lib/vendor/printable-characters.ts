/* eslint-disable no-misleading-character-class */
/*
	Ported to ESM from https://github.com/xpl/printable-characters/blob/master/printable-characters.js
*/

const ansiEscapeCode                   = "[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]"
	, zeroWidthCharacterExceptNewline  = "\u0000-\u0008\u000B-\u0019\u001b\u009b\u00ad\u200b\u2028\u2029\ufeff\ufe00-\ufe0f"
	, zeroWidthCharacter               = "\n" + zeroWidthCharacterExceptNewline
	, zeroWidthCharactersExceptNewline = new RegExp("(?:" + ansiEscapeCode + ")|[" + zeroWidthCharacterExceptNewline + "]", "g")
	, zeroWidthCharacters              = new RegExp("(?:" + ansiEscapeCode + ")|[" + zeroWidthCharacter + "]", "g")
	, partition                        = new RegExp("((?:" + ansiEscapeCode + ")|[\t" + zeroWidthCharacter + "])?([^\t" + zeroWidthCharacter + "]*)", "g");

export { zeroWidthCharacters };
export const ansiEscapeCodes = new RegExp(ansiEscapeCode, "g");
export function strlen(str: string) { return Array.from(str.replace(zeroWidthCharacters, "")).length; }
export function isBlank(str: string) { return str.replace(zeroWidthCharacters, "").replace(/\s/g, "").length === 0; }
export function blank(str: string) { Array.from (str.replace (zeroWidthCharactersExceptNewline, "")).map(x => ((x === "\t") || (x === "\n")) ? x : " ").join(""); }
export function Partition(str: string) {
	const spans = [];

	for (let m; (partition.lastIndex !== str.length) && (m = partition.exec(str));) { spans.push([m[1] || "", m[2]]); }
	partition.lastIndex = 0; // reset regex index
		
	return spans;
}
export function first(str: string, n: number) {
	let result = "", length = 0;

	for (const [nonPrintable, printable] of Partition(str)) {
		const text = Array.from(printable).slice(0, n - length); // Array.from solves the emoji problem as described here: http://blog.jonnew.com/posts/poo-dot-length-equals-two
		result += nonPrintable + text.join("");
		length += text.length;
	}

	return result;
}