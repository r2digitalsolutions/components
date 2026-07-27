<script lang="ts">
	import FloatingWindow from './FloatingWindow.svelte';
	import type { WindowRect } from './FloatingWindow.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Pin from '@lucide/svelte/icons/pin';

	interface Props {
		example?: 'default' | 'actions';
	}

	let { example = 'default' }: Props = $props();

	let rect = $state<WindowRect>({ x: 40, y: 40, w: 420, h: 280, z: 2 });
	let open = $state(true);
	let pinned = $state(false);
	let log = $state('');
</script>

<div class="relative h-[28rem] overflow-hidden rounded-xl border border-border bg-surface">
	{#if open}
		<FloatingWindow
			bind:rect
			title="Notes"
			active
			onclose={() => {
				open = false;
				log = 'Closed';
			}}
			onminimize={() => (log = 'Minimized')}
			onmaximize={() => (log = rect.maximized ? 'Maximized' : 'Restored')}
		>
			{#snippet actions()}
				{#if example === 'actions'}
					<Badge size="sm" variant="secondary" rounded>Draft</Badge>
					<IconButton
						label={pinned ? 'Unpin' : 'Pin'}
						size="sm"
						variant="ghost"
						onclick={() => {
							pinned = !pinned;
							log = pinned ? 'Pinned' : 'Unpinned';
						}}
					>
						<Pin class={['h-3.5 w-3.5', pinned && 'text-brand-500']} aria-hidden="true" />
					</IconButton>
				{/if}
			{/snippet}
			<div class="space-y-2 p-4 text-sm text-secondary">
				<p>Drag the title bar to move. Resize from edges or corners (hover for accents).</p>
				<p class="text-muted">Window controls and custom actions should click without dragging.</p>
				<pre class="rounded-lg bg-surface-overlay p-2 text-xs text-muted">{JSON.stringify(rect, null, 2)}</pre>
			</div>
		</FloatingWindow>
	{:else}
		<div class="flex h-full items-center justify-center">
			<button
				type="button"
				class="rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-primary hover:bg-surface-overlay"
				onclick={() => {
					open = true;
					rect = { ...rect, minimized: false, maximized: false };
					log = 'Reopened';
				}}
			>
				Reopen window
			</button>
		</div>
	{/if}
</div>

{#if log}
	<p class="mt-2 text-[11px] text-muted">{log}</p>
{/if}
