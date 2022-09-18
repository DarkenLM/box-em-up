/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk from "chalk";
import { range } from "./lib/generators.js";
import { getHexColorInt, getRandomTrueColor, isColorSupported, x16bitColors, x4bitColors } from "./lib/vendor/is-color-supported.js";
import { strlen } from "./lib/vendor/printable-characters.js";

type Primitive = string | number | boolean | bigint | symbol | undefined | null;
type Builtin = Primitive | Function | Date | Error | RegExp;
type DeepRequired<T> = T extends Error
  ? Required<T>
  : T extends Builtin
  ? T
  : T extends Map<infer K, infer V>
  ? Map<DeepRequired<K>, DeepRequired<V>>
  : T extends ReadonlyMap<infer K, infer V>
  ? ReadonlyMap<DeepRequired<K>, DeepRequired<V>>
  : T extends WeakMap<infer K, infer V>
  ? WeakMap<DeepRequired<K>, DeepRequired<V>>
  : T extends Set<infer U>
  ? Set<DeepRequired<U>>
  : T extends ReadonlySet<infer U>
  ? ReadonlySet<DeepRequired<U>>
  : T extends WeakSet<infer U>
  ? WeakSet<DeepRequired<U>>
  : T extends Promise<infer U>
  ? Promise<DeepRequired<U>>
  : T extends {}
  ? { [K in keyof T]-?: DeepRequired<T[K]> }
  : Required<T>;

/**
 * Represents a structure containing a character preset.
 */
interface BoxCharacters {
	/** E.g: '┐' */
	"TopRight": string,
	/** E.g: '┌' */
	"TopLeft": string,
	/** E.g: '┘' */
	"BottomRight": string,
	/** E.g: '└' */
	"BottomLeft": string,
	/** E.g: '─' */
	"HorizontalSeparator": string,
	/** E.g: '│' */
	"VerticalSeparator": string,
	/** E.g: '┬' */
	"TopJunction": string,
	/** E.g: '┴' */
	"BottomJunction": string,
	/** E.g: '┼' */
	"MiddleJunction": string,
	/** E.g: '├' */
	"LeftJunction": string,
	/** E.g: '┤' */
	"RightJunction": string,
}

/**
 * Represents a structure containing a set of options for box generation.
 */
interface BoxGenOptions {
	/** All sectors should have the same width */
	// balanceWidth?: boolean, WIP
	/** The maximum width the grid should occupy, in characters */
	maxWidth?: number,
	/** 
	 * The overflow type to be used.
	 *   - `newline`: Overflow should be broken intro a new line.
	 *   - `trim`: Overflow will be trimmed and discarded.
	 * */
	overflow?: "newline" | "trim",
	/** If enabled, all empty strings or strings with only whitespace will be removed. */
	stripEmpty?: boolean,
	/** If enabled, all line feeds (`\n`) will be interpreted and the string will be divided into multiple lines, otherwise line feeds will be escaped. */
	parseLineFeeds?: boolean,
	/** The index of the sector which should be prioritized if {@link BoxGenOptions.balanceWidth} is not enabled. */
	// priority?: number, WIP
	/** If enabled, eventual errors due to misconfiguration will be automatically resolved, otherwise an error will be thrown. */
	autocorrect?: boolean,
	/** If enabled, empty sectors will be joint. */
	//joinEmptySectors?: { horizontal: boolean, vertical: boolean }, WIP
	/** The title to show above the grid. */
	title?: { content: string, align?: "left" | "center" | "right", color?: string | number } | string//string
	/** The subtitle to show below the grid. */
	subtitle?: { content: string, align?: "left" | "center" | "right", color?: string | number } | string,
	colors?: {
		grid?: string | number,
		text?: string | number
	}
}

type CorrectedBoxOptions = Omit<DeepRequired<BoxGenOptions>, "title"> & {
	balanceWidth: true,
	priority: 0,
	joinEmptySectors: { horizontal: false, vertical: false },
	title: { content: string, align: "left" | "center" | "right", color: string | number }
	subtitle: { content: string, align: "left" | "center" | "right", color: string | number },
}

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-unused-vars
function sealed(constructor: Function) {
	Object.seal(constructor);
	Object.seal(constructor.prototype);
}

@sealed
class Separator extends Array {
	__BEU_CLASS: boolean;
	
	constructor() {
		super(0);

		this.__BEU_CLASS = true;
		this.__BEU_CLASS;
	}
}

type Element = Separator//string | Separator

/**
 * Represents a template to be used as a source for box generation.
 */
type BoxTemplate = ((string | string[])[] | Element)[]

/**
 * The class used to generate boxes.
 */
class BoxGenerator {
	presets: BoxCharacters[];
	preset: number;

	constructor() {
		const characterPreset0: BoxCharacters = {
			"TopRight": "┐",
			"TopLeft": "┌",
			"BottomRight": "┘",
			"BottomLeft": "└",
			"HorizontalSeparator": "─",
			"VerticalSeparator": "│",
			"TopJunction": "┬",
			"BottomJunction": "┴",
			"MiddleJunction": "┼",
			"LeftJunction": "├",
			"RightJunction": "┤",
		};

		this.presets = [characterPreset0];
		this.preset = 0;
	}

	get characters() {
		return this.presets[this.preset];
	}

	/**
	 * Sets the character set to be used.  
	 * Returns `true` if successfull, otherwise it returns `false`.
	 * 
	 * @param index The index of the preset to load.
	 */
	setPreset(index: number) {
		if (this.presets[index] !== undefined) {
			this.preset = index;
			return true;
		} else return false;
	}

	/**
	 * Adds a new preset to the preset list of the instance.
	 * 
	 * @param preset A `BoxCharacters` structure containing the characters to be used.
	 */
	addPreset(preset: BoxCharacters) {
		return this.presets.push(preset) - 1;
	}

	/**
	 * Generates a box from a template.
	 * 
	 * @param template The template to be used to generate the box.
	 * @param options The options to be used to modify the generated box.
	 */
	generate(template: BoxTemplate, options?: BoxGenOptions) {
		/* c8 ignore start */
		const Options: CorrectedBoxOptions = {
			balanceWidth: true,// options?.balanceWidth || false
			maxWidth: options?.maxWidth || 72,
			overflow: options?.overflow || "newline",
			stripEmpty: options?.stripEmpty || true,
			parseLineFeeds: options?.parseLineFeeds || false,
			priority: 0,// options?.priority || 0,
			autocorrect: options?.autocorrect || false,
			joinEmptySectors: { horizontal: false, vertical: false },// options?.joinEmptySectors || { horizontal: false, vertical: false },
			title: typeof options?.title === "string" 
				? ensureObjectStructure({ content: "", align: "left", color: -1 } as CorrectedBoxOptions["title"], { content: options.title })
				: ensureObjectStructure({ content: "", align: "left", color: -1 } as CorrectedBoxOptions["title"], options?.title || {}),
			subtitle: typeof options?.subtitle === "string" 
				? ensureObjectStructure({ content: "", align: "left", color: -1 } as CorrectedBoxOptions["subtitle"], { content: options.subtitle })
				: ensureObjectStructure({ content: "", align: "left", color: -1 } as CorrectedBoxOptions["subtitle"], options?.subtitle || {}),
			colors: {
				grid: options?.colors?.grid || "#ffffff",
				text: options?.colors?.text || "#ffffff",
			}
		};
		/* c8 ignore end */

		if (!isColorSupported(Options.colors.grid) && !["rainbow", "rainbow4", "rainbow16", "rainbow24"].includes(String(Options.colors.grid))) throw new Error(`Unsupported color for grid.`);
		if (!isColorSupported(Options.colors.text) && !["rainbow", "rainbow4", "rainbow16", "rainbow24"].includes(String(Options.colors.text))) throw new Error(`Unsupported color for text.`);

		const Template = Options.balanceWidth ? removeEmptyNested(template) : template; 
		const maxSectors = Template.reduce((a, b) => a.length > b.length ? a : b).length; // All lines should have this number of sectors.
		
		let defaultSectorWidth = Options.maxWidth - (4 + 3 * (maxSectors - 1)); // All sectors should have this width.
		if (defaultSectorWidth < 1) { // Invalid sector width.
			if (Options.autocorrect) { // Attempt to correct width by the least increment possible.
				while (defaultSectorWidth < 1) {
					Options.maxWidth += Math.ceil(Options.maxWidth / 10);
					defaultSectorWidth = Options.maxWidth - (4 + 3 * (maxSectors - 1));
				}
			} else { // Autocorrect is disabled. Throw an error with relevant information.
				let _dSW = defaultSectorWidth;
				let _oML = Options.maxWidth;

				while (_dSW < 1) {
					_oML += Math.ceil(_oML / 10);
					_dSW = _oML - (4 + 3 * (maxSectors - 1));
				}
		
				throw new Error(`Malformed options: option 'maxWidth' does not allow the amount of sectors required. Minimum width required: ${_oML}`);
			}
		}

		type contentLine = { width: number, lines: string[] }
		type separatorLine = { separator: true }
		type Line = (contentLine | separatorLine)[]
		const lines: Line[] = [];

		// Order: Template -> Line -> Sector ?-> SubLine
		if (Options.balanceWidth) { // All sectors have the same width (defaultSectorWidth)
			for (const line of Template) {
				if (line instanceof Separator) {
					lines.push([{ separator: true }]);
					continue;
				}

				const sectorLines: { width: number, lines: string[] }[] = [];

				for (const sector of line) {
					if (typeof sector === "string") { // Sector is defined as a string
						const _lines = Options.parseLineFeeds ? sector.split("\n") : [sector.replace(/\n/gm, "\\n")];

						if (Options.overflow === "newline") {
							const lines: string[] = [];

							for (const line of _lines) {
								lines.push(...makeSubStrings(line, 1, defaultSectorWidth));
							}

							// Lines: If the length of the line equals the maximum, do nothing, otherwise fill with whitespace until maximum is reached.
							sectorLines.push({ 
								width: defaultSectorWidth, 
								lines: lines.map(l => l.length === defaultSectorWidth ? l : `${l}${" ".repeat(defaultSectorWidth - l.length)}`)
							});
						} else {
							// Lines: If lenght of the line exceeds the maximum, trim it to the maximum length and replace the last 3 chars with '...', 
							// else if the length of the line equals the maximum, do nothing, otherwise fill with whitespace until maximum is reached.
							sectorLines.push({ 
								width: defaultSectorWidth, 
								lines: _lines.map(l => 
									l.length > defaultSectorWidth 
										? `${l.substring(0, defaultSectorWidth - 3)}...` 
										: l.length === defaultSectorWidth 
											? l 
											: `${l}${" ".repeat(defaultSectorWidth - l.length)}`
								)
							});
						}
					} else { // Sector is defined as an array of strings
						const subLines: string[] = [];
						
						for (const subLine of sector) { // Iterate through each line of the sector
							const _lines: string[] = Options.parseLineFeeds ? subLine.split("\n") : [subLine.replace(/\n/g, "\\n")];
							if (Options.overflow === "newline") {
								const lines: string[] = [];
	
								for (const line of _lines) {
									lines.push(...makeSubStrings(line, 1, defaultSectorWidth));
								}
	
								subLines.push(...lines.map(l => l.length === defaultSectorWidth ? l : `${l}${" ".repeat(defaultSectorWidth - l.length)}`));
							} else {
								subLines.push(..._lines.map(l => 
									l.length > defaultSectorWidth 
										? `${l.substring(0, defaultSectorWidth - 4)}...` 
										: l.length === defaultSectorWidth 
											? l 
											: `${l}${" ".repeat(defaultSectorWidth - l.length)}`
								));
							}
						}

						sectorLines.push({ 
							width: defaultSectorWidth, 
							lines: subLines.map(l => l.length === defaultSectorWidth ? l : `${l}${" ".repeat(defaultSectorWidth - l.length)}`)
						});
					}
				}

				if (sectorLines.length < maxSectors) {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					for (const _j of range(sectorLines.length, maxSectors)) 
						sectorLines.push({ 
							width: defaultSectorWidth, 
							lines: [" ".repeat(defaultSectorWidth)]
						});
				}

				lines.push(sectorLines);
			}
		}

		// Equalize sector width
		for (const line of lines) {
			if ("separator" in line[0]) continue;

			const sectorLineCount = (line.reduce((a, b) => {
				return ("separator" in a ? 0 : a.lines.length) > ("separator" in b ? 0 : b.lines.length)
					? a 
					: b;
			}) as contentLine).lines.length;

			for (const sector of line) {
				if ("separator" in sector) continue;

				if (sector.lines.length < sectorLineCount) {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					for (const _j of range(sector.lines.length, sectorLineCount)) sector.lines.push(" ".repeat(sector.width));
				}
			}
		}


		// Calculate maximum sector length
		const contentLineCount = lines.reduce((acc, cur) => {
			if ("separator" in cur[0]) return acc;

			return acc += (cur[0] as contentLine).lines.length;
		}, 0);

		let _contentLineIndex = 0;
		while (_contentLineIndex < lines.length - 1 && "separator" in lines[_contentLineIndex][0]) _contentLineIndex++;

		const contentLength = lines[_contentLineIndex].reduce((acc, cur) => {
			return acc += "separator" in cur ? 0 : cur.width;
		}, 0) + 3 * (lines[_contentLineIndex].length - 1);

		const fStr: string[] = new Array(contentLineCount + 2 + lines.length - 1).fill(`${this.characters["VerticalSeparator"]}`, 1, contentLineCount);
		let lineIndex = 1;

		// Insert title into top line of grid
		const title = Options.title.content.replace(/\n/g, "\\n");
		if (title.length > 0 && contentLength > 5) {
			if (strlen(title) >= contentLength + 1) {
				fStr[0] = [
					this.characters["TopLeft"],
					" ",
					title.substring(0, contentLength - 3),
					"...",
					" ",
					this.characters["TopRight"]
				].join("");
			} else {
				if (Options.title.align === "right") 
					fStr[0] = [
						this.characters["TopLeft"],
						this.characters["HorizontalSeparator"].repeat((contentLength - title.length)),
						" ",
						title,
						" ",
						this.characters["TopRight"]
					].join("");
				else if (Options.title.align === "center") 
					fStr[0] = [
						this.characters["TopLeft"],
						this.characters["HorizontalSeparator"].repeat((contentLength - title.length + 1) / 2),
						" ",
						title,
						" ",
						this.characters["HorizontalSeparator"].repeat((contentLength - title.length) / 2),
						this.characters["TopRight"]
					].join("");
				else if (Options.title.align === "left") 
					fStr[0] = [
						this.characters["TopLeft"],
						" ",
						title,
						" ",
						this.characters["HorizontalSeparator"].repeat(contentLength - title.length),
						this.characters["TopRight"]
					].join("");
			}
		} else {
			fStr[0] = `${this.characters["TopLeft"]}${this.characters["HorizontalSeparator"].repeat(contentLength + 2)}${this.characters["TopRight"]}`;
		}

		// Build and grid outline
		for (let l = 0; l < lines.length; l++) {
			const _line = lines[l];

			// Convert separators into grid lines
			if ("separator" in _line[0]) {
				fStr[lineIndex] = `${this.characters["LeftJunction"]}${this.characters["HorizontalSeparator"].repeat(contentLength + 2)}${this.characters["RightJunction"]}`;
				lineIndex++;
				continue;
			}

			const line = (_line as unknown as contentLine[]);

			const sectorLineCount = line[0].lines.length;

			for (const sector of line) {
				for (let i = 0; i < sector.lines.length; i++) {
					if (!fStr[lineIndex + i]) fStr[lineIndex + i] = `${this.characters["VerticalSeparator"]}`;
					if (fStr[lineIndex + i].at(-1) === " " && !sector.lines[i].match(/^\s+$/)) fStr[lineIndex + i] = `${fStr[lineIndex + i].substring(0, fStr[lineIndex + i].length - 1)}${this.characters["VerticalSeparator"]}`;//fStr[lineIndex + i - 1] = this.characters["VerticalSeparator"];
					fStr[lineIndex + i] += ` ${sector.lines[i]} ${sector.lines[i].match(/^\s+$/) ? " " : this.characters["VerticalSeparator"]}`;
				}
			}

			lineIndex += sectorLineCount;

			if (l < lines.length - 1) fStr[lineIndex] = `${this.characters["LeftJunction"]}${this.characters["HorizontalSeparator"].repeat(contentLength + 2)}${this.characters["RightJunction"]}`;

			lineIndex += 1;
		}

		// Insert subtitle into last line of grid
		const subtitle = Options.subtitle.content.replace(/\n/g, "\\n");
		if (subtitle && contentLength > 5) {
			if (strlen(subtitle) >= contentLength + 1) {
				fStr[fStr.length - 1] = [
					this.characters["BottomLeft"],
					" ",
					subtitle.substring(0, contentLength - 3),
					"...",
					" ",
					this.characters["BottomRight"]
				].join("");
			} else {
				if (Options.subtitle.align === "right") 
					fStr[fStr.length - 1] = [
						this.characters["BottomLeft"],
						this.characters["HorizontalSeparator"].repeat((contentLength - subtitle.length)),
						" ",
						subtitle,
						" ",
						this.characters["BottomRight"]
					].join("");
				else if (Options.subtitle.align === "center") 
					fStr[fStr.length - 1] = [
						this.characters["BottomLeft"],
						this.characters["HorizontalSeparator"].repeat((contentLength - subtitle.length + 1) / 2),
						" ",
						subtitle,
						" ",
						this.characters["HorizontalSeparator"].repeat((contentLength - subtitle.length) / 2),
						this.characters["BottomRight"]
					].join("");
				else if (Options.subtitle.align === "left") { 
					fStr[fStr.length - 1] = [
						this.characters["BottomLeft"],
						" ",
						subtitle,
						" ",
						this.characters["HorizontalSeparator"].repeat(contentLength - subtitle.length),
						this.characters["BottomRight"]
					].join("");
				}
			}
		} else {
			fStr[fStr.length - 1] = `${this.characters["BottomLeft"]}${this.characters["HorizontalSeparator"].repeat(contentLength + 2)}${this.characters["BottomRight"]}`;
		}

		// Fix grid lines
		for (let i = 0; i < fStr.length; i++) {
			let line = fStr[i];

			if (![this.characters["VerticalSeparator"], this.characters["RightJunction"], this.characters["TopRight"], this.characters["BottomRight"]].some(c => line.endsWith(c))) {
				if (line.startsWith(this.characters["LeftJunction"])) fStr[i] = `${line.substring(0, line.length - 1)}${this.characters["RightJunction"]}`;
				else fStr[i] = `${line.substring(0, line.length - 1)}${this.characters["VerticalSeparator"]}`;

				line = fStr[i];
			}
		}

		for (let i = 0; i < fStr.length; i++) {
			let line = fStr[i];

			if (i === 0) {
				const nextLine = fStr[i + 1];
				const vSepInd = getCharIndexes(nextLine, this.characters["VerticalSeparator"]);

				if (vSepInd.length > 0) {
					for (const index of vSepInd) {
						if (line[index] === this.characters["HorizontalSeparator"]) {
							fStr[i] = stringSplice(line, index, this.characters["TopJunction"], 1);

							line = fStr[i];
						}
					}
				}
			} else {
				// Iterate through current line, check for vertical separators.
				// Iterate through previous line, check for Junctions. If the indexes of the junctions coincide with the ones, replace them with Middle Junctions.
				//   If any of the character of the previous line at any of vertical separators' indexes of the current line is a horiontal separator, replate it with a
				//   Top Junction.
				// Iterate through previous line, check for Horizontal Separators. If the indexes of the Separators coincide with the ones on the current string, replace 
				//   them with Bottom Junction. 

				let prevLine = fStr[i - 1];
				let nextLine = fStr[i + 1];

				const vSepInd = getCharIndexes(line, this.characters["VerticalSeparator"]);

				if (vSepInd.length > 0) {
					for (const index of vSepInd) {
						const plChar = prevLine[index];

						if (plChar === this.characters["BottomJunction"]) fStr[i - 1] = stringSplice(prevLine, index, this.characters["MiddleJunction"], 1);
						else if (plChar === this.characters["HorizontalSeparator"]) fStr[i - 1] = stringSplice(prevLine, index, this.characters["TopJunction"], 1);

						prevLine = fStr[i - 1];

						if (i < fStr.length - 1) {
							const nlChar = nextLine[index];

							if (nlChar === this.characters["HorizontalSeparator"]) fStr[i + 1] = stringSplice(nextLine, index, this.characters["BottomJunction"], 1);

							nextLine = fStr[i + 1];
						}
					}
				}
			}
		}

		// Colorize grid and text
		const gridColor = makeColor(Options.colors.grid);
		const textColor = makeColor(Options.colors.text);
		const titleColor = typeof Options.title.color === "string" 
			? makeColor(Options.title.color)
			: (Options.title.color > 0) 
				? makeColor(Options.title.color)
				: textColor;
		const subtitleColor = typeof Options.subtitle.color === "string" 
			? makeColor(Options.subtitle.color)
			: (Options.subtitle.color > 0) 
				? makeColor(Options.subtitle.color)
				: textColor;

		const characters: string[] = Object.values(this.characters);

		for (let i = 0; i < fStr.length; i++) {
			const line = fStr[i];
			let newLine = "";
			let currentType = 0; // 0 - Grid | 1 - Text

			newLine += gridColor("");

			for (let j = 0; j < line.length; j++) {
				if (characters.includes(line[j])) {
					if (currentType === 1) {
						newLine += gridColor("");
						currentType = 0;
					}

					newLine += line[j];
				} else {
					if (i === 0) {
						let text = "";
						const origJ = j;
						let index = j;
						while (!characters.includes(line[index]) && index < line.length) {
							text += line[index];
							index++;
						}

						newLine += titleColor(text);
						j += index - origJ;
						currentType = 1;
						newLine += gridColor("");
					} if (i === fStr.length - 1) {
						let text = "";
						const origJ = j;
						let index = j;
						while (!characters.includes(line[index]) && index < line.length) {
							text += line[index];
							index++;
						}

						newLine += subtitleColor(text);
						j += index - origJ - 1;
						currentType = 1;
					} else {
						let text = "";
						const origJ = j;
						let index = j;
						while (!characters.includes(line[index]) && index < line.length) {
							text += line[index];
							index++;
						}

						newLine += textColor(text);
						j += index - origJ - 1;
						currentType = 1;
					}
				}
			}

			fStr[i] = newLine;
		}
		return fStr.join("\n");
	}
}

function buildANSIEscapedRegex(start: number, end: number) {
	return new RegExp(String.raw`(?:(?:\033\[[0-9;]*m)*.?){${start},${end}}`, "g");
}

/**
 * Divide a string into substrings while maintaining
 * @param str The string to divide
 * @param start The minimum size of each substring
 * @param end The maximum size of each substring
 */
function makeSubStrings(str: string, start = 1, end: number = str.length) {
	if (!Number.isInteger(start)) throw new Error("Malformed parameter 'start': Must be an integer.");
	if (start < 0) throw new Error("Malformed parameter 'start': Must be a positive integer.");

	if (!Number.isInteger(end)) throw new Error("Malformed parameter 'end': Must be an integer.");
	if (end < 0) throw new Error("Malformed parameter 'end': Must be a positive integer.");

	const regex = buildANSIEscapedRegex(start, end);
	const chunks = str.match(regex) || [];
	const arr: string[] = [];

	chunks.forEach(function(a) {
		if (!/^(?:\033\[[0-9;]*m)*$/.test(a)) {
			arr.push(a);
		}
	});

	return arr;
}

function removeEmptyNested(arr: BoxTemplate) {
	const retArr: BoxTemplate = [];

	for (let i = 0; i < arr.length; i++) {
		const line = arr[i];

		if (line instanceof Separator) {
			retArr.push(line);
			continue;
		}

		const lineArr = [];
		for (let j = 0; j < line.length; j++) {
			const sector = line[j];

			if (typeof sector === "string") {
				if (/^\s*$/.test(sector)) continue;
				else lineArr.push(sector);
			} else {
				const subLineArr = [];
				for (let k = 0; k < sector.length; k++) {
					const subLine = sector[k];

					if (/^\s*$/.test(subLine)) continue;
					else subLineArr.push(subLine);
				}

				if (subLineArr.length > 0) lineArr.push(subLineArr);
			}
		}

		if (lineArr.length > 0) retArr.push(lineArr);
	}

	return retArr;
}

function getCharIndexes(str: string, match: string | string[]) {
	const matches = typeof match === "string" ? [match] : match;
	const indices = [];

	for (let i = 0; i < str.length; i++) {
		if (matches.includes(str[i])) indices.push(i);
	}

	return indices;
}

/**
 * Splices text within a string.
 * @param {number} offset The position to insert the text at (before)
 * @param {string} text The text to insert
 * @param {number} [removeCount=0] An optional number of characters to overwrite
 * @returns {string} A modified string containing the spliced text.
 */
function stringSplice(str: string, offset: number, text: string, removeCount = 0): string {
	const calculatedOffset = offset < 0 ? str.length + offset : offset;
	return str.substring(0, calculatedOffset) + text + str.substring(calculatedOffset + removeCount);
}

function makeColor(color: string | number) {
	const rainbowCodes = ["rainbow", "rainbow4", "rainbow16", "rainbow24"];
	const rainbowColors = [x4bitColors, x4bitColors, x16bitColors, getRandomTrueColor(30)];
	const trueColor = rainbowCodes.indexOf(String(color)) === 3;
	const colorSet = rainbowColors[rainbowCodes.indexOf(String(color))];

	if (rainbowCodes.includes(String(color))) return (text: string) => rainbowify(text, colorSet, trueColor);

	const _ColorHexCode = getHexColorInt(color).toString(16);
	const _ColorCode = _ColorHexCode.length < 6 ? chalk.hex(`#${"0".repeat(6 - _ColorHexCode.length)}${_ColorHexCode}`) : chalk.hex(_ColorHexCode);
	const colorCode = _ColorCode("$").substring(0, getCharIndexes(_ColorCode("$"), "$")[0]);
	const Color = (text: string) => `${colorCode}${text}`;

	return Color;
}

function rainbowify(str: string, colors: ((string | number) | [number, number, number])[], truecolor?: boolean): string {
	const colorList = colors.slice(0);
	shuffleArray(colorList);

	const letters = str.split("");
	const colorsCount = colorList.length;
	const Letters = letters.map((l, i) => {
		const color = colorList[i % colorsCount];

		if (truecolor) {
			const truecolor = color as [number, number, number];
			const _ColorCode = chalk.rgb(truecolor[0], truecolor[1], truecolor[2]);

			return _ColorCode(l);
		} else {
			const _ColorHexCode = getHexColorInt(color as string | number).toString(16);
			const _ColorCode = _ColorHexCode.length < 6 ? chalk.hex(`#${"0".repeat(6 - _ColorHexCode.length)}${_ColorHexCode}`) : chalk.hex(_ColorHexCode);

			return _ColorCode(l);
		}
	});

	return Letters.join("");
}

function shuffleArray(array: unknown[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

function ensureObjectStructure<T extends Record<string, any>, U extends Record<string, any>>(master: T, obj: U, modify?: false): T & U
function ensureObjectStructure<T extends Record<string, any>, U extends Record<string, any>>(master: T, obj: U, modify: true): void
function ensureObjectStructure<T extends Record<string, any>, U extends Record<string, any>>(master: T, obj: U, modify?: boolean): T & U | void {
	if (modify) {
		for (const prop in master) {
			switch (typeof master[prop]) {
				case "object": {
					if (master[prop] !== null) {
						if (Array.isArray(master[prop])) {
							if (Array.isArray(obj[prop])) continue;
							else (obj[prop] as any) = master[prop];
						} else {
							if (typeof obj[prop] !== "object") (obj[prop] as any) = {};
	
							ensureObjectStructure(master[prop] as Record < string, unknown > , obj[prop] as Record<string, unknown>);
							break;
						}
					}
				}
				case "string":
				case "number":
				case "boolean":
				case "bigint":
				case "function":
				case "symbol":
				case "undefined":
				default: {
					if (prop in obj) {
						if (typeof obj[prop] === master[prop]) continue;
						else if (!obj[prop]) (obj[prop] as any) = master[prop];
					} else (obj[prop] as any) = master[prop];
				}
			}
		}
	} else {
		const Obj = {...obj};
		ensureObjectStructure(master, Obj, true);

		return Obj as T & U;
	}	
}

export { BoxGenerator, Separator, BoxCharacters, BoxGenOptions, BoxTemplate };

// const customCharacterPreset: BoxCharacters = {
// 	"TopRight": "╗",
// 	"TopLeft": "╔",
// 	"BottomRight": "╝",
// 	"BottomLeft": "╚",
// 	"HorizontalSeparator": "═",
// 	"VerticalSeparator": "║",
// 	"TopJunction": "╦",
// 	"BottomJunction": "╩",
// 	"MiddleJunction": "╬",
// 	"LeftJunction": "╠",
// 	"RightJunction": "╣",
// };

// const template = [ // Root of the template
// 	// new Separator(),
// 	// new Separator(),
// 	[ // Line 1
// 		"First Cell",
// 		["Second", "Multiline", "Cell"],
// 		"Third Cell"
// 	],
// 	// new Separator(),
// 	[
// 		"Test \n Fucking \nString"
// 	]
// ];
// const boxGen = new BoxGenerator();

// const index = boxGen.addPreset(customCharacterPreset);

// const gen = boxGen.generate(template, {
// 	maxWidth: 50, 
// 	//balanceWidth: true, 
// 	parseLineFeeds: false, 
// 	overflow: "trim", 
// 	title: { content: "Hello there", align: "right", color: "rainbow4" }, 
// 	subtitle: { content: "Bottom Line", align: "left", color: "rainbow24"},
// 	colors: {
// 		grid: 0xff0000,
// 		text: 0x00ff00
// 	}
// });

// console.log(boxGen.setPreset(index));

// const gen2 = boxGen.generate(template, {
// 	maxWidth: 50, 
// 	//balanceWidth: true, 
// 	parseLineFeeds: false, 
// 	overflow: "trim", 
// 	title: { content: "Hello there", align: "right", color: "rainbow4" }, 
// 	subtitle: { content: "Bottom Line", align: "left", color: "rainbow24"},
// 	colors: {
// 		grid: 0xff0000,
// 		text: 0x00ff00
// 	}
// });

// // const gen3 = boxGen.generate(template);

// console.log(gen);
// console.log(gen2);
// console.log(gen3);

// const gen = boxGen.generate(template, {
// 	maxWidth: 50, 
// 	//balanceWidth: true, 
// 	parseLineFeeds: false, 
// 	overflow: "trim", 
// 	title: { content: "Hello there", align: "right", color: "rainbow4" }, 
// 	subtitle: { content: "Bottom Line", align: "left", color: "rainbow24"},
// 	colors: {
// 		grid: 0xff0000,
// 		text: 0x00ff00
// 	}
// });//"Hello there how are your mercy today"
// console.log(inspect(gen, true, 10, true));
// console.log(gen);