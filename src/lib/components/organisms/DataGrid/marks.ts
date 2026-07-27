import type { MarkColor, MarkPreset } from './types.js';

export const MARK_COLORS: MarkPreset[] = [
	'amber',
	'rose',
	'sky',
	'emerald',
	'violet',
	'orange',
	'lime',
	'cyan',
	'fuchsia',
	'slate',
	'pink',
	'indigo'
];

export const MARK_TINT: Record<MarkPreset, string> = {
	amber: 'rgba(245, 158, 11, 0.18)',
	rose: 'rgba(244, 63, 94, 0.16)',
	sky: 'rgba(14, 165, 233, 0.16)',
	emerald: 'rgba(16, 185, 129, 0.16)',
	violet: 'rgba(139, 92, 246, 0.16)',
	orange: 'rgba(249, 115, 22, 0.18)',
	lime: 'rgba(132, 204, 22, 0.18)',
	cyan: 'rgba(6, 182, 212, 0.16)',
	fuchsia: 'rgba(217, 70, 239, 0.16)',
	slate: 'rgba(100, 116, 139, 0.2)',
	pink: 'rgba(236, 72, 153, 0.16)',
	indigo: 'rgba(99, 102, 241, 0.16)'
};

export const MARK_SWATCH: Record<MarkPreset, string> = {
	amber: '#f59e0b',
	rose: '#f43f5e',
	sky: '#0ea5e9',
	emerald: '#10b981',
	violet: '#8b5cf6',
	orange: '#f97316',
	lime: '#84cc16',
	cyan: '#06b6d4',
	fuchsia: '#d946ef',
	slate: '#64748b',
	pink: '#ec4899',
	indigo: '#6366f1'
};

const PRESET_SET = new Set<string>(MARK_COLORS);

export function isMarkPreset(color: string): color is MarkPreset {
	return PRESET_SET.has(color);
}

/** Resolve a mark color (preset name or custom CSS color) to a soft background tint. */
export function markTint(color: MarkColor): string {
	if (isMarkPreset(color)) return MARK_TINT[color];
	const rgb = parseCssColor(color);
	if (!rgb) return color;
	return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.18)`;
}

/** Resolve a mark color to a solid swatch for the picker UI. */
export function markSwatch(color: MarkColor): string {
	if (isMarkPreset(color)) return MARK_SWATCH[color];
	return color;
}

function parseCssColor(input: string): { r: number; g: number; b: number } | null {
	const s = input.trim();
	if (!s) return null;

	if (s.startsWith('#')) {
		const hex = s.slice(1);
		if (hex.length === 3) {
			const r = parseInt(hex[0] + hex[0], 16);
			const g = parseInt(hex[1] + hex[1], 16);
			const b = parseInt(hex[2] + hex[2], 16);
			if ([r, g, b].some((n) => Number.isNaN(n))) return null;
			return { r, g, b };
		}
		if (hex.length === 6 || hex.length === 8) {
			const r = parseInt(hex.slice(0, 2), 16);
			const g = parseInt(hex.slice(2, 4), 16);
			const b = parseInt(hex.slice(4, 6), 16);
			if ([r, g, b].some((n) => Number.isNaN(n))) return null;
			return { r, g, b };
		}
		return null;
	}

	const rgb = s.match(
		/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*[\d.]+\s*)?\)$/i
	);
	if (rgb) {
		return { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]) };
	}

	return null;
}
