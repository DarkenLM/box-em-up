/**
 * Substitute for the built-in `Math.random()` function, allowing for better pseudo-random number generation.
 * 
 * Usage:
 * ```
 * const m = new MersenneTwister();
 * const randomNumber = m.random();
 * ```
 *
 * Adapted from {@link https://gist.github.com/banksean/300494}
 * 
 * @class MersenneTwister
 */
export class MersenneTwister {
	N: number;
	M: number;
	MATRIX_A: number;
	UPPER_MASK: number;
	LOWER_MASK: number;
	mt: number[];
	mti: number;

	constructor(seed?: number | number[]) {
		if (seed == undefined) {
			seed = new Date().getTime();
		} 

		/* Period parameters */  
		this.N = 624;
		this.M = 397;
		this.MATRIX_A = 0x9908b0df;   /* constant vector a */
		this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
		this.LOWER_MASK = 0x7fffffff; /* least significant r bits */
		this.mt = new Array(this.N);  /* the array for the state vector */
		this.mti = this.N+1; 		  /* mti==N+1 means mt[N] is not initialized */

		if (Array.isArray(seed)) {
			this.init_by_array(seed, seed.length);
		} else {
			this.init_seed(seed);
		}
	}

	init_seed(s: number) {
		this.mt[0] = s >>> 0;

		for (this.mti=1; this.mti<this.N; this.mti++) {
			const s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
			this.mt[this.mti] = ( ( ( ( (s & 0xffff0000) >>> 16 ) * 1812433253 ) << 16 ) + (s & 0x0000ffff) * 1812433253) + this.mti;
			/* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
			/* In the previous versions, MSBs of the seed affect   */
			/* only MSBs of the array mt[].                        */
			/* 2002/01/09 modified by Makoto Matsumoto             */
			this.mt[this.mti] >>>= 0;
			/* for >32 bit machines */
		}
	}

	init_by_array(init_key: number[], key_length: number) {
		let i, j, k;

		this.init_seed(19650218);

		i = 1; 
		j = 0;
		k = (this.N>key_length ? this.N : key_length);

		for (; k; k--) {
			const s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);

			this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525))) + init_key[j] + j; /* non linear */
			this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
			i++; 
			j++;

			if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
			if (j>=key_length) j=0;
		}

		for (k = this.N - 1; k; k--) {
			const s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);

			this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941)) - i; /* non linear */
			this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
			i++;

			if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
		}
	
		this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
	}

	random_int() {
		let y;
		const mag01 = [0x0, this.MATRIX_A];
		/* mag01[x] = x * MATRIX_A  for x=0,1 */
	
		if (this.mti >= this.N) { /* generate N words at one time */
			let kk;
	
			if (this.mti == this.N+1)  /* if init_seed() has not been called, */
				this.init_seed(5489);  /* a default initial seed is used */
	
			for (kk = 0; kk < this.N - this.M; kk++) {
				y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
				this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
			}

			for (; kk < this.N - 1; kk++) {
				y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
				this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
			}
			
			y = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
			this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];
	
			this.mti = 0;
		}
	
		y = this.mt[this.mti++];
	
		/* Tempering */
		y ^= (y >>> 11);
		y ^= (y << 7) & 0x9d2c5680;
		y ^= (y << 15) & 0xefc60000;
		y ^= (y >>> 18);
	
		return y >>> 0;
	}

	random_int31() {
		return (this.random_int() >>> 1);
	}
	
	/* generates a random number on [0,1]-real-interval */
	/* origin name genrand_real1 */
	random_incl() {
		return this.random_int() * (1.0 / 4294967295.0);
		/* divided by 2^32-1 */
	}
	
	/* generates a random number on [0,1)-real-interval */
	random() {
		return this.random_int() * (1.0 / 4294967296.0);
		/* divided by 2^32 */
	}
	
	/* generates a random number on (0,1)-real-interval */
	/* origin name genrand_real3 */
	random_excl() {
		return (this.random_int() + 0.5) * (1.0 / 4294967296.0);
		/* divided by 2^32 */
	}
	
	/* generates a random number on [0,1) with 53-bit resolution*/
	/* origin name genrand_res53 */
	random_long() {
		const a = this.random_int() >>> 5, b = this.random_int() >>> 6;
		return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
	}
}