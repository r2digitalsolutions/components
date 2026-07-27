<script lang="ts">
	import ExpressionEditor from './ExpressionEditor.svelte';
	let value = $state('price * quantity');
</script>

<div class="mx-auto max-w-lg p-4">
	<ExpressionEditor
		bind:value
		fields={['price', 'quantity', 'discount', 'tax']}
		validate={(v) => (!v.trim() ? 'Expression required' : null)}
	/>
</div>
