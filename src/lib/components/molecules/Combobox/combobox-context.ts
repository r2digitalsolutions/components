import { getContext, setContext } from 'svelte';

export const COMBOBOX_CONTEXT = Symbol('r2-combobox');

export const COMBOBOX_CREATE_KEY = '__create__';

export interface ComboboxContext {
	getValue: () => string;
	getQuery: () => string;
	getHighlighted: () => string | null;
	select: (value: string) => void;
	highlight: (value: string) => void;
	register: (value: string, disabled: boolean, label?: string) => () => void;
}

export function setComboboxContext(ctx: ComboboxContext): ComboboxContext {
	setContext(COMBOBOX_CONTEXT, ctx);
	return ctx;
}

export function getComboboxContext(): ComboboxContext | null {
	return getContext<ComboboxContext | undefined>(COMBOBOX_CONTEXT) ?? null;
}
