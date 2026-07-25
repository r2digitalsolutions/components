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

	function addMany(raw: string) {
		if (disabled) return;
		const parts = raw
			.split(/[\s,;]+/)
			.map((p) => p.trim())
			.filter(Boolean);
		if (!parts.length) return;
		let next = [...value];
		for (const part of parts) {
			if (next.includes(part)) continue;
			if (max !== undefined && next.length >= max) break;
			next.push(part);
		}
		value = next;
		draft = '';
		onchange?.(value);
	}

	function add(tag: string) {
		addMany(tag);
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

	function onPaste(e: ClipboardEvent) {
		const text = e.clipboardData?.getData('text') ?? '';
		if (!/[,;\s]/.test(text)) return;
		e.preventDefault();
		addMany(`${draft} ${text}`);
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
			onpaste={onPaste}
			class="min-w-[8rem] flex-1 bg-transparent px-1 text-sm text-primary outline-none placeholder:text-muted"
		/>
	</div>
</div>
