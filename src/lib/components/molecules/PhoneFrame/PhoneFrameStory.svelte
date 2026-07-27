<script lang="ts">
	import PhoneFrame from './PhoneFrame.svelte';
	import AppBar from '$lib/components/molecules/AppBar/AppBar.svelte';

	interface Props {
		example?: 'default' | 'scroll' | 'sizes';
	}

	let { example = 'default' }: Props = $props();
</script>

{#if example === 'sizes'}
	<div class="flex flex-wrap items-end justify-center gap-6 p-6">
		{#each (['sm', 'md', 'lg'] as const) as size (size)}
			<div class="space-y-2 text-center">
				<p class="text-xs font-medium uppercase tracking-wide text-muted">{size}</p>
				<PhoneFrame {size}>
					<div class="p-4">
						<p class="text-sm font-medium text-primary">Preview</p>
						<p class="text-[11px] text-muted">Fixed size · scrolls inside</p>
					</div>
				</PhoneFrame>
			</div>
		{/each}
	</div>
{:else}
	<div class="flex justify-center p-6">
		<PhoneFrame size="md">
			<AppBar title="Phone frame" sticky={false} safeTop={false} showBack />
			<div class="space-y-2 p-4 pb-10">
				<p class="text-sm text-secondary">
					{#if example === 'scroll'}
						Long content — the phone stays fixed and this area scrolls.
					{:else}
						Fixed chassis — content scrolls inside when it overflows.
					{/if}
				</p>
				{#each Array.from({ length: example === 'scroll' ? 16 : 4 }, (_, i) => i + 1) as n (n)}
					<div
						class="rounded-xl border border-border bg-surface-elevated px-3 py-3 text-sm text-primary"
					>
						Card {n}
					</div>
				{/each}
			</div>
		</PhoneFrame>
	</div>
{/if}
