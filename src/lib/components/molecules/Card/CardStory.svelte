<script lang="ts">
	import Card from './Card.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let {
		variant = 'default',
		padding = 'md',
		hoverable = false,
		chrome = true,
		layout = 'basic'
	}: {
		variant?: 'default' | 'elevated' | 'bordered' | 'ghost' | 'soft';
		padding?: 'none' | 'sm' | 'md' | 'lg';
		hoverable?: boolean;
		chrome?: boolean;
		layout?: 'basic' | 'toolbar' | 'stats' | 'action';
	} = $props();
</script>

{#if layout === 'toolbar'}
	<div class="w-full max-w-md">
		<Card {variant} padding="none" {chrome} {hoverable}>
			{#snippet header()}
				<div class="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
					<div class="min-w-0">
						<p class="truncate text-xs font-semibold text-primary">API response</p>
						<p class="text-[11px] tabular-nums text-muted">object · 3 keys</p>
					</div>
					<div class="flex items-center gap-1">
						<button
							type="button"
							class="rounded-lg px-2 py-1 text-[11px] font-medium text-secondary transition hover:bg-surface-overlay hover:text-primary"
						>
							Expand
						</button>
						<button
							type="button"
							class="rounded-lg px-2 py-1 text-[11px] font-medium text-secondary transition hover:bg-surface-overlay hover:text-primary"
						>
							Copy
						</button>
					</div>
				</div>
			{/snippet}

			<div class="space-y-2 px-4 py-3 font-mono text-xs text-secondary sm:px-5">
				<p><span class="text-brand-600 dark:text-brand-400">ok</span>: <span class="text-amber-600">true</span></p>
				<p><span class="text-brand-600 dark:text-brand-400">user</span>: <span class="text-muted">{'{…}'}</span></p>
				<p><span class="text-brand-600 dark:text-brand-400">tags</span>: <span class="text-muted">[3]</span></p>
			</div>
		</Card>
	</div>
{:else if layout === 'stats'}
	<div class="grid w-full max-w-2xl gap-3 sm:grid-cols-3">
		{#each [{ label: 'Add', value: '+12', tone: 'text-emerald-600' }, { label: 'Remove', value: '−4', tone: 'text-rose-600' }, { label: 'Same', value: '38', tone: 'text-muted' }] as item}
			<Card {variant} padding="md" {chrome}>
				<p class="text-[11px] font-medium uppercase tracking-wide text-muted">{item.label}</p>
				<p class={['mt-1 text-2xl font-semibold tabular-nums text-primary', item.tone]}>
					{item.value}
				</p>
			</Card>
		{/each}
	</div>
{:else if layout === 'action'}
	<div class="w-full max-w-md">
		<Card {variant} {padding} {chrome} {hoverable}>
			{#snippet header()}
				<div class="flex items-center justify-between gap-2">
					<div>
						<h3 class="text-sm font-semibold text-primary">Deploy preview</h3>
						<p class="text-xs text-muted">Ready · branch feature/cards</p>
					</div>
					<Badge variant="success" size="sm">Live</Badge>
				</div>
			{/snippet}

			<p class="text-sm leading-relaxed text-secondary">
				Same shell as DiffViewer / JSONViewer: rounded-2xl, soft header chrome, light shadow.
			</p>

			{#snippet footer()}
				<div class="flex items-center justify-end gap-2">
					<Button size="sm" variant="ghost">Dismiss</Button>
					<Button size="sm">Open preview</Button>
				</div>
			{/snippet}
		</Card>
	</div>
{:else}
	<div class="w-full max-w-md">
		<Card {variant} {padding} {chrome} {hoverable}>
			{#snippet header()}
				<div class="flex items-center justify-between gap-2">
					<h3 class="text-sm font-semibold text-primary">Card title</h3>
					<Badge variant="info" size="sm">molecule</Badge>
				</div>
			{/snippet}

			<p class="text-sm leading-relaxed text-secondary">
				Shared card surface used across the library — border, elevated background, and optional
				header/footer chrome.
			</p>

			{#snippet footer()}
				<p class="text-xs text-muted">Footer · secondary actions</p>
			{/snippet}
		</Card>
	</div>
{/if}
