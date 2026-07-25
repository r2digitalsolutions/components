/**
 * Line/word diff helpers (no deps). LCS-based for readable patches.
 */

export type DiffOpType = 'equal' | 'insert' | 'delete';

export type DiffOp = {
	type: DiffOpType;
	value: string;
	/** 1-based line number in the "before" text */
	oldLine?: number;
	/** 1-based line number in the "after" text */
	newLine?: number;
};

export type SplitRow = {
	left: { type: 'equal' | 'delete' | 'empty'; text: string; line?: number } | null;
	right: { type: 'equal' | 'insert' | 'empty'; text: string; line?: number } | null;
	/** Word-level parts when both sides are a change pair */
	leftParts?: DiffPart[];
	rightParts?: DiffPart[];
};

export type DiffPart = { text: string; changed: boolean };

export type DiffStats = { additions: number; deletions: number; unchanged: number };

function splitLines(text: string): string[] {
	if (text === '') return [];
	// Preserve trailing newline as empty trailing line only if present meaningfully
	const lines = text.split('\n');
	if (text.endsWith('\n')) lines.pop();
	return lines;
}

/** Classic LCS length table for string arrays. */
function lcsTable(a: string[], b: string[]): number[][] {
	const n = a.length;
	const m = b.length;
	const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
	for (let i = n - 1; i >= 0; i--) {
		for (let j = m - 1; j >= 0; j--) {
			dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
		}
	}
	return dp;
}

/** Line-level diff via LCS backtrack. */
export function diffLines(before: string, after: string): DiffOp[] {
	const a = splitLines(before);
	const b = splitLines(after);
	const dp = lcsTable(a, b);
	const ops: DiffOp[] = [];
	let i = 0;
	let j = 0;
	let oldLine = 1;
	let newLine = 1;

	while (i < a.length && j < b.length) {
		if (a[i] === b[j]) {
			ops.push({ type: 'equal', value: a[i], oldLine, newLine });
			i += 1;
			j += 1;
			oldLine += 1;
			newLine += 1;
		} else if (dp[i + 1][j] >= dp[i][j + 1]) {
			ops.push({ type: 'delete', value: a[i], oldLine });
			i += 1;
			oldLine += 1;
		} else {
			ops.push({ type: 'insert', value: b[j], newLine });
			j += 1;
			newLine += 1;
		}
	}
	while (i < a.length) {
		ops.push({ type: 'delete', value: a[i], oldLine });
		i += 1;
		oldLine += 1;
	}
	while (j < b.length) {
		ops.push({ type: 'insert', value: b[j], newLine });
		j += 1;
		newLine += 1;
	}
	return ops;
}

/** Tokenize for inline word diff (keeps whitespace as tokens). */
function tokenize(s: string): string[] {
	return s.match(/(\s+|[^\s]+)/g) ?? [s];
}

/** Word-level parts highlighting differences between two strings. */
export function diffWords(before: string, after: string): { left: DiffPart[]; right: DiffPart[] } {
	const a = tokenize(before);
	const b = tokenize(after);
	const dp = lcsTable(a, b);
	const left: DiffPart[] = [];
	const right: DiffPart[] = [];
	let i = 0;
	let j = 0;

	while (i < a.length && j < b.length) {
		if (a[i] === b[j]) {
			left.push({ text: a[i], changed: false });
			right.push({ text: b[j], changed: false });
			i += 1;
			j += 1;
		} else if (dp[i + 1][j] >= dp[i][j + 1]) {
			left.push({ text: a[i], changed: true });
			i += 1;
		} else {
			right.push({ text: b[j], changed: true });
			j += 1;
		}
	}
	while (i < a.length) {
		left.push({ text: a[i], changed: true });
		i += 1;
	}
	while (j < b.length) {
		right.push({ text: b[j], changed: true });
		j += 1;
	}
	return { left, right };
}

export function diffStats(ops: DiffOp[]): DiffStats {
	let additions = 0;
	let deletions = 0;
	let unchanged = 0;
	for (const op of ops) {
		if (op.type === 'insert') additions += 1;
		else if (op.type === 'delete') deletions += 1;
		else unchanged += 1;
	}
	return { additions, deletions, unchanged };
}

/**
 * Build side-by-side rows. Consecutive delete+insert pairs become a single
 * modification row with optional word highlighting.
 */
export function toSplitRows(ops: DiffOp[], wordDiff = true): SplitRow[] {
	const rows: SplitRow[] = [];
	let i = 0;
	while (i < ops.length) {
		const op = ops[i];
		if (op.type === 'equal') {
			rows.push({
				left: { type: 'equal', text: op.value, line: op.oldLine },
				right: { type: 'equal', text: op.value, line: op.newLine }
			});
			i += 1;
			continue;
		}

		// Gather consecutive deletes then inserts (or mix) into paired rows
		const deletes: DiffOp[] = [];
		const inserts: DiffOp[] = [];
		while (i < ops.length && ops[i].type === 'delete') {
			deletes.push(ops[i]);
			i += 1;
		}
		while (i < ops.length && ops[i].type === 'insert') {
			inserts.push(ops[i]);
			i += 1;
		}

		const n = Math.max(deletes.length, inserts.length);
		for (let k = 0; k < n; k++) {
			const d = deletes[k];
			const ins = inserts[k];
			if (d && ins && wordDiff) {
				const parts = diffWords(d.value, ins.value);
				rows.push({
					left: { type: 'delete', text: d.value, line: d.oldLine },
					right: { type: 'insert', text: ins.value, line: ins.newLine },
					leftParts: parts.left,
					rightParts: parts.right
				});
			} else {
				rows.push({
					left: d
						? { type: 'delete', text: d.value, line: d.oldLine }
						: { type: 'empty', text: '' },
					right: ins
						? { type: 'insert', text: ins.value, line: ins.newLine }
						: { type: 'empty', text: '' }
				});
			}
		}
	}
	return rows;
}
