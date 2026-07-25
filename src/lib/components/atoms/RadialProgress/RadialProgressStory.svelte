<script lang="ts">
	import RadialProgress from './RadialProgress.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	let value = $state(68);
	let seconds = $state(12);
</script>

<div class="flex flex-wrap items-end gap-8">
	<div class="text-center">
		<RadialProgress {value} />
		<Text size="xs" tone="muted" class="mt-2">Progress</Text>
	</div>
	<div class="text-center">
		<RadialProgress value={90 - seconds} max={90} warnBelow={10} size={100} strokeWidth={7}>
			<span class="text-xl font-bold tabular-nums text-primary">{seconds}s</span>
		</RadialProgress>
		<Text size="xs" tone="muted" class="mt-2">Rest timer</Text>
		<button
			type="button"
			class="mt-2 text-xs font-medium text-brand-600 hover:underline"
			onclick={() => (seconds = Math.max(0, seconds - 1))}
		>
			−1s
		</button>
	</div>
	<label class="flex flex-col gap-1 text-xs text-secondary">
		Value
		<input type="range" min="0" max="100" bind:value class="w-32" />
	</label>
</div>
