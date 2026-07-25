<script lang="ts">
	import OfflineBanner from './OfflineBanner.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let {
		forced = false
	}: {
		forced?: boolean | null;
	} = $props();

	let localForced = $state<boolean | null>(forced);

	$effect(() => {
		localForced = forced;
	});
</script>

<div class="w-full max-w-2xl space-y-4 overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm">
	<OfflineBanner
		forced={localForced}
		sticky={false}
		onretry={() => {
			localForced = true;
		}}
	/>

	<div class="space-y-3 p-5">
		<div class="space-y-1">
			<p class="text-sm font-semibold text-primary">Offline banner</p>
			<p class="text-xs leading-relaxed text-secondary">
				Barra oscura sticky con ping. Al volver online muestra un flash verde de “reconnected”.
			</p>
		</div>

		<div class="flex flex-wrap gap-2">
			<Button size="sm" variant="secondary" onclick={() => (localForced = false)}>
				Go offline
			</Button>
			<Button size="sm" onclick={() => (localForced = true)}>Go online</Button>
		</div>

		<div class="rounded-xl border border-dashed border-border bg-surface px-4 py-8 text-center text-xs text-muted">
			App content
		</div>
	</div>
</div>
