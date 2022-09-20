"use strict";

import { expect } from "chai";
import { supportsColor } from "chalk";
import { inspect } from "util";
import staticGenerate, { BoxGenerator, Separator } from "../src/index.js";

inspect;

if (!supportsColor) {
	console.error("Terminal does not support color. Exiting.");
	process.exit(1);
}

const colors = (supportsColor.level === 1 || supportsColor.level === 2) ? {
	white: "97",
	red: "91",
	green: "92",
	blue: "94"
} : {
	white: "38;2;255;255;255",
	red: "38;2;255;0;0",
	green: "38;2;0;255;0",
	blue: "38;2;0;0;255"
};

describe("Static Box Generator", () => {
	const generator = staticGenerate;

	describe("No options", () => {
		it("should generate a simple box", () => {
			const simpleBox = generator([
				["Hello"]
			]);
	
			expect(simpleBox, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				`\x1B[${colors.white}m┌──────────────────────────────────────────────────────────────────────┐\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m Hello                                                                \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m└──────────────────────────────────────────────────────────────────────┘`
			);
		});
		
		it("should generate a simple box with two lines", () => {
			const simpleBox = generator([
				["Hello"],
				["World"]
			]);
	
			expect(simpleBox, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				`\x1B[${colors.white}m┌──────────────────────────────────────────────────────────────────────┐\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m Hello                                                                \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m├──────────────────────────────────────────────────────────────────────┤\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m World                                                                \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m└──────────────────────────────────────────────────────────────────────┘`
			);
		});
	
		it("should generate a simple box with two lines, two sectors each", () => {
			const simpleBox = generator([
				["Hello", "World"],
				["World", "Hello"]
			]);
	
			expect(simpleBox, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				`\x1B[${colors.white}m┌───────────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────┐\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m Hello                                                             \x1B[${colors.white}m│\x1B[${colors.white}m World                                                             \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m├───────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────┤\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m World                                                             \x1B[${colors.white}m│\x1B[${colors.white}m Hello                                                             \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m└───────────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────────────────┘`
			);
		});
	
		it("should generate a simple box with two lines, two sectors each, two lines per sector line", () => {
			const simpleBox = generator([
				[["Hello", "World"], ["Foo", "Bar"]],
				[["World", "Hello"], ["Bar", "Foo"]]
			]);
	
			expect(simpleBox, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				`\x1B[${colors.white}m┌───────────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────┐\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m Hello                                                             \x1B[${colors.white}m│\x1B[${colors.white}m Foo                                                               \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m World                                                             \x1B[${colors.white}m│\x1B[${colors.white}m Bar                                                               \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m├───────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────┤\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m World                                                             \x1B[${colors.white}m│\x1B[${colors.white}m Bar                                                               \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m Hello                                                             \x1B[${colors.white}m│\x1B[${colors.white}m Foo                                                               \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m└───────────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────────────────┘`
			);
		});
	
		it("should generate a simple box with two lines, two sectors each, two inner lines first, one inner line second", () => {
			const simpleBox = generator([
				[["Hello", "World"], "Foo"],
				[["World", "Hello"], "Bar"]
			]);
	
			expect(simpleBox, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				`\x1B[${colors.white}m┌───────────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────┐\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m Hello                                                             \x1B[${colors.white}m│\x1B[${colors.white}m Foo                                                               \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m World                                                             \x1B[${colors.white}m│\x1B[${colors.white}m                                                                   \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m├───────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────┤\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m World                                                             \x1B[${colors.white}m│\x1B[${colors.white}m Bar                                                               \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m Hello                                                             \x1B[${colors.white}m│\x1B[${colors.white}m                                                                   \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m└───────────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────────────────┘`
			);
		});
	
		it("should generate a simple box with two lines, two sectors first, one sector second, two inner lines first, one inner line second", () => {
			const simpleBox = generator([
				[["Hello", "World"], "Foo"],
				[["World", "Hello"]]
			]);
	
			expect(simpleBox, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				`\x1B[${colors.white}m┌───────────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────┐\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m Hello                                                             \x1B[${colors.white}m│\x1B[${colors.white}m Foo                                                               \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m World                                                             \x1B[${colors.white}m│\x1B[${colors.white}m                                                                   \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m├───────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────┤\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m World                                                             \x1B[${colors.white}m│\x1B[${colors.white}m                                                                   \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m Hello                                                             \x1B[${colors.white}m│\x1B[${colors.white}m                                                                   \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m└───────────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────────────────┘`
			);
		});
	
		it("should generate a simple box with one line, two sectors when passing empty strings to the second line", () => {
			const box = generator([
				["Hello", "World"],
				["", ""]
			]);
	
			expect(box, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				`\x1B[${colors.white}m┌───────────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────┐\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m Hello                                                             \x1B[${colors.white}m│\x1B[${colors.white}m World                                                             \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m└───────────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────────────────┘`
			);
		});

		it("should generate a simple box with a horizontal separator", () => {
			const simpleBox = generator([
				["Hello"],
				new Separator()
			]);
	
			expect(simpleBox, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				`\x1B[${colors.white}m┌──────────────────────────────────────────────────────────────────────┐\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m Hello                                                                \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m├──────────────────────────────────────────────────────────────────────┤\n` +
				`\x1B[${colors.white}m└──────────────────────────────────────────────────────────────────────┘`
			);
		});
	});

	describe("With options", () => {
		it("should generate a simple box with a title", () => {
			const box = generator([
				["Hello"]
			], {
				title: "Hello world"
			});

			expect(box, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				`\x1B[${colors.white}m┌\x1B[${colors.white}m Hello world \x1B[${colors.white}m\x1B[${colors.white}m\x1B[${colors.white}m─────────────────────────────────────────────────────────┐\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m Hello                                                                \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m└──────────────────────────────────────────────────────────────────────┘`
			);
		});

		it("should generate a simple box with a subtitle", () => {
			const box = generator([
				["Hello"]
			], {
				subtitle: "Foo bar"
			});

			expect(box, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				`\x1B[${colors.white}m┌──────────────────────────────────────────────────────────────────────┐\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m Hello                                                                \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m└\x1B[${colors.white}m Foo bar \x1B[${colors.white}m─────────────────────────────────────────────────────────────┘`
			);
		});

		it("should generate a simple box with a title and a subtitle", () => {
			const box = generator([
				["Hello"]
			], {
				title: "Hello world",
				subtitle: "Foo bar"
			});

			expect(box, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				`\x1B[${colors.white}m┌\x1B[${colors.white}m Hello world \x1B[${colors.white}m\x1B[${colors.white}m\x1B[${colors.white}m─────────────────────────────────────────────────────────┐\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m Hello                                                                \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m└\x1B[${colors.white}m Foo bar \x1B[${colors.white}m─────────────────────────────────────────────────────────────┘`
			);
		});

		it("should generate a simple box with a title and a subtitle aligned to the center", () => {
			const box = generator([
				["Hello"]
			], {
				title: { content: "Hello world", align: "center" },
				subtitle: { content: "Foo bar", align: "center" }
			});

			expect(box, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				`\x1B[${colors.white}m┌─────────────────────────────\x1B[${colors.white}m Hello world \x1B[${colors.white}m\x1B[${colors.white}m\x1B[${colors.white}m────────────────────────────┐\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m Hello                                                                \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m└───────────────────────────────\x1B[${colors.white}m Foo bar \x1B[${colors.white}m──────────────────────────────┘`
			);
		});

		it("should generate a simple box with a title and a subtitle aligned to the right", () => {
			const box = generator([
				["Hello"]
			], {
				title: { content: "Hello world", align: "right" },
				subtitle: { content: "Foo bar", align: "right" }
			});

			expect(box, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				`\x1B[${colors.white}m┌─────────────────────────────────────────────────────────\x1B[${colors.white}m Hello world \x1B[${colors.white}m\x1B[${colors.white}m\x1B[${colors.white}m┐\n` +
				`\x1B[${colors.white}m│\x1B[${colors.white}m Hello                                                                \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m└─────────────────────────────────────────────────────────────\x1B[${colors.white}m Foo bar \x1B[${colors.white}m┘`
			);
		});

		it("should generate a simple box with a red grid", () => {
			const box = generator([
				["Hello"]
			], {
				colors: {
					grid: "#ff0000"//0xff0000
				}
			});

			expect(box, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				`\x1B[${colors.red}m┌──────────────────────────────────────────────────────────────────────┐\n` +
				`\x1B[${colors.red}m│\x1B[${colors.white}m Hello                                                                \x1B[${colors.red}m│\n` +
				`\x1B[${colors.red}m└──────────────────────────────────────────────────────────────────────┘`
			);
		});

		it("should generate a simple box with green text", () => {
			const box = generator([
				["Hello"]
			], {
				colors: {
					text: "#00ff00"//0x00ff00
				}
			});

			expect(box, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				`\x1B[${colors.white}m┌──────────────────────────────────────────────────────────────────────┐\n` +
				`\x1B[${colors.white}m│\x1B[${colors.green}m Hello                                                                \x1B[${colors.white}m│\n` +
				`\x1B[${colors.white}m└──────────────────────────────────────────────────────────────────────┘`
			);
		});

		it("should generate a simple box with a red grid and green text", () => {
			const box = generator([
				["Hello"]
			], {
				colors: {
					grid: "#ff0000",//0xff0000,
					text: "#00ff00"//0x00ff00
				}
			});

			expect(box, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				`\x1B[${colors.red}m┌──────────────────────────────────────────────────────────────────────┐\n` +
				`\x1B[${colors.red}m│\x1B[${colors.green}m Hello                                                                \x1B[${colors.red}m│\n` +
				`\x1B[${colors.red}m└──────────────────────────────────────────────────────────────────────┘`
			);

			//console.log(inspect(box, true, 5, true));
		});
	});

	describe("Custom character preset", () => {
		it("should generate a simple box with a custom character preset", () => {
			const boxGen = new BoxGenerator();

			const customCharacterPreset = {
				"TopRight": "╗",
				"TopLeft": "╔",
				"BottomRight": "╝",
				"BottomLeft": "╚",
				"HorizontalSeparator": "═",
				"VerticalSeparator": "║",
				"TopJunction": "╦",
				"BottomJunction": "╩",
				"MiddleJunction": "╬",
				"LeftJunction": "╠",
				"RightJunction": "╣",
			};
			const index = boxGen.addPreset(customCharacterPreset);
			boxGen.setPreset(index);

			const template = [
				["Hello"]
			];

			const box = boxGen.generate(template);

			expect(box, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				`\x1B[${colors.white}m╔══════════════════════════════════════════════════════════════════════╗\n` +
				`\x1B[${colors.white}m║\x1B[${colors.white}m Hello                                                                \x1B[${colors.white}m║\n` +
				`\x1B[${colors.white}m╚══════════════════════════════════════════════════════════════════════╝`
			);
		});
	});
});
