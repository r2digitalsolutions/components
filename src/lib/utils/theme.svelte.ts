/**
 * Theme store — light/dark + gray palette for R2DigiSolutions components.
 *
 * Mode: `class="dark"` on `<html>`
 * Palette: `data-theme="slate" | "neutral"` on `<html>`
 *
 * Persists to cookies (readable by the FOUC script in `app.html` and by SSR).
 */

export type Theme = 'light' | 'dark' | 'system';
export type ThemePalette = 'slate' | 'neutral';

const THEME_COOKIE = 'r2-theme';
const PALETTE_COOKIE = 'r2-theme-palette';
const LEGACY_THEME_KEY = 'r2-theme';
const LEGACY_PALETTE_KEY = 'r2-theme-palette';
const DEFAULT_PALETTE: ThemePalette = 'slate';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getSystemTheme(): 'light' | 'dark' {
	if (typeof window === 'undefined') return 'light';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function isTheme(value: string | null | undefined): value is Theme {
	return value === 'light' || value === 'dark' || value === 'system';
}

function isPalette(value: string | null | undefined): value is ThemePalette {
	return value === 'slate' || value === 'neutral';
}

function readCookie(name: string): string | null {
	if (typeof document === 'undefined') return null;
	const escaped = name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1');
	const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
	return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string) {
	if (typeof document === 'undefined') return;
	document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;
}

function readLegacyStorage(key: string): string | null {
	if (typeof localStorage?.getItem !== 'function') return null;
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

function getStoredTheme(): Theme {
	const fromCookie = readCookie(THEME_COOKIE);
	if (isTheme(fromCookie)) return fromCookie;
	const legacy = readLegacyStorage(LEGACY_THEME_KEY);
	if (isTheme(legacy)) {
		writeCookie(THEME_COOKIE, legacy);
		return legacy;
	}
	return 'system';
}

function getStoredPalette(): ThemePalette {
	const fromCookie = readCookie(PALETTE_COOKIE);
	if (isPalette(fromCookie)) return fromCookie;
	const legacy = readLegacyStorage(LEGACY_PALETTE_KEY);
	if (isPalette(legacy)) {
		writeCookie(PALETTE_COOKIE, legacy);
		return legacy;
	}
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
		if (typeof window === 'undefined') return;
		this.#theme = getStoredTheme();
		this.#palette = getStoredPalette();
		applyMode(this.#theme);
		applyPalette(this.#palette);

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
			if (this.#theme === 'system') applyMode('system');
		});
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
		writeCookie(THEME_COOKIE, theme);
		applyMode(theme);
	}

	/**
	 * Gray family for surfaces, borders and body text.
	 * `slate` = cool (hue 265). `neutral` = chroma 0, no blue cast.
	 *
	 * Pass `{ persist: false }` for a page-level override that does not
	 * write the cookie.
	 */
	setPalette(palette: ThemePalette, opts?: { persist?: boolean }) {
		this.#palette = palette;
		if (opts?.persist !== false) writeCookie(PALETTE_COOKIE, palette);
		applyPalette(palette);
	}

	toggle() {
		this.set(this.isDark ? 'light' : 'dark');
	}
}

export const themeStore = new ThemeStore();
