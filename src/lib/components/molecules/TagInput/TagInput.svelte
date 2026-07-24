<script lang="ts">
	import Chip from '$lib/components/atoms/Chip/Chip.svelte';

	interface TagInputProps {
		value?: string[];
		placeholder?: string;
		label?: string;
		disabled?: boolean;
		max?: number;
		class?: string;
		onchange?: (tags: string[]) => void;
	}

	let {
		value = $bindable<string[]>([]),
		placeholder = 'Add tag and press Enter',
		label,
		disabled = false,
		max,
		class: className = '',
		onchange
	}: TagInputProps = $props();

	let draft = $state('');

	function add(tag: string) {
		const next = tag.trim();
		if (!next || disabled) return;
		if (value.includes(next)) {
			draft = '';
			return;
		}
		if (max !== undefined && value.length >= max) return;
		value = [...value, next];
		draft = '';
		onchange?.(value);
	}

	function remove(tag: string) {
		value = value.filter((t) => t !== tag);
		onchange?.(value);
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault();
			add(draft);
		} else if (e.key === 'Backspace' && !draft && value.length) {
			remove(value[value.length - 1]);
		}
	}
</script>

<div class={['flex w-full flex-col gap-1.5', className]}>
	{#if label}
		<label class="text-sm font-medium text-primary">{label}</label>
	{/if}
	<div
		class={[
			'flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-border bg-surface-elevated px-2 py-1.5',
			'focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20',
			disabled && 'cursor-not-allowed opacity-50'
		]}
	>
		{#each value as tag (tag)}
			<Chip
				size="sm"
				dismissible={!disabled}
				ondismiss={() => remove(tag)}
			>
				{tag}
			</Chip>
		{/each}
		<input
			bind:value={draft}
			{placeholder}
			{disabled}
			onkeydown={onKeydown}
			class="min-w-[8rem] flex-1 bg-transparent px-1 text-sm text-primary outline-none placeholder:text-muted"
		/>
	</div>
</div>
