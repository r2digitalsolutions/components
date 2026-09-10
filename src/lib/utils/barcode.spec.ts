import { describe, expect, it } from 'vitest';
import { encodeBarcode, gs1CheckDigit, isValidGs1 } from './barcode.js';

describe('gs1CheckDigit', () => {
	it('computes the Nivea EAN-13 check digit', () => {
		expect(gs1CheckDigit('400638133393')).toBe(1);
		expect(isValidGs1('4006381333931')).toBe(true);
	});

	it('rejects a tampered EAN-13', () => {
		expect(isValidGs1('4006381333932')).toBe(false);
	});
});

describe('encodeBarcode', () => {
	it('encodes Code 128 with Start B, checksum and stop', () => {
		const encoded = encodeBarcode('ABC');
		expect(encoded?.format).toBe('code128');
		expect(encoded?.text).toBe('ABC');

		const bits = encoded!.runs.map((run) => (run.black ? '1' : '0').repeat(run.w)).join('');
		expect(bits.startsWith('0'.repeat(10))).toBe(true);
		expect(bits.endsWith('0'.repeat(10))).toBe(true);

		const body = bits.slice(10, -10);
		expect(body.startsWith('11010010000')).toBe(true);
		expect(body.endsWith('1100011101011')).toBe(true);

		// Start B (104) + A(33) + B(34) + C(35) → checksum 1
		const startA = '11010010000';
		const charA = '10100011000';
		const charB = '10001011000';
		const charC = '10001000110';
		const check1 = '11001101100';
		const stop = '1100011101011';
		expect(body).toBe(`${startA}${charA}${charB}${charC}${check1}${stop}`);
	});

	it('encodes a valid EAN-13', () => {
		const encoded = encodeBarcode('4006381333931');
		expect(encoded?.format).toBe('ean13');
		expect(encoded?.modules).toBe(10 + 95 + 10);
	});

	it('falls back to Code 128 for a 13-digit string with a bad checksum', () => {
		const encoded = encodeBarcode('4006381333932');
		expect(encoded?.format).toBe('code128');
	});

	it('encodes SKU-style references as Code 128', () => {
		const encoded = encodeBarcode('DEMO-SKU-001');
		expect(encoded?.format).toBe('code128');
		expect(encoded?.text).toBe('DEMO-SKU-001');
	});

	it('returns null for empty or non-latin-1 SKUs', () => {
		expect(encodeBarcode('')).toBeNull();
		expect(encodeBarcode('café')).toBeNull();
	});
});
