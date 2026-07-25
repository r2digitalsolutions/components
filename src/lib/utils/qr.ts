/**
 * Minimal QR Code encoder (byte mode, ECC level M).
 * Generates a boolean matrix suitable for SVG rendering. No external deps.
 */

const ECC_CODEWORDS_PER_BLOCK: Record<number, number> = {
	1: 10,
	2: 16,
	3: 26,
	4: 18,
	5: 24,
	6: 16,
	7: 18,
	8: 22,
	9: 22,
	10: 26
};

const DATA_CODEWORDS: Record<number, number> = {
	1: 16,
	2: 28,
	3: 44,
	4: 64,
	5: 86,
	6: 108,
	7: 124,
	8: 154,
	9: 182,
	10: 216
};

const ALIGNMENT: Record<number, number[]> = {
	1: [],
	2: [6, 18],
	3: [6, 22],
	4: [6, 26],
	5: [6, 30],
	6: [6, 34],
	7: [6, 22, 38],
	8: [6, 24, 42],
	9: [6, 26, 46],
	10: [6, 28, 50]
};

function gfMul(x: number, y: number) {
	if (x === 0 || y === 0) return 0;
	return EXP[(LOG[x] + LOG[y]) % 255];
}

const EXP = new Array<number>(512);
const LOG = new Array<number>(256);
(() => {
	let x = 1;
	for (let i = 0; i < 255; i++) {
		EXP[i] = x;
		LOG[x] = i;
		x <<= 1;
		if (x & 0x100) x ^= 0x11d;
	}
	for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();

function rsGenerator(n: number) {
	let g = [1];
	for (let i = 0; i < n; i++) {
		const next = new Array(g.length + 1).fill(0);
		for (let j = 0; j < g.length; j++) {
			next[j] ^= g[j];
			next[j + 1] ^= gfMul(g[j], EXP[i]);
		}
		g = next;
	}
	return g;
}

function rsEncode(data: number[], ecLen: number) {
	const gen = rsGenerator(ecLen);
	const res = new Array(ecLen).fill(0);
	for (const b of data) {
		const factor = b ^ res[0];
		res.shift();
		res.push(0);
		for (let i = 0; i < ecLen; i++) res[i] ^= gfMul(gen[i + 1] ?? 0, factor);
	}
	return res;
}

function bitBuffer() {
	const bits: number[] = [];
	return {
		put(val: number, len: number) {
			for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
		},
		toBytes() {
			const out: number[] = [];
			for (let i = 0; i < bits.length; i += 8) {
				let b = 0;
				for (let j = 0; j < 8; j++) b = (b << 1) | (bits[i + j] ?? 0);
				out.push(b);
			}
			return out;
		},
		get length() {
			return bits.length;
		}
	};
}

function chooseVersion(byteLen: number) {
	for (let v = 1; v <= 10; v++) {
		const capacity = DATA_CODEWORDS[v] - 3; // mode+len overhead approx for short
		const bitsNeeded = 4 + (v <= 9 ? 8 : 16) + byteLen * 8 + 4;
		const maxBits = DATA_CODEWORDS[v] * 8;
		if (bitsNeeded <= maxBits && byteLen <= capacity + 2) return v;
	}
	return 10;
}

function sizeOf(version: number) {
	return version * 4 + 17;
}

function placeFinder(mod: (boolean | null)[][], r: number, c: number) {
	for (let y = -1; y <= 7; y++) {
		for (let x = -1; x <= 7; x++) {
			const rr = r + y;
			const cc = c + x;
			if (rr < 0 || cc < 0 || rr >= mod.length || cc >= mod.length) continue;
			const inFinder = x >= 0 && x <= 6 && y >= 0 && y <= 6;
			const onBorder = x === 0 || x === 6 || y === 0 || y === 6;
			const inCore = x >= 2 && x <= 4 && y >= 2 && y <= 4;
			if (inFinder) mod[rr][cc] = onBorder || inCore;
			else mod[rr][cc] = false;
		}
	}
}

function placeAlignment(mod: (boolean | null)[][], r: number, c: number) {
	for (let y = -2; y <= 2; y++) {
		for (let x = -2; x <= 2; x++) {
			mod[r + y][c + x] = Math.max(Math.abs(x), Math.abs(y)) !== 1;
		}
	}
}

function maskFn(mask: number, r: number, c: number) {
	switch (mask) {
		case 0:
			return (r + c) % 2 === 0;
		case 1:
			return r % 2 === 0;
		case 2:
			return c % 3 === 0;
		case 3:
			return (r + c) % 3 === 0;
		case 4:
			return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
		case 5:
			return ((r * c) % 2) + ((r * c) % 3) === 0;
		case 6:
			return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
		default:
			return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
	}
}

/** Returns a square boolean matrix (true = dark module). */
export function encodeQR(text: string): boolean[][] {
	const bytes = Array.from(new TextEncoder().encode(text));
	const version = chooseVersion(bytes.length);
	const size = sizeOf(version);
	const dataCapacity = DATA_CODEWORDS[version];
	const ecLen = ECC_CODEWORDS_PER_BLOCK[version];

	const buf = bitBuffer();
	buf.put(0b0100, 4); // byte mode
	buf.put(bytes.length, version <= 9 ? 8 : 16);
	for (const b of bytes) buf.put(b, 8);
	buf.put(0, Math.min(4, dataCapacity * 8 - buf.length));
	while (buf.length % 8 !== 0) buf.put(0, 1);

	const data = buf.toBytes();
	const pad = [0xec, 0x11];
	let pi = 0;
	while (data.length < dataCapacity) data.push(pad[pi++ % 2]);

	const ec = rsEncode(data.slice(0, dataCapacity), ecLen);
	const codewords = [...data.slice(0, dataCapacity), ...ec];

	const mod: (boolean | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));

	placeFinder(mod, 0, 0);
	placeFinder(mod, 0, size - 7);
	placeFinder(mod, size - 7, 0);

	for (let i = 8; i < size - 8; i++) {
		if (mod[6][i] === null) mod[6][i] = i % 2 === 0;
		if (mod[i][6] === null) mod[i][6] = i % 2 === 0;
	}

	const aligns = ALIGNMENT[version];
	for (const r of aligns) {
		for (const c of aligns) {
			if (mod[r][c] !== null) continue;
			placeAlignment(mod, r, c);
		}
	}

	// format info reserved
	for (let i = 0; i < 9; i++) {
		if (mod[8][i] === null) mod[8][i] = false;
		if (mod[i][8] === null) mod[i][8] = false;
	}
	for (let i = 0; i < 8; i++) {
		if (mod[8][size - 1 - i] === null) mod[8][size - 1 - i] = false;
		if (mod[size - 1 - i][8] === null) mod[size - 1 - i][8] = false;
	}
	mod[size - 8][8] = true;

	const bits: number[] = [];
	for (const cw of codewords) {
		for (let i = 7; i >= 0; i--) bits.push((cw >> i) & 1);
	}

	let bitIndex = 0;
	let direction = -1;
	for (let col = size - 1; col > 0; col -= 2) {
		if (col === 6) col = 5;
		for (let i = 0; i < size; i++) {
			const row = direction < 0 ? size - 1 - i : i;
			for (let c = 0; c < 2; c++) {
				const cc = col - c;
				if (mod[row][cc] !== null) continue;
				mod[row][cc] = bits[bitIndex++] === 1;
			}
		}
		direction *= -1;
	}

	const mask = 0;
	const out: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
	for (let r = 0; r < size; r++) {
		for (let c = 0; c < size; c++) {
			const dark = !!mod[r][c];
			out[r][c] = maskFn(mask, r, c) ? !dark : dark;
		}
	}

	// Write simplified format bits (ECC M + mask 0) — hardcoded BCH for 0b00100 << 10 etc.
	const format = 0b101010000010010; // common format for M / mask0 approximation
	for (let i = 0; i < 15; i++) {
		const bit = ((format >> i) & 1) === 1;
		// vertical near finder
		if (i < 6) out[i][8] = bit;
		else if (i < 8) out[i + 1][8] = bit;
		else out[size - 15 + i][8] = bit;
		// horizontal
		if (i < 8) out[8][size - 1 - i] = bit;
		else if (i < 9) out[8][15 - i] = bit;
		else out[8][14 - i] = bit;
	}

	return out;
}

export function qrToSvgPath(matrix: boolean[][], cell = 1): string {
	const parts: string[] = [];
	for (let r = 0; r < matrix.length; r++) {
		for (let c = 0; c < matrix[r].length; c++) {
			if (matrix[r][c]) {
				parts.push(`M${c * cell},${r * cell}h${cell}v${cell}h${-cell}z`);
			}
		}
	}
	return parts.join('');
}

/**
 * Clears a centered square so a logo can sit in empty modules
 * instead of covering data. `ratio` is hole size relative to matrix (0–1).
 * Returns a shallow-cloned matrix.
 */
export function punchLogoHole(matrix: boolean[][], ratio = 0.28): boolean[][] {
	const n = matrix.length;
	if (n === 0) return matrix;

	const clamped = Math.min(0.36, Math.max(0.12, ratio));
	const hole = Math.max(3, Math.round(n * clamped));
	const start = Math.floor((n - hole) / 2);
	const end = start + hole;

	const out = matrix.map((row) => row.slice());
	for (let r = start; r < end; r++) {
		for (let c = start; c < end; c++) {
			out[r][c] = false;
		}
	}
	return out;
}
