import {
	formatMessage,
	getDictionary,
	type MessageParams,
	type UiMessages
} from './i18n.js';
import type { FormDataValues, FormErrors } from './formContext.js';

export type BuiltinRule =
	| 'required'
	| 'email'
	| 'url'
	| `minLength:${number}`
	| `maxLength:${number}`
	| `min:${number}`
	| `max:${number}`;

export type CustomRule<T extends FormDataValues> = (
	value: unknown,
	data: T
) => string | undefined | null | false;

export type PatternRule = {
	pattern: RegExp;
	message?: string;
};

export type FieldRule<T extends FormDataValues = FormDataValues> =
	| BuiltinRule
	| PatternRule
	| CustomRule<T>;

export type FormRules<T extends FormDataValues = FormDataValues> = {
	[K in keyof T]?: FieldRule<T> | FieldRule<T>[];
};

export interface ValidateOptions {
	/** Locale for built-in messages (`es`, `en`, …) */
	locale?: string;
	/** Override validation copy */
	messages?: Partial<UiMessages>;
	/** Translate helper (e.g. `i18n.t`) */
	t?: (key: keyof UiMessages, params?: MessageParams) => string;
}

function isEmpty(value: unknown): boolean {
	if (value === null || value === undefined) return true;
	if (typeof value === 'string') return value.trim().length === 0;
	if (Array.isArray(value)) return value.length === 0;
	if (typeof value === 'boolean') return false;
	return false;
}

function msg(
	options: ValidateOptions | undefined,
	key: keyof UiMessages,
	params?: MessageParams
): string {
	if (options?.t) return options.t(key, params);
	const dict = getDictionary(options?.locale ?? 'en', options?.messages);
	return formatMessage(dict[key], params);
}

function runBuiltin<T extends FormDataValues>(
	rule: BuiltinRule,
	value: unknown,
	options?: ValidateOptions
): string | undefined {
	if (rule === 'required') {
		return isEmpty(value) ? msg(options, 'fieldRequired') : undefined;
	}

	if (isEmpty(value)) return undefined;

	const str = String(value);

	if (rule === 'email') {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)
			? undefined
			: msg(options, 'invalidEmail');
	}

	if (rule === 'url') {
		try {
			new URL(str);
			return undefined;
		} catch {
			return msg(options, 'invalidUrl');
		}
	}

	if (rule.startsWith('minLength:')) {
		const min = Number(rule.slice('minLength:'.length));
		return str.length >= min ? undefined : msg(options, 'minLength', { min });
	}

	if (rule.startsWith('maxLength:')) {
		const max = Number(rule.slice('maxLength:'.length));
		return str.length <= max ? undefined : msg(options, 'maxLength', { max });
	}

	if (rule.startsWith('min:')) {
		const min = Number(rule.slice('min:'.length));
		const n = Number(value);
		return !Number.isNaN(n) && n >= min ? undefined : msg(options, 'minValue', { min });
	}

	if (rule.startsWith('max:')) {
		const max = Number(rule.slice('max:'.length));
		const n = Number(value);
		return !Number.isNaN(n) && n <= max ? undefined : msg(options, 'maxValue', { max });
	}

	return undefined;
}

function runRule<T extends FormDataValues>(
	rule: FieldRule<T>,
	value: unknown,
	data: T,
	options?: ValidateOptions
): string | undefined {
	if (typeof rule === 'string') {
		return runBuiltin(rule, value, options);
	}
	if (typeof rule === 'function') {
		return rule(value, data) || undefined;
	}
	if (rule && typeof rule === 'object' && 'pattern' in rule) {
		if (isEmpty(value)) return undefined;
		return rule.pattern.test(String(value))
			? undefined
			: (rule.message ?? msg(options, 'patternMismatch'));
	}
	return undefined;
}

/**
 * Declarative validation → `FormErrors` for `<Form bind:errors>`.
 *
 * @example
 * ```ts
 * errors = validateForm(data, {
 *   email: ['required', 'email'],
 *   password: ['required', 'minLength:8'],
 *   age: ['min:18']
 * }, { locale: 'es' });
 * ```
 */
export function validateForm<T extends FormDataValues>(
	data: T,
	rules: FormRules<T>,
	options?: ValidateOptions
): FormErrors {
	const errors: FormErrors = {};

	for (const key of Object.keys(rules) as Array<keyof T & string>) {
		const fieldRules = rules[key];
		if (!fieldRules) continue;
		const list = Array.isArray(fieldRules) ? fieldRules : [fieldRules];
		const value = data[key];

		for (const rule of list) {
			const message = runRule(rule, value, data, options);
			if (message) {
				errors[key] = message;
				break;
			}
		}
	}

	return errors;
}

/** True when `current` differs from `initial` (shallow JSON compare). */
export function isFormDirty<T>(current: T, initial: T): boolean {
	return JSON.stringify(current) !== JSON.stringify(initial);
}

/** First error message, or `undefined` when valid. */
export function firstFormError(errors: FormErrors): string | undefined {
	return Object.values(errors).find(Boolean);
}
