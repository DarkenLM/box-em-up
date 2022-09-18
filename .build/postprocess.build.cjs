const { resolve, join, sep, dirname, extname, basename } = require('path');
const { readdir, mkdir, copyFile } = require('fs').promises;
const { existsSync } = require('fs');
const { readFile, writeFile } = require('fs/promises');

async function getFiles(dir) {
	const dirents = await readdir(dir, { withFileTypes: true });
	const files = await Promise.all(dirents.map((dirent) => {
		const res = resolve(dir, dirent.name);
		return dirent.isDirectory() ? getFiles(res) : res;
	}));
	return Array.prototype.concat(...files);
}

async function importFixer(options) {
	try {
		const acceptedExts = [".ts", ".js", ".mjs"]
		const ignoreExts = [".d.ts"]
		let files = 0
		let root = join(__dirname || process.cwd(), "../")
		let basePath = resolve(join(root, options.distDir))

		console.log(consoleColors.blue("READING SOURCE CODE DIRECTORY"))
		let originals = await getFiles(basePath)
		console.log(consoleColors.green("SUCCESSFULLY READ SOURCE CODE DIRECTORY"))

		console.log(consoleColors.blue("READING ASSETS PRESENT ON THE SOURCE CODE DIRECTORY"))
		console.log(consoleColors.green("SUCCESSFULLY CLEANED BUILD DIRECTORY"))

		for (const orig of originals) {
			console.log(consoleColors.blue(["VERIFYING FILE LOCATED AT", orig].join(" ")))
			let _srcFile = orig.replace(basePath, '')
			let srcFile = _srcFile.startsWith(sep) ? _srcFile.replace(sep, '') : _srcFile

			console.log(consoleColors.magenta("ASSERTING FILE NATURE"))
			if (ignoreExts.some(e => basename(orig).endsWith(e))) {// ignoreExts.includes(extname(reflectedFile))
				console.warn(consoleColors.yellow(`FILE IS AN ASSET. SKIPPING.`))
				continue;
			} else if (!acceptedExts.some(e => basename(orig).endsWith(e))) {//!acceptedExts.includes(extname(reflectedFile))
				console.warn(consoleColors.yellow(`FILE IS NOT A SOURCE FILE. SKIPPING.`))
				continue;
			} 
			console.log(consoleColors.green("FILE IS A SOURCE FILE."))

			console.log(consoleColors.blue("READING SOURCE FILE..."))
			const fileData = await readFile(orig, { encoding: "utf8" })
			console.log(consoleColors.green("SUCCESSFULLY READ FILE."))

			console.log(consoleColors.magenta("VERIFYING SOURCE FILE IMPORTS"))
			if (/(\bfrom\s+["']\..*(?<!.js))(["'])/gm.test(fileData)) {
				console.log(consoleColors.cyan("SOURCE FILE HAS MALFORMED IMPORTS. FIXING IMPORTS."))
				const newFileData = fileData.replace(/(\bfrom\s+["']\..*(?<!.js))(["'])/gm, "$1.js$2")

				console.log(consoleColors.blue("OVERWRITING SOURCE FILE WITH CORRECTED DATA..."))
				await writeFile(orig, newFileData, { encoding: "utf8" })
				console.log(consoleColors.green("SUCCESSFULLY WRITTEN FILE."))
				continue
			} else {
				console.warn(consoleColors.yellow(`FILE HAS CORRECT IMPORTS. SKIPPING.`))
				continue
			}
		}
	} catch (e) {
		console.log(consoleColors.red(`Could not validate exports: ${e}\n${e.stack}`))
		process.exit(1)
	}
}

async function init(options) {
	console.log(consoleColors.white(" --------------- POSTPROCESSING ---------------"))

	await importFixer(options)

	console.log(consoleColors.white(" ----------- POSTPROCESSING FINISHED ----------"))
}

module.exports.init = init