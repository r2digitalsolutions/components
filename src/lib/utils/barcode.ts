/**
 * Standards-compliant 1D barcode encoder (Code 128, EAN-13, EAN-8, UPC-A).
 * Generates module runs suitable for SVG rendering. No external deps.
 */

export type BarcodeSymbology = 'code128' | 'ean13' | 'ean8' | 'upc_a';

export type BarcodeRun = { x: number; w: number; black: boolean };

export type EncodedBarcode = {
	format: BarcodeSymbology;
	text: string;
	runs: BarcodeRun[];
	modules: number;
};

const QUIET = 10;

/** Code 128 patterns 0–106 (11 modules). Stop is 106 + terminal bar `11`. */
const CODE128 = [
	'11011001100',
	'11001101100',
	'11001100110',
	'10010011000',
	'10010001100',
	'10001001100',
	'10011001000',
	'10011000100',
	'10001100100',
	'11001001000',
	'11001000100',
	'11000100100',
	'10110011100',
	'10011011100',
	'10011001110',
	'10111001100',
	'10011101100',
	'10011100110',
	'11001110010',
	'11001011100',
	'11001001110',
	'11011100100',
	'11001110100',
	'11101101110',
	'11101001100',
	'11100101100',
	'11100100110',
	'11101100100',
	'11100110100',
	'11100110010',
	'11011011000',
	'11011000110',
	'11000110110',
	'10100011000',
	'10001011000',
	'10001000110',
	'10110001000',
	'10001101000',
	'10001100010',
	'11010001000',
	'11000101000',
	'11000100010',
	'10110111000',
	'10110001110',
	'10001101110',
	'10111011000',
	'10111000110',
	'10001110110',
	'11101110110',
	'11010001110',
	'11000101110',
	'11011101000',
	'11011100010',
	'11011101110',
	'11101011000',
	'11101000110',
	'11100010110',
	'11101101000',
	'11101100010',
	'11100011010',
	'11101111010',
	'11001000010',
	'11110001010',
	'10100110000',
	'10100001100',
	'10010110000',
	'10010000110',
	'10000101100',
	'10000100110',
	'10110010000',
	'10110000100',
	'10011010000',
	'10011000010',
	'10000110100',
	'10000110010',
	'11000010010',
	'11001010000',
	'11110111010',
	'11000010100',
	'10001111010',
	'10100111100',
	'10010111100',
	'10010011110',
	'10111100100',
	'10011110100',
	'10011110010',
	'11110100100',
	'11110010100',
	'11110010010',
	'11011011110',
	'11011110110',
	'11110110110',
	'10101111000',
	'10100011110',
	'10001011110',
	'10111101000',
	'10111100010',
	'11110101000',
	'11110100010',
	'10111011110',
	'10111101110',
	'11101011110',
	'11110101110',
	'11010000100',
	'11010010000',
	'11010011100',
	'11000111010'
];

const EAN_L = [
	'0001101',
	'0011001',
	'0010011',
	'0111101',
	'0100011',
	'0110001',
	'0101111',
	'0111011',
	'0110111',
	'0001011'
];

const EAN_G = [
	'0100111',
	'0110011',
	'0011011',
	'0100001',
	'0011101',
	'0111001',
	'0000101',
	'0010001',
	'0001001',
	'0010111'
];

const EAN_R = [
	'1110010',
	'1100110',
	'1101100',
	'1000010',
	'1011100',
	'1001110',
	'1010000',
	'1000100',
	'1001000',
	'1110100'
];

/** First-digit parity for the left half of EAN-13 (L/G). */
const EAN13_PARITY = [
	'LLLLLL',
	'LLGLGG',
	'LLGGLG',
	'LLGGGL',
	'LGLLGG',
	'LGGLLG',
	'LGGGLL',
	'LGLGLG',
	'LGLGGL',
	'LGGLGL'
];

function bitsToRuns(bits: string): BarcodeRun[] {
	const runs: BarcodeRun[] = [];
	for (const ch of bits) {
		const black = ch === '1';
		const last = runs.at(-1);
		if (last && last.black === black) last.w += 1;
		else runs.push({ x: last ? last.x + last.w : 0, w: 1, black });
	}
	return runs;
}

function withQuiet(bits: string, left = QUIET, right = QUIET): string {
	return `${'0'.repeat(left)}${bits}${'0'.repeat(right)}`;
}

function encoded(format: BarcodeSymbology, text: string, bits: string): EncodedBarcode {
	const padded = withQuiet(bits);
	return { format, text, runs: bitsToRuns(padded), modules: padded.length };
}

/** GS1 check digit for a payload without the check (odd positions from the right × 3). */
export function gs1CheckDigit(payload: string): number {
	let sum = 0;
	for (let i = 0; i < payload.length; i++) {
		const n = Number(payload[payload.length - 1 - i]);
		sum += n * (i % 2 === 0 ? 3 : 1);
	}
	return (10 - (sum % 10)) % 10;
}

export function isValidGs1(digits: string): boolean {
	if (!/^\d{8}$|^\d{12}$|^\d{13}$/.test(digits)) return false;
	return gs1CheckDigit(digits.slice(0, -1)) === Number(digits.at(-1));
}

function encodeCode128(text: string): EncodedBarcode | null {
	if (!text) return null;
	const codes: number[] = [104];
	for (const ch of text) {
		const code = ch.charCodeAt(0) - 32;
		if (code < 0 || code > 94) return null;
		codes.push(code);
	}

	let sum = codes[0];
	for (let i = 1; i < codes.length; i++) sum += codes[i] * i;
	codes.push(sum % 103);

	let bits = '';
	for (const code of codes) bits += CODE128[code];
	bits += `${CODE128[106]}11`;
	return encoded('code128', text, bits);
}

function encodeEan13(digits: string): EncodedBarcode | null {
	if (!/^\d{13}$/.test(digits) || !isValidGs1(digits)) return null;
	const first = Number(digits[0]);
	const parity = EAN13_PARITY[first];
	let bits = '101';
	for (let i = 0; i < 6; i++) {
		const d = Number(digits[i + 1]);
		bits += parity[i] === 'G' ? EAN_G[d] : EAN_L[d];
	}
	bits += '01010';
	for (let i = 7; i < 13; i++) bits += EAN_R[Number(digits[i])];
	bits += '101';
	return encoded('ean13', digits, bits);
}

function encodeEan8(digits: string): EncodedBarcode | null {
	if (!/^\d{8}$/.test(digits) || !isValidGs1(digits)) return null;
	let bits = '101';
	for (let i = 0; i < 4; i++) bits += EAN_L[Number(digits[i])];
	bits += '01010';
	for (let i = 4; i < 8; i++) bits += EAN_R[Number(digits[i])];
	bits += '101';
	return encoded('ean8', digits, bits);
}

function encodeUpcA(digits: string): EncodedBarcode | null {
	if (!/^\d{12}$/.test(digits) || !isValidGs1(digits)) return null;
	const ean = encodeEan13(`0${digits}`);
	if (!ean) return null;
	return { ...ean, format: 'upc_a', text: digits };
}

export function encodeBarcode(
	value: string,
	format: 'auto' | BarcodeSymbology = 'auto'
): EncodedBarcode | null {
	const text = value.trim();
	if (!text) return null;

	if (format === 'code128') return encodeCode128(text);
	if (format === 'ean13') return encodeEan13(text);
	if (format === 'ean8') return encodeEan8(text);
	if (format === 'upc_a') return encodeUpcA(text);

	if (/^\d{13}$/.test(text) && isValidGs1(text)) return encodeEan13(text);
	if (/^\d{12}$/.test(text) && isValidGs1(text)) return encodeUpcA(text);
	if (/^\d{8}$/.test(text) && isValidGs1(text)) return encodeEan8(text);
	return encodeCode128(text);
}
