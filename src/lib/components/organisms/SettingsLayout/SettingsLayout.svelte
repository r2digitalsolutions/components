<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface SettingsNavItem {
		id: string;
		label: string;
		description?: string;
		disabled?: boolean;
	}

	interface SettingsLayoutProps {
		items?: SettingsNavItem[];
		value?: string;
		title?: string;
		stickyHeader?: boolean;
		class?: string;
		children?: Snippet;
		header?: Snippet;
		onchange?: (id: string) => void;
	}

	let {
		items = [],
		value = $bindable(''),
		title = 'Settings',
		stickyHeader = true,
		class: className = '',
		children,
		header,
		onchange
	}: SettingsLayoutProps = $props();

	function select(id: string, disabled?: boolean) {
		if (disabled) return;
		value = id;
		onchange?.(id);
	}
</script>

<div class={['flex w-full flex-col gap-6 lg:flex-row', className]}>
	<aside class="w-full shrink-0 lg:w-56">
		<p class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
		<nav class="flex flex-row gap-1 overflow-x-auto lg:flex-col">
			{#each items as item (item.id)}
				<button
					type="button"
					disabled={item.disabled}
					onclick={() => select(item.id, item.disabled)}
					class={[
						'rounded-xl px-3 py-2 text-left transition-colors',
						value === item.id
							? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
							: 'text-secondary hover:bg-surface-overlay hover:text-primary',
						item.disabled && 'opacity-40'
					]}
				>
					<span class="block text-sm font-medium">{item.label}</span>
					{#if item.description}
						<span class="hidden text-xs text-muted lg:block">{item.description}</span>
					{/if}
				</button>
			{/each}
		</nav>
	</aside>

	<section class="min-w-0 flex-1">
		{#if header || stickyHeader}
			<div class={['mb-4 border-b border-border pb-3', stickyHeader && 'sticky top-0 z-10 bg-surface/90 backdrop-blur']}>
				{#if header}
					{@render header()}
				{:else}
					{@const active = items.find((i) => i.id === value)}
					<h2 class="text-lg font-semibold text-primary">{active?.label ?? title}</h2>
					{#if active?.description}
						<p class="text-sm text-secondary">{active.description}</p>
					{/if}
				{/if}
			</div>
		{/if}
		{#if children}{@render children()}{/if}
	</section>
</div>
