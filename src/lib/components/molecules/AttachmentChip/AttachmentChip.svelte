<script lang="ts">
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';

	interface AttachmentChipProps {
		name: string;
		size?: string;
		type?: string;
		removable?: boolean;
		class?: string;
		onremove?: () => void;
		onclick?: () => void;
	}

	const {
		name,
		size = '',
		type = '',
		removable = false,
		class: className = '',
		onremove,
		onclick
	}: AttachmentChipProps = $props();

	const interactive = $derived(Boolean(onclick));
</script>

{#if interactive}
	<button
		type="button"
		class={[
			'inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-surface-elevated py-1 pl-2.5 pr-1 text-left transition-colors',
			'cursor-pointer hover:border-brand-500/30 hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
			className
		]}
		onclick={() => onclick?.()}
	>
	<span
		class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400"
		aria-hidden="true"
	>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3 w-3">
			<path stroke-linecap="round" stroke-linejoin="round" d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
			<path stroke-linecap="round" stroke-linejoin="round" d="M14 3v5h5" />
		</svg>
	</span>

	<span class="min-w-0">
		<span class="block truncate text-xs font-medium text-primary">{name}</span>
		{#if size || type}
			<span class="block truncate text-[10px] text-muted">
				{#if type}{type}{/if}{#if type && size} · {/if}{#if size}{size}{/if}
			</span>
		{/if}
	</span>

	{#if removable && onremove}
		<IconButton
			label={`Remove ${name}`}
			size="xs"
			variant="ghost"
			onclick={(e) => {
				e.stopPropagation();
				onremove();
			}}
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3 w-3" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</IconButton>
	{/if}
	</button>
{:else}
	<span
		class={[
			'inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-surface-elevated py-1 pl-2.5 pr-1 text-left',
			className
		]}
	>
		<span
			class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400"
			aria-hidden="true"
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3 w-3">
				<path stroke-linecap="round" stroke-linejoin="round" d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
				<path stroke-linecap="round" stroke-linejoin="round" d="M14 3v5h5" />
			</svg>
		</span>

		<span class="min-w-0">
			<span class="block truncate text-xs font-medium text-primary">{name}</span>
			{#if size || type}
				<span class="block truncate text-[10px] text-muted">
					{#if type}{type}{/if}{#if type && size} · {/if}{#if size}{size}{/if}
				</span>
			{/if}
		</span>

		{#if removable && onremove}
			<IconButton
				label={`Remove ${name}`}
				size="xs"
				variant="ghost"
				onclick={() => onremove()}
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3 w-3" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</IconButton>
		{/if}
	</span>
{/if}
