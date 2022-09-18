import { BoxGenerator } from "./box-gen.js";

const staticBoxGen = new BoxGenerator();
const generate: BoxGenerator["generate"] = function(template, options) {
	return staticBoxGen.generate(template, options);
};

export default generate;
export * from "./box-gen.js";