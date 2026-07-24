/**
 * Theme store — Light/Dark mode management for R2DigiSolutions components.
 *
 * - Persists preference to localStorage
 * - Detects system preference via prefers-color-scheme
 * - Applies 'dark' class to <html> element
 * - Reactive via Svelte 5 runes ($state)
 */

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'r2-theme';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): Theme {
  if (typeof localStorage === 'undefined') return 'system';
  return (localStorage.getItem(STORAGE_KEY) as Theme) ?? 'system';
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

class ThemeStore {
  #theme = $state<Theme>('system');
  #resolved = $derived(this.#theme === 'system' ? getSystemTheme() : this.#theme);

  constructor() {
    if (typeof window !== 'undefined') {
      this.#theme = getStoredTheme();
      applyTheme(this.#theme);

      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.#theme === 'system') {
          applyTheme('system');
        }
      });
    }
  }

  get theme(): Theme {
    return this.#theme;
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
    applyTheme(theme);
  }

  toggle() {
    this.set(this.isDark ? 'light' : 'dark');
  }
}

export const themeStore = new ThemeStore();
