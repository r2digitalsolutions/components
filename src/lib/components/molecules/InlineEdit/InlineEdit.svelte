<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';

	interface InlineEditProps {
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		required?: boolean;
		class?: string;
		onsave?: (value: string) => void;
		oncancel?: () => void;
	}

	let {
		value = $bindable(''),
		placeholder = 'Click to edit',
		disabled = false,
		required = false,
		class: className = '',
		onsave,
		oncancel
	}: InlineEditProps = $props();

	let editing = $state(false);
	let draft = $state('');
	let inputEl = $state<HTMLInputElement | null>(null);

	function startEdit() {
		if (disabled) return;
		draft = value;
		editing = true;
		queueMicrotask(() => inputEl?.focus());
	}

	function cancel() {
		editing = false;
		draft = value;
		oncancel?.();
	}

	function save() {
		const next = draft.trim();
		if (required && !next) return;
		value = next;
		editing = false;
		onsave?.(value);
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			save();
		}
		if (e.key === 'Escape') {
			e.preventDefault();
			cancel();
		}
	}
</script>

{#if editing}
	<div class={['flex w-full max-w-md items-center gap-2', className]}>
		<input
			bind:this={inputEl}
			bind:value={draft}
			{placeholder}
			{disabled}
			{onkeydown}
			aria-label="Inline edit"
			class="h-8 min-w-0 flex-1 rounded-lg border border-border bg-surface-elevated px-3 text-sm text-primary outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
		/>
		<Button size="sm" onclick={save}>Save</Button>
		<Button size="sm" variant="ghost" onclick={cancel}>Cancel</Button>
	</div>
{:else}
	<button
		type="button"
		class={[
			'group inline-flex max-w-full items-center gap-2 rounded-lg px-2 py-1 text-left text-sm text-primary transition-colors',
			'hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
			disabled && 'cursor-not-allowed opacity-50',
			className
		]}
		{disabled}
		onclick={startEdit}
	>
		<span class={['truncate', !value && 'text-muted']}>{value || placeholder}</span>
		<svg
			class="h-3.5 w-3.5 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			aria-hidden="true"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-.828.414l-3.414.586.586-3.414a2 2 0 01.414-.828z"
			/>
		</svg>
	</button>
{/if}
