<script lang="ts">
	import ConflictResolver from './ConflictResolver.svelte';
</script>

<div class="p-4">
	<ConflictResolver
		mine={`export function greet() {\n  return 'hola';\n}`}
		theirs={`export function greet() {\n  return 'hello';\n}`}
		onresolve={(r) => console.log(r)}
	/>
</div>
