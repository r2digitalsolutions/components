export type LocaleCode = 'en' | 'es' | 'pt' | 'fr' | 'de' | (string & {});

/** Built-in UI / form / validation strings. Apps can merge overrides. */
export interface UiMessages {
	save: string;
	cancel: string;
	delete: string;
	reset: string;
	submit: string;
	close: string;
	optional: string;
	required: string;
	loading: string;
	errorSummary: string;
	addItem: string;
	removeItem: string;
	noItems: string;
	/** Validation */
	fieldRequired: string;
	invalidEmail: string;
	invalidUrl: string;
	minLength: string;
	maxLength: string;
	minValue: string;
	maxValue: string;
	patternMismatch: string;
}

export type MessageKey = keyof UiMessages;

export type MessageParams = Record<string, string | number>;

const en: UiMessages = {
	save: 'Save',
	cancel: 'Cancel',
	delete: 'Delete',
	reset: 'Reset',
	submit: 'Submit',
	close: 'Close',
	optional: 'Optional',
	required: 'Required',
	loading: 'Loading…',
	errorSummary: 'Please fix the following',
	addItem: 'Add item',
	removeItem: 'Remove item',
	noItems: 'No items yet',
	fieldRequired: 'This field is required',
	invalidEmail: 'Enter a valid email address',
	invalidUrl: 'Enter a valid URL',
	minLength: 'Use at least {min} characters',
	maxLength: 'Use at most {max} characters',
	minValue: 'Must be at least {min}',
	maxValue: 'Must be at most {max}',
	patternMismatch: 'Invalid format'
};

const es: UiMessages = {
	save: 'Guardar',
	cancel: 'Cancelar',
	delete: 'Eliminar',
	reset: 'Restablecer',
	submit: 'Enviar',
	close: 'Cerrar',
	optional: 'Opcional',
	required: 'Obligatorio',
	loading: 'Cargando…',
	errorSummary: 'Corrige lo siguiente',
	addItem: 'Añadir elemento',
	removeItem: 'Eliminar elemento',
	noItems: 'Sin elementos todavía',
	fieldRequired: 'Este campo es obligatorio',
	invalidEmail: 'Introduce un email válido',
	invalidUrl: 'Introduce una URL válida',
	minLength: 'Usa al menos {min} caracteres',
	maxLength: 'Usa como máximo {max} caracteres',
	minValue: 'Debe ser al menos {min}',
	maxValue: 'Debe ser como máximo {max}',
	patternMismatch: 'Formato no válido'
};

const pt: UiMessages = {
	save: 'Guardar',
	cancel: 'Cancelar',
	delete: 'Eliminar',
	reset: 'Repor',
	submit: 'Enviar',
	close: 'Fechar',
	optional: 'Opcional',
	required: 'Obrigatório',
	loading: 'A carregar…',
	errorSummary: 'Corrija o seguinte',
	addItem: 'Adicionar item',
	removeItem: 'Remover item',
	noItems: 'Ainda sem itens',
	fieldRequired: 'Este campo é obrigatório',
	invalidEmail: 'Introduza um email válido',
	invalidUrl: 'Introduza um URL válido',
	minLength: 'Use pelo menos {min} caracteres',
	maxLength: 'Use no máximo {max} caracteres',
	minValue: 'Deve ser pelo menos {min}',
	maxValue: 'Deve ser no máximo {max}',
	patternMismatch: 'Formato inválido'
};

const fr: UiMessages = {
	save: 'Enregistrer',
	cancel: 'Annuler',
	delete: 'Supprimer',
	reset: 'Réinitialiser',
	submit: 'Envoyer',
	close: 'Fermer',
	optional: 'Facultatif',
	required: 'Obligatoire',
	loading: 'Chargement…',
	errorSummary: 'Veuillez corriger ce qui suit',
	addItem: 'Ajouter un élément',
	removeItem: 'Supprimer l’élément',
	noItems: 'Aucun élément pour l’instant',
	fieldRequired: 'Ce champ est obligatoire',
	invalidEmail: 'Saisissez une adresse e-mail valide',
	invalidUrl: 'Saisissez une URL valide',
	minLength: 'Utilisez au moins {min} caractères',
	maxLength: 'Utilisez au plus {max} caractères',
	minValue: 'Doit être au moins {min}',
	maxValue: 'Doit être au plus {max}',
	patternMismatch: 'Format non valide'
};

const de: UiMessages = {
	save: 'Speichern',
	cancel: 'Abbrechen',
	delete: 'Löschen',
	reset: 'Zurücksetzen',
	submit: 'Senden',
	close: 'Schließen',
	optional: 'Optional',
	required: 'Pflichtfeld',
	loading: 'Wird geladen…',
	errorSummary: 'Bitte korrigieren Sie Folgendes',
	addItem: 'Element hinzufügen',
	removeItem: 'Element entfernen',
	noItems: 'Noch keine Elemente',
	fieldRequired: 'Dieses Feld ist erforderlich',
	invalidEmail: 'Geben Sie eine gültige E-Mail-Adresse ein',
	invalidUrl: 'Geben Sie eine gültige URL ein',
	minLength: 'Mindestens {min} Zeichen verwenden',
	maxLength: 'Höchstens {max} Zeichen verwenden',
	minValue: 'Muss mindestens {min} sein',
	maxValue: 'Darf höchstens {max} sein',
	patternMismatch: 'Ungültiges Format'
};

/** Built-in dictionaries keyed by primary language subtag (`es-MX` → `es`). */
export const UI_DICTIONARIES: Record<string, UiMessages> = {
	en,
	es,
	pt,
	fr,
	de
};

export function resolveLocaleTag(locale: string): string {
	const base = locale.toLowerCase().split('-')[0] ?? 'en';
	return UI_DICTIONARIES[base] ? base : UI_DICTIONARIES[locale] ? locale : 'en';
}

export function getDictionary(
	locale: string,
	overrides?: Partial<UiMessages>
): UiMessages {
	const tag = resolveLocaleTag(locale);
	return { ...UI_DICTIONARIES[tag]!, ...overrides };
}

/** Interpolate `{name}` placeholders in a message template. */
export function formatMessage(template: string, params?: MessageParams): string {
	if (!params) return template;
	return template.replace(/\{(\w+)\}/g, (_, key: string) =>
		params[key] !== undefined ? String(params[key]) : `{${key}}`
	);
}
