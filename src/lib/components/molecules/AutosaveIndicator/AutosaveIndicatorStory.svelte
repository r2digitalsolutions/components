<script lang="ts">
	import AutosaveIndicator, { type AutosaveStatus } from './AutosaveIndicator.svelte';

	const statuses: AutosaveStatus[] = ['idle', 'dirty', 'saving', 'saved', 'error'];
	let status = $state<AutosaveStatus>('dirty');
</script>

<div class="space-y-4">
	<div class="flex flex-wrap gap-2">
		{#each statuses as s (s)}
			<button
				type="button"
				class={[
					'rounded-lg border px-2.5 py-1 text-xs',
					status === s ? 'border-brand-500 bg-brand-500 text-white' : 'border-border'
				]}
				onclick={() => (status = s)}
			>
				{s}
			</button>
		{/each}
	</div>
	<AutosaveIndicator {status} lastSaved="just now" />
</div>
