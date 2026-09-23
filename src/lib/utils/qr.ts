/**
 * QR Code encoder (byte mode, ECC level M, versions 1–40). No external deps.
 * Follows ISO/IEC 18004: block interleaving, version info, format info and
 * mask selection by penalty score, so the output is scannable by any reader.
 */

type Matrix = boolean[][];

const ECL_M_FORMAT_BITS = 0;

/** ECC codewords per block, level M, versions 1..40. */
const ECC_PER_BLOCK_M = [
	10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28,
	28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28
];

/** Number of ECC blocks, level M, versions 1..40. */
const NUM_BLOCKS_M = [
	1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26,
	28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49
];

function sizeOf(version: number) {
	return version * 4 + 17;
}

function numRawDataModules(version: number) {
	let result = (16 * version + 128) * version + 64;
	if (version >= 2) {
		const numAlign = Math.floor(version / 7) + 2;
		result -= (25 * numAlign - 10) * numAlign - 55;
		if (version >= 7) result -= 36;
	}
	return result;
}

function numDataCodewords(version: number) {
	return (
		Math.floor(numRawDataModules(version) / 8) -
		ECC_PER_BLOCK_M[version - 1] * NUM_BLOCKS_M[version - 1]
	);
}

function charCountBits(version: number) {
	return version <= 9 ? 8 : 16;
}

function chooseVersion(byteLen: number) {
	for (let v = 1; v <= 40; v++) {
		const bitsNeeded = 4 + charCountBits(v) + byteLen * 8;
		if (bitsNeeded <= numDataCodewords(v) * 8) return v;
	}
	throw new Error('QR payload too long');
}

function alignmentPositions(version: number) {
	if (version === 1) return [] as number[];
	const numAlign = Math.floor(version / 7) + 2;
	const size = sizeOf(version);
	const step = version === 32 ? 26 : Math.ceil((version * 4 + 4) / (numAlign * 2 - 2)) * 2;
	const result = [6];
	for (let pos = size - 7; result.length < numAlign; pos -= step) result.splice(1, 0, pos);
	return result;
}

// ---------- Reed–Solomon over GF(2^8), polynomial 0x11D ----------

function gfMul(x: number, y: number) {
	let z = 0;
	for (let i = 7; i >= 0; i--) {
		z = (z << 1) ^ ((z >>> 7) * 0x11d);
		z ^= ((y >>> i) & 1) * x;
	}
	return z & 0xff;
}

function rsDivisor(degree: number) {
	const result = new Array<number>(degree).fill(0);
	result[degree - 1] = 1;
	let root = 1;
	for (let i = 0; i < degree; i++) {
		for (let j = 0; j < result.length; j++) {
			result[j] = gfMul(result[j], root);
			if (j + 1 < result.length) result[j] ^= result[j + 1];
		}
		root = gfMul(root, 0x02);
	}
	return result;
}

function rsRemainder(data: number[], divisor: number[]) {
	const result = new Array<number>(divisor.length).fill(0);
	for (const b of data) {
		const factor = b ^ (result.shift() as number);
		result.push(0);
		for (let i = 0; i < divisor.length; i++) result[i] ^= gfMul(divisor[i], factor);
	}
	return result;
}

// ---------- Data segment ----------

function buildCodewords(bytes: number[], version: number) {
	const capacityBits = numDataCodewords(version) * 8;
	const bits: number[] = [];
	const put = (val: number, len: number) => {
		for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
	};
	put(0b0100, 4);
	put(bytes.length, charCountBits(version));
	for (const b of bytes) put(b, 8);
	put(0, Math.min(4, capacityBits - bits.length));
	while (bits.length % 8 !== 0) bits.push(0);
	for (let pad = 0xec; bits.length < capacityBits; pad ^= 0xec ^ 0x11) put(pad, 8);

	const data: number[] = [];
	for (let i = 0; i < bits.length; i += 8) {
		let b = 0;
		for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
		data.push(b);
	}
	return data;
}

function addEccAndInterleave(data: number[], version: number) {
	const numBlocks = NUM_BLOCKS_M[version - 1];
	const eccLen = ECC_PER_BLOCK_M[version - 1];
	const rawCodewords = Math.floor(numRawDataModules(version) / 8);
	const numShortBlocks = numBlocks - (rawCodewords % numBlocks);
	const shortBlockLen = Math.floor(rawCodewords / numBlocks);

	const blocks: number[][] = [];
	const divisor = rsDivisor(eccLen);
	let offset = 0;
	for (let i = 0; i < numBlocks; i++) {
		const len = shortBlockLen - eccLen + (i < numShortBlocks ? 0 : 1);
		const dat = data.slice(offset, offset + len);
		offset += len;
		const ecc = rsRemainder(dat, divisor);
		if (i < numShortBlocks) dat.push(0);
		blocks.push(dat.concat(ecc));
	}

	const result: number[] = [];
	for (let i = 0; i < blocks[0].length; i++) {
		blocks.forEach((block, j) => {
			if (i !== shortBlockLen - eccLen || j >= numShortBlocks) result.push(block[i]);
		});
	}
	return result;
}

// ---------- Matrix drawing ----------

function drawFunctionPatterns(version: number, mod: Matrix, fn: Matrix) {
	const size = mod.length;
	const set = (x: number, y: number, dark: boolean) => {
		mod[y][x] = dark;
		fn[y][x] = true;
	};

	for (let i = 0; i < size; i++) {
		set(6, i, i % 2 === 0);
		set(i, 6, i % 2 === 0);
	}

	const finder = (cx: number, cy: number) => {
		for (let dy = -4; dy <= 4; dy++) {
			for (let dx = -4; dx <= 4; dx++) {
				const dist = Math.max(Math.abs(dx), Math.abs(dy));
				const x = cx + dx;
				const y = cy + dy;
				if (x >= 0 && x < size && y >= 0 && y < size) set(x, y, dist !== 2 && dist !== 4);
			}
		}
	};
	finder(3, 3);
	finder(size - 4, 3);
	finder(3, size - 4);

	const aligns = alignmentPositions(version);
	const last = aligns.length - 1;
	for (let i = 0; i < aligns.length; i++) {
		for (let j = 0; j < aligns.length; j++) {
			if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) continue;
			for (let dy = -2; dy <= 2; dy++) {
				for (let dx = -2; dx <= 2; dx++) {
					set(aligns[i] + dx, aligns[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
				}
			}
		}
	}

	drawFormatBits(0, mod, fn);
	drawVersion(version, mod, fn);
}

function drawFormatBits(mask: number, mod: Matrix, fn: Matrix) {
	const size = mod.length;
	const data = (ECL_M_FORMAT_BITS << 3) | mask;
	let rem = data;
	for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
	const bits = ((data << 10) | rem) ^ 0x5412;
	const bit = (i: number) => ((bits >>> i) & 1) !== 0;
	const set = (x: number, y: number, dark: boolean) => {
		mod[y][x] = dark;
		fn[y][x] = true;
	};

	for (let i = 0; i <= 5; i++) set(8, i, bit(i));
	set(8, 7, bit(6));
	set(8, 8, bit(7));
	set(7, 8, bit(8));
	for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));

	for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i));
	for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i));
	set(8, size - 8, true);
}

function drawVersion(version: number, mod: Matrix, fn: Matrix) {
	if (version < 7) return;
	const size = mod.length;
	let rem = version;
	for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
	const bits = (version << 12) | rem;
	for (let i = 0; i < 18; i++) {
		const dark = ((bits >>> i) & 1) !== 0;
		const a = size - 11 + (i % 3);
		const b = Math.floor(i / 3);
		mod[b][a] = dark;
		fn[b][a] = true;
		mod[a][b] = dark;
		fn[a][b] = true;
	}
}

function drawCodewords(codewords: number[], mod: Matrix, fn: Matrix) {
	const size = mod.length;
	let i = 0;
	const total = codewords.length * 8;
	for (let right = size - 1; right >= 1; right -= 2) {
		if (right === 6) right = 5;
		for (let vert = 0; vert < size; vert++) {
			for (let j = 0; j < 2; j++) {
				const x = right - j;
				const upward = ((right + 1) & 2) === 0;
				const y = upward ? size - 1 - vert : vert;
				if (!fn[y][x] && i < total) {
					mod[y][x] = ((codewords[i >>> 3] >>> (7 - (i & 7))) & 1) !== 0;
					i++;
				}
			}
		}
	}
}

function maskBit(mask: number, x: number, y: number) {
	switch (mask) {
		case 0:
			return (x + y) % 2 === 0;
		case 1:
			return y % 2 === 0;
		case 2:
			return x % 3 === 0;
		case 3:
			return (x + y) % 3 === 0;
		case 4:
			return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
		case 5:
			return ((x * y) % 2) + ((x * y) % 3) === 0;
		case 6:
			return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
		default:
			return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
	}
}

function applyMask(mask: number, mod: Matrix, fn: Matrix) {
	const size = mod.length;
	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			if (!fn[y][x] && maskBit(mask, x, y)) mod[y][x] = !mod[y][x];
		}
	}
}

function penaltyScore(mod: Matrix) {
	const size = mod.length;
	let result = 0;
	let dark = 0;

	for (let y = 0; y < size; y++) {
		let runColor = false;
		let runX = 0;
		for (let x = 0; x < size; x++) {
			if (mod[y][x] === runColor) {
				runX++;
				if (runX === 5) result += 3;
				else if (runX > 5) result++;
			} else {
				runColor = mod[y][x];
				runX = 1;
			}
			if (mod[y][x]) dark++;
		}
	}
	for (let x = 0; x < size; x++) {
		let runColor = false;
		let runY = 0;
		for (let y = 0; y < size; y++) {
			if (mod[y][x] === runColor) {
				runY++;
				if (runY === 5) result += 3;
				else if (runY > 5) result++;
			} else {
				runColor = mod[y][x];
				runY = 1;
			}
		}
	}
	for (let y = 0; y < size - 1; y++) {
		for (let x = 0; x < size - 1; x++) {
			const c = mod[y][x];
			if (c === mod[y][x + 1] && c === mod[y + 1][x] && c === mod[y + 1][x + 1]) result += 3;
		}
	}

	const total = size * size;
	const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
	result += k * 10;
	return result;
}

/** Returns a square boolean matrix (true = dark module). */
export function encodeQR(text: string): Matrix {
	const bytes = Array.from(new TextEncoder().encode(text));
	const version = chooseVersion(bytes.length);
	const size = sizeOf(version);
	const codewords = addEccAndInterleave(buildCodewords(bytes, version), version);

	const mod: Matrix = Array.from({ length: size }, () => Array<boolean>(size).fill(false));
	const fn: Matrix = Array.from({ length: size }, () => Array<boolean>(size).fill(false));
	drawFunctionPatterns(version, mod, fn);
	drawCodewords(codewords, mod, fn);

	let bestMask = 0;
	let bestScore = Number.POSITIVE_INFINITY;
	for (let mask = 0; mask < 8; mask++) {
		applyMask(mask, mod, fn);
		drawFormatBits(mask, mod, fn);
		const score = penaltyScore(mod);
		if (score < bestScore) {
			bestScore = score;
			bestMask = mask;
		}
		applyMask(mask, mod, fn);
	}
	applyMask(bestMask, mod, fn);
	drawFormatBits(bestMask, mod, fn);
	return mod;
}

export function qrToSvgPath(matrix: Matrix, cell = 1): string {
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
export function punchLogoHole(matrix: Matrix, ratio = 0.28): Matrix {
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
