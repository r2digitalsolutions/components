<script lang="ts">
	export interface BreadcrumbItem {
		id: string;
		label: string;
		href?: string;
	}

	interface BreadcrumbProps {
		items?: BreadcrumbItem[];
		class?: string;
		onnavigate?: (id: string) => void;
	}

	let {
		items = [],
		class: className = '',
		onnavigate
	}: BreadcrumbProps = $props();
</script>

<nav class={['w-full', className]} aria-label="Breadcrumb">
	<ol class="flex flex-wrap items-center gap-1.5 text-sm">
		{#each items as item, index (item.id ?? `breadcrumb-${index}`)}
			<li class="inline-flex items-center gap-1.5">
				{#if index > 0}
					<svg class="h-3.5 w-3.5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
					</svg>
				{/if}

				{#if index === items.length - 1}
					<span class="font-medium text-primary" aria-current="page">{item.label}</span>
				{:else if item.href}
					<a
						href={item.href}
						class="text-secondary transition-colors hover:text-primary"
						onclick={(e) => {
							if (onnavigate) {
								e.preventDefault();
								onnavigate(item.id);
							}
						}}
					>
						{item.label}
					</a>
				{:else}
					<button
						type="button"
						class="text-secondary transition-colors hover:text-primary"
						onclick={() => onnavigate?.(item.id)}
					>
						{item.label}
					</button>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
