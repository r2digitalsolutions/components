/**
 * Theme store — light/dark + gray palette for R2DigiSolutions components.
 *
 * Mode: `class="dark"` on `<html>`
 * Palette: `data-theme="slate" | "neutral"` on `<html>`
 *
 * - Persists preference to localStorage
 * - Detects system preference via prefers-color-scheme
 * - Reactive via Svelte 5 runes ($state)
 */

export type Theme = 'light' | 'dark' | 'system';
export type ThemePalette = 'slate' | 'neutral';

const STORAGE_KEY = 'r2-theme';
const PALETTE_KEY = 'r2-theme-palette';
const DEFAULT_PALETTE: ThemePalette = 'slate';

function getSystemTheme(): 'light' | 'dark' {
	if (typeof window === 'undefined') return 'light';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): Theme {
	if (typeof localStorage === 'undefined') return 'system';
	return (localStorage.getItem(STORAGE_KEY) as Theme) ?? 'system';
}

function isPalette(value: string | null): value is ThemePalette {
	return value === 'slate' || value === 'neutral';
}

function getStoredPalette(): ThemePalette {
	if (typeof localStorage === 'undefined') return DEFAULT_PALETTE;
	const stored = localStorage.getItem(PALETTE_KEY);
	if (isPalette(stored)) return stored;
	if (typeof document !== 'undefined') {
		const attr = document.documentElement.getAttribute('data-theme');
		if (isPalette(attr)) return attr;
	}
	return DEFAULT_PALETTE;
}

function applyMode(theme: Theme) {
	if (typeof document === 'undefined') return;
	const resolved = theme === 'system' ? getSystemTheme() : theme;
	document.documentElement.classList.toggle('dark', resolved === 'dark');
}

function applyPalette(palette: ThemePalette) {
	if (typeof document === 'undefined') return;
	document.documentElement.setAttribute('data-theme', palette);
}

class ThemeStore {
	#theme = $state<Theme>('system');
	#palette = $state<ThemePalette>(DEFAULT_PALETTE);
	#resolved = $derived(this.#theme === 'system' ? getSystemTheme() : this.#theme);

	constructor() {
		if (typeof window !== 'undefined') {
			this.#theme = getStoredTheme();
			this.#palette = getStoredPalette();
			applyMode(this.#theme);
			applyPalette(this.#palette);

			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
				if (this.#theme === 'system') {
					applyMode('system');
				}
			});
		}
	}

	get theme(): Theme {
		return this.#theme;
	}

	get palette(): ThemePalette {
		return this.#palette;
	}

	get resolved(): 'light' | 'dark' {
		return this.#resolved;
	}

	get isDark(): boolean {
		return this.#resolved === 'dark';
	}

	set(theme: Theme) {
		this.#theme = theme;
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, theme);
		}
		applyMode(theme);
	}

	/**
	 * Gray family for surfaces, borders and body text.
	 * `slate` = cool (hue 265). `neutral` = chroma 0, no blue cast.
	 *
	 * Pass `{ persist: false }` for a page-level override that does not
	 * stick in localStorage.
	 */
	setPalette(palette: ThemePalette, opts?: { persist?: boolean }) {
		this.#palette = palette;
		if (opts?.persist !== false && typeof localStorage !== 'undefined') {
			localStorage.setItem(PALETTE_KEY, palette);
		}
		applyPalette(palette);
	}

	toggle() {
		this.set(this.isDark ? 'light' : 'dark');
	}
}

export const themeStore = new ThemeStore();
