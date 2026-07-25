<script lang="ts">
	import DiffViewer from './DiffViewer.svelte';

	let props = $props<{ mode?: 'unified' | 'split' }>();

	const before = `export function greet(name) {\n  return 'Hi ' + name;\n}`;
	const after = `export function greet(name: string) {\n  return \`Hello, \${name}!\`;\n}`;
</script>

<DiffViewer {before} {after} mode={props.mode ?? 'unified'} class="w-full max-w-xl" />
