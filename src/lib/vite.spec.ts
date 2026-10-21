import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { packageUsage, resolveComponentSources, scopeStylesImport } from './vite.js';

let dir: string;
let pkg: string;

function write(file: string, content: string) {
	mkdirSync(path.dirname(file), { recursive: true });
	writeFileSync(file, content);
	return file;
}

beforeEach(() => {
	dir = mkdtempSync(path.join(tmpdir(), 'component-sources-'));
	pkg = path.join(dir, 'dist');
	write(
		path.join(pkg, 'index.js'),
		`export { default as Button } from './components/Button/Button.svelte';
export { default as Select } from './components/Select/Select.svelte';
export {
	themeStore,
	other as renamed
} from './utils/theme.svelte.js';
export const version = '1.0.0';`
	);
	write(
		path.join(pkg, 'components/Button/Button.svelte'),
		`<script>import Spinner from '../Spinner/Spinner.svelte'; import { cn } from '../../utils/cn';</script>`
	);
	write(path.join(pkg, 'components/Spinner/Spinner.svelte'), `<span class="animate-spin"></span>`);
	write(path.join(pkg, 'components/Select/Select.svelte'), `<div class="select"></div>`);
	write(path.join(pkg, 'utils/cn.js'), `export const cn = (...c) => c.join(' ');`);
	write(
		path.join(pkg, 'utils/theme.svelte.js'),
		`export const themeStore = {}; export const other = 1;`
	);
});

afterEach(() => rmSync(dir, { recursive: true, force: true }));

const relative = (files: string[]) => files.map((file) => path.relative(pkg, file));

describe('packageUsage', () => {
	it('collects runtime names and ignores types and stylesheets', () => {
		expect(
			packageUsage(`export const x = 1
import { Button, type Size, Select as Picker } from '@r2digisolutions/components';
import type { Theme } from '@r2digisolutions/components';
import '@r2digisolutions/components/styles.css';`)
		).toEqual({ names: ['Button', 'Select'] });
	});

	it('gives up on imports it cannot resolve statically', () => {
		for (const code of [
			`import * as R from '@r2digisolutions/components';`,
			`export * from '@r2digisolutions/components';`,
			`const lib = await import('@r2digisolutions/components');`,
			`import { Button } from '@r2digisolutions/components/dist/Button.svelte';`
		])
			expect(packageUsage(code)).toHaveProperty('reason');
	});
});

describe('resolveComponentSources', () => {
	it('keeps the imported components and their dependencies only', () => {
		const app = write(
			path.join(dir, 'src/Page.svelte'),
			`<script>
	import {
		Button,
		renamed
	} from '@r2digisolutions/components';
</script>`
		);
		const result = resolveComponentSources([app], pkg);
		expect('files' in result && relative(result.files)).toEqual([
			'components/Button/Button.svelte',
			'components/Spinner/Spinner.svelte',
			'utils/cn.js',
			'utils/theme.svelte.js'
		]);
	});

	it('falls back when a name is not exported', () => {
		const app = write(
			path.join(dir, 'src/a.ts'),
			`import { Missing } from '@r2digisolutions/components';`
		);
		expect(resolveComponentSources([app], pkg)).toEqual({
			reason: `"Missing" is not exported by @r2digisolutions/components`
		});
	});
});

describe('scopeStylesImport', () => {
	it('replaces the whole-package stylesheet with the theme and explicit sources', () => {
		const css = `@import 'tailwindcss';\n@import "@r2digisolutions/components/styles.css";\n.a { color: red; }`;
		expect(scopeStylesImport(css, ['/lib/Button.svelte'])).toBe(
			`@import 'tailwindcss';\n@import '@r2digisolutions/components/theme.css';\n.a { color: red; }\n@source "/lib/Button.svelte";\n`
		);
		expect(scopeStylesImport('.a {}', [])).toBeNull();
	});
});
