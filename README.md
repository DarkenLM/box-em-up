# Box Em' Up
> Wrap your text on your terminal in a beautiful way

## Install
```
npm install box-em-up
```

## Usage
Box Em' Up provides an easy way to generate boxes using a simple import:
```js
import boxEmUp from "box-em-up";

const template = [
	["Hello", "World"]
];

console.log(boxEmUp(template))
/*
┌───────────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────┐
│ Hello                                                             │ World                                                             │
└───────────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────────────────┘
*/

const box = boxGen.generate(template, {
	maxWidth: 50, 
	overflow: "trim", 
	title: { content: "Top Line", align: "right", color: "rainbow4" }, 
	subtitle: { content: "Bottom Line", align: "left", color: "rainbow24"},
	colors: {
		grid: 0xff0000,
		text: 0x00ff00
	}
});

console.log(box);
/*
┌─────────────────────────────────────────────┬─────────────────────────────────── Top Line ┐
│ Hello                                       │ World                                       │
└ Bottom Line ────────────────────────────────┴─────────────────────────────────────────────┘
*/
```

And an easy way to customize your boxes using the box generation class:
```js
import { BoxGenerator } from "box-em-up";
const boxGen = new BoxGenerator();

const customCharacterPreset: BoxCharacters = {
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
	["Hello", "World"]
];

const box = boxGen.generate(template);
console.log(box);
/*
╔═══════════════════════════════════════════════════════════════════╦═══════════════════════════════════════════════════════════════════╗
║ Hello                                                             ║ World                                                             ║
╚═══════════════════════════════════════════════════════════════════╩═══════════════════════════════════════════════════════════════════╝
*/
```

## API
### **Class: `BoxGenerator`**
The class used to generate boxes.

#### **`[getter]` characters(): BoxCharacters**
Returns the currently loaded character set for the instance.

#### **setPreset(index: number): boolean**
Sets the character set to be used. 
- **index** - `number`: The index of the preset to load.   
- **Returns:** `true` if successfull, `false` otherwise.

#### **addPreset(preset: BoxCharacters): boolean**
Adds a new preset to the preset list of the instance.
- **preset** - `BoxCharacters`: A `BoxCharacters` structure containing the characters to be used.
- **Returns:** The index (`number`) of the preset on the preset list.

#### **generate(template: BoxTemplate, options?: BoxGenOptions): string**
Generates a box from a template.
- **template** - `BoxTemplate`: The template to be used to generate the box.
- **options** - `BoxGenOptions` (Optional): The options to be used to modify the generated box.
- **Returns:** A string containing the generated box.

### **Class: `Separator`**
A helper class used to add horizontal separators to a box.

### **Interface: `BoxCharacters`**
Represents a structure containing a character preset.

> Any property in-between the `%` character represents a `Helper type` described below the properties section.
#### **Properties:**
- **TopRight**: `string`
  > E.g: "┐"
- **TopLeft**: `string`
  > E.g: "┌"
- **BottomRight**: `string`
  > E.g: "┘"
- **BottomLeft**: `string`
  > E.g: "└"
- **HorizontalSeparator**: `string`
  > E.g: "─"
- **VerticalSeparator**: `string`
  > E.g: "│"
- **TopJunction**: `string`
  > E.g: "┬"
- **BottomJunction**: `string`
  > E.g: "┴"
- **MiddleJunction**: `string`
  > E.g: "┼"
- **LeftJunction**: `string`
  > E.g: "├"
- **RightJunction**: `string`
  > E.g: "┤"

### **Interface: `BoxGenOptions`**
Represents a structure containing a set of options for box generation.

> Any property in-between the `%` character represents a `Helper type` described below the properties section.
#### **Properties:**
- **maxWidth** (Optional): `number`
  > The maximum width the grid should occupy, in characters
- **overflow** (Optional): `"newline"` | `"trim"`
  > The overflow type to be used.
  >   - `newline`: Overflow should be broken intro a new line.
  >   - `trim`: Overflow will be trimmed and discarded.
- **stripEmpty** (Optional): `boolean`
  > If enabled, all empty strings or strings with only whitespace will be removed.
- **parseLineFeeds** (Optional): `boolean`
  > If enabled, all line feeds (`\n`) will be interpreted and the string will be divided into multiple lines, otherwise line feeds will be escaped.
- **autocorrect** (Optional): `boolean`
  > If enabled, eventual errors due to misconfiguration will be automatically resolved, otherwise an error will be thrown.
- **title** (Optional):  
	- One of:
		- ```
		  { 
			  content: string, 
			  align?: "left" | "center" | "right", 
			  color?: %color%
		  }
		  ``` 
		- `string`

  > The title to show above the grid.
- **subtitle** (Optional):
	- One of:
		- ```
		  { 
			  content: string, 
			  align?: "left" | "center" | "right", 
			  color?: %color%
		  }
		  ``` 
		- `string`
  > The subtitle to show below the grid.
- **colors** (Optional): 
	```
	{
		grid?: %color%
		text?: %color%
	}
	```
  > The colors to be used on the box.

#### **Helper types:**
- **color:** One of:
  - `number` - A hexadecimal number representing an RGB color.
  - `string`:
    - A hexadecimal string representing an RGB color (must start with either `#` or `0x`).
	- `rainbow4`, `rainbow16`, `rainbow24`, representing the 4-bit, 16-bit and 24-bit (truecolor) color sets. `rainbow` is an alias for `rainbow4`.

### **Type: `BoxTemplate`**
Represents a template to be used as a source for box generation.

#### **Structure:**
  - An array containing zero or more elements of either:
    - `Separator`
	- `Sector[]`, where:
	  - `Sector` - One of:
	    - `string`
		- `string[]`

## TODO
- [ ] Add the ability to automatically fit contents to border, removing unused whitespace.
- [ ] Add the ability to automatically join empty sectors.