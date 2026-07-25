<script lang="ts">
	import CodeEditor from './CodeEditor.svelte';

	let value = $state(`export function greet(name: string) {
  return \`Hello, \${name}!\`;
}

console.log(greet('world'));
`);
</script>

<div class="max-w-xl">
	<CodeEditor bind:value language="ts" filename="greet.ts" minHeight={200} />
</div>
