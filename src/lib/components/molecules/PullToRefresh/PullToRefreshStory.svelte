<script lang="ts">
	import PullToRefresh from './PullToRefresh.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	let refreshing = $state(false);
	let stamp = $state(new Date().toLocaleTimeString());

	function refresh() {
		refreshing = true;
		setTimeout(() => {
			stamp = new Date().toLocaleTimeString();
			refreshing = false;
		}, 900);
	}
</script>

<div class="space-y-2">
	<Text size="xs" tone="muted">On touch devices, pull down. Or simulate:</Text>
	<Button size="xs" variant="secondary" onclick={refresh} disabled={refreshing}>
		Simulate refresh
	</Button>
	<div class="h-56 max-w-sm overflow-hidden rounded-xl border border-border">
		<PullToRefresh {refreshing} onrefresh={refresh} class="h-full">
			<ul class="divide-y divide-border p-1">
				{#each [1, 2, 3, 4, 5, 6] as n}
					<li class="px-3 py-3 text-sm text-primary">Feed item {n} · {stamp}</li>
				{/each}
			</ul>
		</PullToRefresh>
	</div>
</div>
