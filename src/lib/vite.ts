import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const PACKAGE = '@r2digisolutions/components';
const PLUGIN_NAME = 'r2digisolutions:component-sources';
const STYLES_IMPORT = /@import\s+(['"])@r2digisolutions\/components\/styles\.css\1\s*;/;
const APP_FILE = /\.(?:svelte|[cm]?[jt]sx?)$/;
const LIBRARY_FILE = /\.(?:svelte|js)$/;
/** Subpaths that carry no components (stylesheets and this plugin). */
const NEUTRAL_SUBPATHS = new Set(['styles.css', 'theme.css', 'vite']);
const PACKAGE_IMPORT =
	/\b(import|export)\s+(type\s+)?((?:[\w$]+\s*,\s*)?\{[^}]*\}|\*(?:\s*as\s+[\w$]+)?|[\w$]+)\s*from\s*(['"])@r2digisolutions\/components(?:\/([^'"]+))?\4/g;
const DYNAMIC_PACKAGE_IMPORT =
	/\bimport\s*\(\s*(['"])@r2digisolutions\/components(?:\/([^'"]*))?\1/g;
const SIDE_EFFECT_PACKAGE_IMPORT =
	/\bimport\s*(['"])@r2digisolutions\/components(?:\/([^'"]*))?\1/g;
const INDEX_REEXPORT = /export\s+(type\s+)?\{([^}]*)\}\s*from\s*['"]([^'"]+)['"]/g;
const INDEX_DECLARATION =
	/export\s+(?:async\s+)?(?:const|let|var|function\*?|class)\s+([A-Za-z_$][\w$]*)/g;
const RELATIVE_IMPORT = /(?:\bfrom\s*|\bimport\s*\(?\s*)(['"])(\.{1,2}\/[^'"]+)\1/g;

export type ComponentSourcesResult = { files: string[] } | { reason: string };

export interface ComponentSourcesOptions {
	/** Directories, relative to the Vite root, holding the code that imports components. Default `['src']`. */
	dirs?: string[];
}

function importedNames(clause: string) {
	const named = /^\{([^}]*)\}$/.exec(clause.trim());
	if (!named) return null;
	return named[1]
		.split(',')
		.map((part) => part.trim())
		.filter((part) => part && !part.startsWith('type '))
		.map((part) => part.split(/\s+as\s+/)[0].trim());
}

/** Component names a source file imports from the package, or why that can't be known statically. */
export function packageUsage(code: string): { names: string[] } | { reason: string } {
	const names: string[] = [];
	for (const [, , typeOnly, clause, , subpath] of code.matchAll(PACKAGE_IMPORT)) {
		if (typeOnly) continue;
		if (subpath !== undefined) {
			if (NEUTRAL_SUBPATHS.has(subpath)) continue;
			return { reason: `import of "${PACKAGE}/${subpath}"` };
		}
		const clauseNames = importedNames(clause);
		if (!clauseNames) return { reason: `"${clause.trim()}" imported from "${PACKAGE}"` };
		names.push(...clauseNames);
	}
	for (const pattern of [DYNAMIC_PACKAGE_IMPORT, SIDE_EFFECT_PACKAGE_IMPORT])
		for (const [, , subpath] of code.matchAll(pattern))
			if (subpath === undefined || !NEUTRAL_SUBPATHS.has(subpath))
				return { reason: `dynamic or side-effect import of "${PACKAGE}"` };
	return { names };
}

function exportMap(packageDir: string) {
	const indexFile = path.join(packageDir, 'index.js');
	const index = readFileSync(indexFile, 'utf8');
	const exports = new Map<string, string>();
	for (const [, typeOnly, clause, specifier] of index.matchAll(INDEX_REEXPORT)) {
		if (typeOnly) continue;
		const file = path.resolve(packageDir, specifier);
		for (const part of clause.split(',')) {
			const entry = part.trim();
			if (!entry || entry.startsWith('type ')) continue;
			const [local, exported = local] = entry.split(/\s+as\s+/).map((name) => name.trim());
			exports.set(exported, file);
		}
	}
	for (const [, name] of index.matchAll(INDEX_DECLARATION)) exports.set(name, indexFile);
	return exports;
}

function resolveRelative(from: string, specifier: string) {
	const base = path.resolve(path.dirname(from), specifier);
	for (const candidate of [base, `${base}.js`, path.join(base, 'index.js')])
		if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
}

/**
 * Library files (`.svelte`/`.js`) reachable from the components the given app files import.
 * Returns a reason instead when usage can't be determined, so callers keep scanning the whole package.
 */
export function resolveComponentSources(
	appFiles: Iterable<string>,
	packageDir: string
): ComponentSourcesResult {
	const names = new Set<string>();
	for (const file of appFiles) {
		const usage = packageUsage(readFileSync(file, 'utf8'));
		if ('reason' in usage) return { reason: `${usage.reason} in ${file}` };
		usage.names.forEach((name) => names.add(name));
	}
	const exports = exportMap(packageDir);
	const reached = new Set<string>();
	const visit = (file: string) => {
		if (reached.has(file)) return;
		reached.add(file);
		if (!LIBRARY_FILE.test(file)) return;
		for (const [, , specifier] of readFileSync(file, 'utf8').matchAll(RELATIVE_IMPORT)) {
			const target = resolveRelative(file, specifier);
			if (target) visit(target);
		}
	};
	for (const name of names) {
		const file = exports.get(name);
		if (!file) return { reason: `"${name}" is not exported by ${PACKAGE}` };
		visit(file);
	}
	return { files: [...reached].filter((file) => LIBRARY_FILE.test(file)).sort() };
}

/** Swaps the whole-package stylesheet for the theme plus one `@source` per used library file. */
export function scopeStylesImport(css: string, files: string[]) {
	if (!STYLES_IMPORT.test(css)) return null;
	const sources = files.map((file) => `@source ${JSON.stringify(file.split(path.sep).join('/'))};`);
	return `${css.replace(STYLES_IMPORT, `@import '${PACKAGE}/theme.css';`)}\n${sources.join('\n')}\n`;
}

function listFiles(dir: string): string[] {
	if (!existsSync(dir)) return [];
	return (readdirSync(dir, { recursive: true }) as string[])
		.filter((file) => APP_FILE.test(file) && !file.split(path.sep).includes('node_modules'))
		.map((file) => path.join(dir, file));
}

/**
 * Production builds only: Tailwind scans just the library components the app imports (and their
 * dependencies) instead of all of them, which shrinks the generated CSS. The app keeps
 * `@import '@r2digisolutions/components/styles.css';`; place this plugin before `tailwindcss()`.
 * If an import can't be analysed statically it falls back to scanning the whole package.
 */
export function componentSources(options: ComponentSourcesOptions = {}): Plugin {
	const packageDir = path.dirname(fileURLToPath(import.meta.url));
	let root = process.cwd();
	let result: ComponentSourcesResult | undefined;
	let log: (message: string) => void = console.log;
	let warn: (message: string) => void = console.warn;
	const resolve = () => {
		if (result) return result;
		const files = (options.dirs ?? ['src']).flatMap((dir) => listFiles(path.resolve(root, dir)));
		result = resolveComponentSources(files, packageDir);
		if ('files' in result)
			log(`[${PLUGIN_NAME}] Tailwind scans ${result.files.length} library files`);
		else warn(`[${PLUGIN_NAME}] scanning the whole package: ${result.reason}`);
		return result;
	};
	return {
		name: PLUGIN_NAME,
		apply: 'build',
		enforce: 'pre',
		configResolved(config) {
			root = config.root;
			log = (message) => config.logger.info(message);
			warn = (message) => config.logger.warn(message);
			const own = config.plugins.findIndex((plugin) => plugin.name === PLUGIN_NAME);
			const tailwind = config.plugins.findIndex((plugin) =>
				plugin.name.startsWith('@tailwindcss/vite:generate')
			);
			if (tailwind !== -1 && tailwind < own)
				warn(`[${PLUGIN_NAME}] has no effect: register componentSources() before tailwindcss()`);
		},
		transform: {
			// Hook filter (Vite 6.3+): skips the JS round-trip for every non-matching module.
			filter: { id: /\.css(?:$|\?)/, code: `${PACKAGE}/styles.css` },
			handler(code, id) {
				if (!/\.css(?:$|\?)/.test(id) || !STYLES_IMPORT.test(code)) return;
				const sources = resolve();
				if (!('files' in sources)) return;
				return { code: scopeStylesImport(code, sources.files) ?? code, map: null };
			}
		}
	};
}
