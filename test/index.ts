"use strict";

import { expect } from "chai";
import { inspect } from "util";
import staticGenerate, { BoxGenerator, Separator } from "../src/index.js";

inspect;
describe("Static Box Generator", () => {
	const generator = staticGenerate;

	describe("No options", () => {
		it("should generate a simple box", () => {
			const simpleBox = generator([
				["Hello"]
			]);
	
			expect(simpleBox, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				"\x1B[38;2;255;255;255m┌──────────────────────────────────────────────────────────────────────┐\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Hello                                                                \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m└──────────────────────────────────────────────────────────────────────┘"
			);
		});
		
		it("should generate a simple box with two lines", () => {
			const simpleBox = generator([
				["Hello"],
				["World"]
			]);
	
			expect(simpleBox, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				"\x1B[38;2;255;255;255m┌──────────────────────────────────────────────────────────────────────┐\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Hello                                                                \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m├──────────────────────────────────────────────────────────────────────┤\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m World                                                                \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m└──────────────────────────────────────────────────────────────────────┘"
			);
		});
	
		it("should generate a simple box with two lines, two sectors each", () => {
			const simpleBox = generator([
				["Hello", "World"],
				["World", "Hello"]
			]);
	
			expect(simpleBox, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				"\x1B[38;2;255;255;255m┌───────────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────┐\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Hello                                                             \x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m World                                                             \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m├───────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────┤\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m World                                                             \x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Hello                                                             \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m└───────────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────────────────┘"
			);
		});
	
		it("should generate a simple box with two lines, two sectors each, two lines per sector line", () => {
			const simpleBox = generator([
				[["Hello", "World"], ["Foo", "Bar"]],
				[["World", "Hello"], ["Bar", "Foo"]]
			]);
	
			expect(simpleBox, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				"\x1B[38;2;255;255;255m┌───────────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────┐\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Hello                                                             \x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Foo                                                               \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m World                                                             \x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Bar                                                               \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m├───────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────┤\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m World                                                             \x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Bar                                                               \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Hello                                                             \x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Foo                                                               \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m└───────────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────────────────┘"
			);
		});
	
		it("should generate a simple box with two lines, two sectors each, two inner lines first, one inner line second", () => {
			const simpleBox = generator([
				[["Hello", "World"], "Foo"],
				[["World", "Hello"], "Bar"]
			]);
	
			expect(simpleBox, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				"\x1B[38;2;255;255;255m┌───────────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────┐\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Hello                                                             \x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Foo                                                               \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m World                                                             \x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m                                                                   \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m├───────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────┤\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m World                                                             \x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Bar                                                               \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Hello                                                             \x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m                                                                   \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m└───────────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────────────────┘"
			);
		});
	
		it("should generate a simple box with two lines, two sectors first, one sector second, two inner lines first, one inner line second", () => {
			const simpleBox = generator([
				[["Hello", "World"], "Foo"],
				[["World", "Hello"]]
			]);
	
			expect(simpleBox, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				"\x1B[38;2;255;255;255m┌───────────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────┐\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Hello                                                             \x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Foo                                                               \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m World                                                             \x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m                                                                   \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m├───────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────┤\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m World                                                             \x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m                                                                   \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Hello                                                             \x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m                                                                   \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m└───────────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────────────────┘"
			);
		});
	
		it("should generate a simple box with one line, two sectors when passing empty strings to the second line", () => {
			const box = generator([
				["Hello", "World"],
				["", ""]
			]);
	
			expect(box, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				"\x1B[38;2;255;255;255m┌───────────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────┐\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Hello                                                             \x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m World                                                             \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m└───────────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────────────────┘"
			);
		});

		it("should generate a simple box with a horizontal separator", () => {
			const simpleBox = generator([
				["Hello"],
				new Separator()
			]);
	
			expect(simpleBox, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				"\x1B[38;2;255;255;255m┌──────────────────────────────────────────────────────────────────────┐\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Hello                                                                \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m├──────────────────────────────────────────────────────────────────────┤\n" +
				"\x1B[38;2;255;255;255m└──────────────────────────────────────────────────────────────────────┘"
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
				"\x1B[38;2;255;255;255m┌\x1B[38;2;255;255;255m Hello world \x1B[38;2;255;255;255m\x1B[38;2;255;255;255m\x1B[38;2;255;255;255m─────────────────────────────────────────────────────────┐\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Hello                                                                \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m└──────────────────────────────────────────────────────────────────────┘"
			);
		});

		it("should generate a simple box with a subtitle", () => {
			const box = generator([
				["Hello"]
			], {
				subtitle: "Foo bar"
			});

			expect(box, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				"\x1B[38;2;255;255;255m┌──────────────────────────────────────────────────────────────────────┐\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Hello                                                                \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m└\x1B[38;2;255;255;255m Foo bar \x1B[38;2;255;255;255m─────────────────────────────────────────────────────────────┘"
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
				"\x1B[38;2;255;255;255m┌\x1B[38;2;255;255;255m Hello world \x1B[38;2;255;255;255m\x1B[38;2;255;255;255m\x1B[38;2;255;255;255m─────────────────────────────────────────────────────────┐\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Hello                                                                \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m└\x1B[38;2;255;255;255m Foo bar \x1B[38;2;255;255;255m─────────────────────────────────────────────────────────────┘"
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
				"\x1B[38;2;255;255;255m┌─────────────────────────────\x1B[38;2;255;255;255m Hello world \x1B[38;2;255;255;255m\x1B[38;2;255;255;255m\x1B[38;2;255;255;255m────────────────────────────┐\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Hello                                                                \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m└───────────────────────────────\x1B[38;2;255;255;255m Foo bar \x1B[38;2;255;255;255m──────────────────────────────┘"
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
				"\x1B[38;2;255;255;255m┌─────────────────────────────────────────────────────────\x1B[38;2;255;255;255m Hello world \x1B[38;2;255;255;255m\x1B[38;2;255;255;255m\x1B[38;2;255;255;255m┐\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;255;255;255m Hello                                                                \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m└─────────────────────────────────────────────────────────────\x1B[38;2;255;255;255m Foo bar \x1B[38;2;255;255;255m┘"
			);
		});

		it("should generate a simple box with a red grid", () => {
			const box = generator([
				["Hello"]
			], {
				colors: {
					grid: 0xff0000
				}
			});

			expect(box, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				"\x1B[38;2;255;0;0m┌──────────────────────────────────────────────────────────────────────┐\n" +
				"\x1B[38;2;255;0;0m│\x1B[38;2;255;255;255m Hello                                                                \x1B[38;2;255;0;0m│\n" +
				"\x1B[38;2;255;0;0m└──────────────────────────────────────────────────────────────────────┘"
			);
		});

		it("should generate a simple box with green text", () => {
			const box = generator([
				["Hello"]
			], {
				colors: {
					text: 0x00ff00
				}
			});

			expect(box, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				"\x1B[38;2;255;255;255m┌──────────────────────────────────────────────────────────────────────┐\n" +
				"\x1B[38;2;255;255;255m│\x1B[38;2;0;255;0m Hello                                                                \x1B[38;2;255;255;255m│\n" +
				"\x1B[38;2;255;255;255m└──────────────────────────────────────────────────────────────────────┘"
			);
		});

		it("should generate a simple box with a red grid and green text", () => {
			const box = generator([
				["Hello"]
			], {
				colors: {
					grid: 0xff0000,
					text: 0x00ff00
				}
			});

			expect(box, "example should exist and be correctly formatted").to.exist.and.to.be.equal(
				"\x1B[38;2;255;0;0m┌──────────────────────────────────────────────────────────────────────┐\n" +
				"\x1B[38;2;255;0;0m│\x1B[38;2;0;255;0m Hello                                                                \x1B[38;2;255;0;0m│\n" +
				"\x1B[38;2;255;0;0m└──────────────────────────────────────────────────────────────────────┘"
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
				"\x1B[38;2;255;255;255m╔══════════════════════════════════════════════════════════════════════╗\n" +
				"\x1B[38;2;255;255;255m║\x1B[38;2;255;255;255m Hello                                                                \x1B[38;2;255;255;255m║\n" +
				"\x1B[38;2;255;255;255m╚══════════════════════════════════════════════════════════════════════╝"
			);
		});
	});
});
