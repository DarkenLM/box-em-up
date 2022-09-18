/**
 * Asset file builder
 * 
 * Copies non-source files (files not included in 'ignoreExts') to their respective folders on the build
 */

async function assetBuilder() {
	const distPath = 'dist'
	const srcPath = 'src'
	const ignoreExts = [".ts", ".js", ".mjs"]
	const { resolve, join, sep, dirname, extname } = require('path');
	const { readdir, mkdir, copyFile } = require('fs').promises;
	const { existsSync } = require('fs');
	let assets = 0

	async function getFiles(dir) {
		const dirents = await readdir(dir, { withFileTypes: true });
		const files = await Promise.all(dirents.map((dirent) => {
			const res = resolve(dir, dirent.name);
			return dirent.isDirectory() ? getFiles(res) : res;
		}));
		return Array.prototype.concat(...files);
	}

	//(async () => {
	let root = join(__dirname || process.cwd(), "../")
	let basePath = resolve(join(root, srcPath))

	console.log(consoleColors.blue("READING SOURCE CODE DIRECTORY"))
	let originals = await getFiles(basePath)
	console.log(consoleColors.green("SUCCESSFULLY READ SOURCE CODE DIRECTORY"))

	console.log(consoleColors.blue("READING ASSETS PRESENT ON THE SOURCE CODE DIRECTORY"))
	//originals.forEach(async orig => {
	for (const orig of originals) {
		console.log(consoleColors.blue(["ATTEMPTING TO BUILD ASSET", orig].join(" ")))
		let _srcFile = orig.replace(basePath, '')
		let srcFile = _srcFile.startsWith(sep) ? _srcFile.replace(sep, '') : _srcFile
		let reflectedFile = resolve(join(root, distPath, srcFile))
		let reflectedDirName = dirname(reflectedFile)

		console.log(consoleColors.magenta("ASSERTING ASSET VALIDITY"))
		if (ignoreExts.includes(extname(reflectedFile))) {
			//console.warn(consoleColors.red(`Could not build asset ${reflectedFile}: Asset is a source code file.`))
			continue;
		}
		console.log(consoleColors.green("Asset is valid."))

		if (!existsSync(reflectedDirName)) {
			console.warn(consoleColors.yellow(`Asset ${reflectedFile}'s parent directory does not exist, creating ${reflectedDirName}.`))
			await mkdir(reflectedDirName, {
				recursive: true
			})
		}

		console.log(consoleColors.magenta(["COPYING ASSET", orig, "TO", reflectedFile].join(" ")))
		await copyFile(orig, reflectedFile)
		assets++
		console.log(consoleColors.green(["Successfully copied asset", orig, "to", reflectedFile].join(" ")))
	}//)

	return { assets }
	//})()
}

async function init() {
	console.log(consoleColors.white(" --------------- ASSET BUILDER --------------"))
	const { assets } = await assetBuilder()
	console.log(consoleColors.cyan(`Finished building ${assets} assets`))
	console.log(consoleColors.white(" ----------- ASSET BUILDER FINISHED ----------"))
}

module.exports.init = init

//init()