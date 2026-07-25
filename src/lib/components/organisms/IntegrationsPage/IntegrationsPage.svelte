<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	export interface IntegrationItem {
		id: string;
		name: string;
		description: string;
		category?: string;
		connected?: boolean;
		icon?: string;
	}

	interface IntegrationsPageProps {
		title?: string;
		description?: string;
		items?: IntegrationItem[];
		class?: string;
		ontoggle?: (id: string, connected: boolean) => void;
		onconfigure?: (id: string) => void;
	}

	let {
		title = 'Integrations',
		description = 'Connect tools your team already uses.',
		items = $bindable([] as IntegrationItem[]),
		class: className = '',
		ontoggle,
		onconfigure
	}: IntegrationsPageProps = $props();

	function toggle(id: string, connected: boolean) {
		items = items.map((i) => (i.id === id ? { ...i, connected } : i));
		ontoggle?.(id, connected);
	}
</script>

<div class={['w-full space-y-5', className]}>
	<PageHeader {title} {description} />

	<ul class="grid gap-3 sm:grid-cols-2">
		{#each items as item (item.id)}
			<li
				class="flex flex-col gap-3 rounded-xl border border-border bg-surface-elevated p-4"
			>
				<div class="flex items-start gap-3">
					<span
						class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-xs font-bold text-brand-700 dark:text-brand-300"
						aria-hidden="true"
					>
						{(item.icon ?? item.name).slice(0, 2).toUpperCase()}
					</span>
					<div class="min-w-0 flex-1">
						<div class="flex flex-wrap items-center gap-2">
							<p class="text-sm font-semibold text-primary">{item.name}</p>
							{#if item.category}
								<Badge size="sm" variant="secondary">{item.category}</Badge>
							{/if}
						</div>
						<Text size="xs" tone="muted" class="mt-0.5">{item.description}</Text>
					</div>
				</div>
				<div class="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
					<Toggle
						size="sm"
						checked={!!item.connected}
						label={item.connected ? 'Connected' : 'Connect'}
						onchange={(v) => toggle(item.id, v)}
					/>
					{#if item.connected}
						<Button size="xs" variant="ghost" onclick={() => onconfigure?.(item.id)}>
							Configure
						</Button>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
</div>
