/**
 * i18n store — locale + UI/form/validation strings for R2DigiSolutions components.
 *
 * - Singleton: `import { i18n } from '@r2digisolutions/components'`
 * - Reactive via Svelte 5 runes (`$state` / `$derived`)
 * - Persists locale to localStorage
 *
 * @example
 * ```ts
 * i18n.set('es');
 * i18n.t('save'); // → "Guardar"
 * i18n.t('minLength', { min: 8 });
 * ```
 */

import {
	UI_DICTIONARIES,
	formatMessage,
	getDictionary,
	resolveLocaleTag,
	type LocaleCode,
	type MessageKey,
	type MessageParams,
	type UiMessages
} from './i18n.js';

export type { LocaleCode, MessageKey, MessageParams, UiMessages };

const STORAGE_KEY = 'r2-locale';

function canUseLocalStorage(): boolean {
	try {
		return (
			typeof localStorage !== 'undefined' &&
			typeof localStorage.getItem === 'function' &&
			typeof localStorage.setItem === 'function'
		);
	} catch {
		// Node / locked-down environments may throw on access
		return false;
	}
}

function getStoredLocale(): LocaleCode {
	if (!canUseLocalStorage()) return 'en';
	return (localStorage.getItem(STORAGE_KEY) as LocaleCode) ?? 'en';
}

function applyDocumentLang(locale: LocaleCode) {
	if (typeof document === 'undefined') return;
	document.documentElement.lang = resolveLocaleTag(locale);
}

class I18nStore {
	#locale = $state<LocaleCode>('en');
	#overrides = $state<Partial<UiMessages>>({});
	#messages = $derived(getDictionary(this.#locale, this.#overrides));

	constructor() {
		if (typeof window !== 'undefined') {
			this.#locale = getStoredLocale();
			applyDocumentLang(this.#locale);
		}
	}

	get locale(): LocaleCode {
		return this.#locale;
	}

	/** Active dictionary (built-in + overrides). */
	get messages(): UiMessages {
		return this.#messages;
	}

	/** Available built-in language tags. */
	get locales(): string[] {
		return Object.keys(UI_DICTIONARIES);
	}

	/** Translate a built-in UI / validation key. */
	t(key: MessageKey, params?: MessageParams): string {
		return formatMessage(this.#messages[key], params);
	}

	/** Change active locale (`es`, `en-US`, …). */
	set(locale: LocaleCode) {
		this.#locale = locale;
		if (canUseLocalStorage()) {
			localStorage.setItem(STORAGE_KEY, locale);
		}
		applyDocumentLang(locale);
	}

	/** Merge message overrides on top of the active dictionary. */
	extend(messages: Partial<UiMessages>) {
		this.#overrides = { ...this.#overrides, ...messages };
	}

	/** Replace all overrides. */
	setOverrides(messages: Partial<UiMessages> = {}) {
		this.#overrides = { ...messages };
	}

	/** One-shot setup (locale + optional overrides). */
	configure(options: { locale?: LocaleCode; messages?: Partial<UiMessages> }) {
		if (options.messages) this.setOverrides(options.messages);
		if (options.locale) this.set(options.locale);
	}
}

export const i18n = new I18nStore();
