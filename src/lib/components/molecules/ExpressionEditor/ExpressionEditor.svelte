<script lang="ts">
	import CodeEditor from '$lib/components/molecules/CodeEditor/CodeEditor.svelte';
	import Chip from '$lib/components/atoms/Chip/Chip.svelte';

	interface ExpressionEditorProps {
		value?: string;
		fields?: string[];
		placeholder?: string;
		error?: string;
		validate?: (value: string) => string | null;
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		fields = [],
		placeholder = 'e.g. price * quantity',
		error = '',
		validate,
		class: className = '',
		onchange
	}: ExpressionEditorProps = $props();

	const validationError = $derived(validate?.(value) ?? error ?? '');

	function insertField(field: string) {
		const needsSpace = value.length > 0 && !/\s$/.test(value);
		value = `${value}${needsSpace ? ' ' : ''}${field}`;
		onchange?.(value);
	}
</script>

<div class={['flex flex-col gap-2', className]} data-expression-editor>
	{#if fields.length}
		<div class="flex flex-wrap gap-1">
			{#each fields as field (field)}
				<button type="button" onclick={() => insertField(field)}>
					<Chip size="sm" variant="default">{field}</Chip>
				</button>
			{/each}
		</div>
	{/if}
	<CodeEditor
		bind:value
		language="js"
		{placeholder}
		showLineNumbers={false}
		minHeight={72}
		onchange={onchange}
		class="rounded-xl"
	/>
	{#if validationError}
		<p class="text-xs text-red-600">{validationError}</p>
	{/if}
</div>
