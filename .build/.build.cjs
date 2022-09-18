/**
 * Build Script Configuration File
 * 
 * This file controls scripts to run after the compilation of the source code
 */

// OPTIONS
// All paths are relative to the project directory (parent directory).
const distDir = "dist" // The build output directory
const srcDir = "src"   // The source code directory

/*
*****************************************************
******* DON'T EDIT ANYTHING BEYOND THIS POINT *******
*****************************************************
*/

const assetBuilder = require("./assets.build.cjs")
const postProcessor = require("./postprocess.build.cjs")

/**
 * Console Color Formatter using ANSI Codes
 */
const consoleColors = {
	byNum: (mess, fgNum, bgNum) => {
		mess = mess || '';
		fgNum = fgNum === undefined ? 31 : fgNum;
		bgNum = bgNum === undefined ? 1 : bgNum; //47
		return '\u001b[' + fgNum + 'm' + '\u001b[' + bgNum + 'm' + mess + '\u001b[0m' //'\u001b[39m\u001b[49m';
	},
	black: (mess, fgNum) => consoleColors.byNum(mess, 30, fgNum),
	red: (mess, fgNum) => consoleColors.byNum(mess, 31, fgNum),
	green: (mess, fgNum) => consoleColors.byNum(mess, 32, fgNum),
	yellow: (mess, fgNum) => consoleColors.byNum(mess, 33, fgNum),
	blue: (mess, fgNum) => consoleColors.byNum(mess, 34, fgNum),
	magenta: (mess, fgNum) => consoleColors.byNum(mess, 35, fgNum),
	cyan: (mess, fgNum) => consoleColors.byNum(mess, 36, fgNum),
	white: (mess, fgNum) => consoleColors.byNum(mess, 37, fgNum)
};

global.consoleColors = consoleColors

async function init() {
	const options = {
		distDir,
		srcDir
	}

	console.log(consoleColors.white(" --------------------- ROOT BUILDER --------------------"))

	await assetBuilder.init(options)
	await postProcessor.init(options)
	
	console.log(consoleColors.white(" ---------------- ROOT BUILDER FINISHED ---------------"))
}

init()