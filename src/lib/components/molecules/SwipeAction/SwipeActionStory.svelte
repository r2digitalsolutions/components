<script lang="ts">
	import SwipeAction from './SwipeAction.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	let deleted = $state(false);
</script>

{#if deleted}
	<Text size="sm" tone="muted">Row deleted</Text>
{:else}
	<div class="max-w-sm">
		<SwipeAction>
			<div class="flex items-center gap-3 px-3 py-3">
				<div class="h-9 w-9 rounded-full bg-brand-500/15"></div>
				<div>
					<p class="text-sm font-medium text-primary">Invoice #1042</p>
					<Text size="xs" tone="muted">Swipe left for actions</Text>
				</div>
			</div>
			{#snippet actions()}
				<button
					type="button"
					class="flex w-full items-center justify-center bg-red-500 px-2 text-xs font-semibold text-white"
					onclick={() => (deleted = true)}
				>
					Delete
				</button>
			{/snippet}
		</SwipeAction>
	</div>
{/if}
