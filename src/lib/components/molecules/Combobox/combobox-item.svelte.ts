import { getComboboxContext } from './combobox-context.js';

export interface ComboboxItemInput {
	value: string;
	label: string;
	disabled: boolean;
	keywords: string[];
	selected: boolean | undefined;
	highlighted: boolean | undefined;
	register: boolean;
	onclick?: () => void;
}

export function createComboboxItemController(getInput: () => ComboboxItemInput) {
	const ctx = getComboboxContext();

	const matchesQuery = $derived.by(() => {
		const input = getInput();
		if (!input.register || !ctx) return true;
		const q = ctx.getQuery().trim().toLowerCase();
		if (!q) return true;
		const blob = [input.label, input.value, ...input.keywords].join(' ').toLowerCase();
		return blob.includes(q);
	});

	const isSelected = $derived.by(() => {
		const input = getInput();
		return input.selected ?? (ctx ? ctx.getValue() === input.value : false);
	});

	const isHighlighted = $derived.by(() => {
		const input = getInput();
		return input.highlighted ?? (ctx ? ctx.getHighlighted() === input.value : false);
	});

	$effect(() => {
		const input = getInput();
		if (!input.register || !ctx || input.disabled || !matchesQuery) return;
		return ctx.register(input.value, input.disabled, input.label);
	});

	function activate() {
		const input = getInput();
		if (input.disabled) return;
		if (input.onclick) {
			input.onclick();
			return;
		}
		ctx?.select(input.value);
	}

	function highlight() {
		const input = getInput();
		if (input.disabled) return;
		ctx?.highlight(input.value);
	}

	return {
		get matchesQuery() {
			return matchesQuery;
		},
		get isSelected() {
			return isSelected;
		},
		get isHighlighted() {
			return isHighlighted;
		},
		activate,
		highlight
	};
}
