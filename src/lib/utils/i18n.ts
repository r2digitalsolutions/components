export type LocaleCode = 'en' | 'es' | 'ca' | 'pt' | 'fr' | 'de' | (string & {});

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
	/** CommandPalette */
	noResults: string;
	commandPalette: string;
	commandPalettePlaceholder: string;
	/** FileUploader */
	uploadFiles: string;
	uploadHelper: string;
	dropToUpload: string;
	dropOrBrowse: string;
	browse: string;
	browseButton: string;
	viewMode: string;
	listView: string;
	gridView: string;
	clearAll: string;
	upload: string;
	change: string;
	remove: string;
	edit: string;
	removeNamed: string;
	selectedFiles: string;
	addProfilePhoto: string;
	media: string;
	imageRequired: string;
	typeNotAllowed: string;
	exceedsMaxSize: string;
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
	noResults: 'No results',
	commandPalette: 'Command palette',
	commandPalettePlaceholder: 'Type a command or search…',
	uploadFiles: 'Upload files',
	uploadHelper: 'SVG, PNG, JPG or GIF (max. 10MB)',
	dropToUpload: 'Drop files to upload',
	dropOrBrowse: 'Drop files or',
	browse: 'browse',
	browseButton: 'Browse',
	viewMode: 'View mode',
	listView: 'List view',
	gridView: 'Grid view',
	clearAll: 'Clear all',
	upload: 'Upload',
	change: 'Change',
	remove: 'Remove',
	edit: 'Edit',
	removeNamed: 'Remove {name}',
	selectedFiles: 'Selected files',
	addProfilePhoto: 'Add a profile photo',
	media: 'Media',
	imageRequired: '{name}: an image is required',
	typeNotAllowed: '{name}: file type not allowed',
	exceedsMaxSize: '{name}: exceeds {max}MB',
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
	noResults: 'Sin resultados',
	commandPalette: 'Paleta de comandos',
	commandPalettePlaceholder: 'Escribe un comando o busca…',
	uploadFiles: 'Subir archivos',
	uploadHelper: 'SVG, PNG, JPG o GIF (máx. 10MB)',
	dropToUpload: 'Suelta los archivos para subirlos',
	dropOrBrowse: 'Suelta archivos o',
	browse: 'explora',
	browseButton: 'Explorar',
	viewMode: 'Modo de vista',
	listView: 'Vista de lista',
	gridView: 'Vista de cuadrícula',
	clearAll: 'Borrar todo',
	upload: 'Subir',
	change: 'Cambiar',
	remove: 'Quitar',
	edit: 'Editar',
	removeNamed: 'Quitar {name}',
	selectedFiles: 'Archivos seleccionados',
	addProfilePhoto: 'Añade una foto de perfil',
	media: 'Multimedia',
	imageRequired: '{name}: se requiere una imagen',
	typeNotAllowed: '{name}: tipo no permitido',
	exceedsMaxSize: '{name}: supera {max}MB',
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
	noResults: 'Sem resultados',
	commandPalette: 'Paleta de comandos',
	commandPalettePlaceholder: 'Escreve um comando ou pesquisa…',
	uploadFiles: 'Carregar ficheiros',
	uploadHelper: 'SVG, PNG, JPG ou GIF (máx. 10MB)',
	dropToUpload: 'Largue os ficheiros para carregar',
	dropOrBrowse: 'Largue ficheiros ou',
	browse: 'procurar',
	browseButton: 'Procurar',
	viewMode: 'Modo de visualização',
	listView: 'Vista de lista',
	gridView: 'Vista de grelha',
	clearAll: 'Limpar tudo',
	upload: 'Carregar',
	change: 'Alterar',
	remove: 'Remover',
	edit: 'Editar',
	removeNamed: 'Remover {name}',
	selectedFiles: 'Ficheiros selecionados',
	addProfilePhoto: 'Adicione uma foto de perfil',
	media: 'Multimédia',
	imageRequired: '{name}: é necessária uma imagem',
	typeNotAllowed: '{name}: tipo não permitido',
	exceedsMaxSize: '{name}: excede {max}MB',
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
	noResults: 'Aucun résultat',
	commandPalette: 'Palette de commandes',
	commandPalettePlaceholder: 'Tapez une commande ou recherchez…',
	uploadFiles: 'Téléverser des fichiers',
	uploadHelper: 'SVG, PNG, JPG ou GIF (max. 10MB)',
	dropToUpload: 'Déposez les fichiers pour les téléverser',
	dropOrBrowse: 'Déposez des fichiers ou',
	browse: 'parcourir',
	browseButton: 'Parcourir',
	viewMode: 'Mode d’affichage',
	listView: 'Vue liste',
	gridView: 'Vue grille',
	clearAll: 'Tout effacer',
	upload: 'Téléverser',
	change: 'Changer',
	remove: 'Retirer',
	edit: 'Modifier',
	removeNamed: 'Retirer {name}',
	selectedFiles: 'Fichiers sélectionnés',
	addProfilePhoto: 'Ajoutez une photo de profil',
	media: 'Médias',
	imageRequired: '{name} : une image est requise',
	typeNotAllowed: '{name} : type non autorisé',
	exceedsMaxSize: '{name} : dépasse {max}MB',
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
	noResults: 'Keine Ergebnisse',
	commandPalette: 'Befehlspalette',
	commandPalettePlaceholder: 'Befehl eingeben oder suchen…',
	uploadFiles: 'Dateien hochladen',
	uploadHelper: 'SVG, PNG, JPG oder GIF (max. 10MB)',
	dropToUpload: 'Dateien zum Hochladen ablegen',
	dropOrBrowse: 'Dateien ablegen oder',
	browse: 'durchsuchen',
	browseButton: 'Durchsuchen',
	viewMode: 'Ansicht',
	listView: 'Listenansicht',
	gridView: 'Rasteransicht',
	clearAll: 'Alle löschen',
	upload: 'Hochladen',
	change: 'Ändern',
	remove: 'Entfernen',
	edit: 'Bearbeiten',
	removeNamed: '{name} entfernen',
	selectedFiles: 'Ausgewählte Dateien',
	addProfilePhoto: 'Profilfoto hinzufügen',
	media: 'Medien',
	imageRequired: '{name}: ein Bild ist erforderlich',
	typeNotAllowed: '{name}: Dateityp nicht erlaubt',
	exceedsMaxSize: '{name}: überschreitet {max}MB',
	fieldRequired: 'Dieses Feld ist erforderlich',
	invalidEmail: 'Geben Sie eine gültige E-Mail-Adresse ein',
	invalidUrl: 'Geben Sie eine gültige URL ein',
	minLength: 'Mindestens {min} Zeichen verwenden',
	maxLength: 'Höchstens {max} Zeichen verwenden',
	minValue: 'Muss mindestens {min} sein',
	maxValue: 'Darf höchstens {max} sein',
	patternMismatch: 'Ungültiges Format'
};

const ca: UiMessages = {
	save: 'Desar',
	cancel: 'Cancel·lar',
	delete: 'Eliminar',
	reset: 'Restablir',
	submit: 'Enviar',
	close: 'Tancar',
	optional: 'Opcional',
	required: 'Obligatori',
	loading: 'S’està carregant…',
	errorSummary: 'Corregeix el següent',
	addItem: 'Afegir element',
	removeItem: 'Eliminar element',
	noItems: 'Encara sense elements',
	noResults: 'Sense resultats',
	commandPalette: 'Paleta de comandes',
	commandPalettePlaceholder: 'Escriu una comanda o cerca…',
	uploadFiles: 'Pujar fitxers',
	uploadHelper: 'SVG, PNG, JPG o GIF (màx. 10MB)',
	dropToUpload: 'Deixa anar els fitxers per pujar-los',
	dropOrBrowse: 'Deixa anar fitxers o',
	browse: 'explora',
	browseButton: 'Explorar',
	viewMode: 'Mode de vista',
	listView: 'Vista de llista',
	gridView: 'Vista de graella',
	clearAll: 'Esborrar-ho tot',
	upload: 'Pujar',
	change: 'Canviar',
	remove: 'Treure',
	edit: 'Editar',
	removeNamed: 'Treure {name}',
	selectedFiles: 'Fitxers seleccionats',
	addProfilePhoto: 'Afegeix una foto de perfil',
	media: 'Multimèdia',
	imageRequired: '{name}: cal una imatge',
	typeNotAllowed: '{name}: tipus no permès',
	exceedsMaxSize: '{name}: supera {max}MB',
	fieldRequired: 'Aquest camp és obligatori',
	invalidEmail: 'Introdueix un email vàlid',
	invalidUrl: 'Introdueix un URL vàlid',
	minLength: 'Usa almenys {min} caràcters',
	maxLength: 'Usa com a màxim {max} caràcters',
	minValue: 'Ha de ser almenys {min}',
	maxValue: 'Ha de ser com a màxim {max}',
	patternMismatch: 'Format no vàlid'
};

/** Built-in dictionaries keyed by primary language subtag (`es-MX` → `es`). */
export const UI_DICTIONARIES: Record<string, UiMessages> = {
	en,
	es,
	ca,
	pt,
	fr,
	de
};

export function resolveLocaleTag(locale: string): string {
	const base = locale.toLowerCase().split('-')[0] ?? 'en';
	return UI_DICTIONARIES[base] ? base : UI_DICTIONARIES[locale] ? locale : 'en';
}

export function getDictionary(locale: string, overrides?: Partial<UiMessages>): UiMessages {
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
