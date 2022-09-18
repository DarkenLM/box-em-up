/* c8 ignore start */

export function makeid(length: number) {
	let text = "";
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
	for (let i = 0; i < length; i += 1) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

export function range(start: number, stop?: number, step?: number) {
	if (typeof stop == "undefined") {
		// one param defined
		stop = start;
		start = 0;
	}

	if (typeof step == "undefined") {
		step = 1;
	}

	if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
		return [];
	}

	const result = [];
	for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
		result.push(i);
	}

	return result;
}

/* c8 ignore stop */