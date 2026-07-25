<script lang="ts">
	import Marquee from './Marquee.svelte';

	let props = $props<{ speed?: number }>();
</script>

<div class="w-full max-w-lg rounded-xl border border-border bg-surface-elevated py-3">
	<Marquee speed={props.speed ?? 20}>
		<span class="text-sm text-secondary">Ship faster with Atomic Design</span>
		<span class="text-sm text-secondary">•</span>
		<span class="text-sm text-secondary">Svelte 5 + Tailwind 4</span>
		<span class="text-sm text-secondary">•</span>
		<span class="text-sm text-secondary">Accessible by default</span>
		<span class="text-sm text-secondary">•</span>
	</Marquee>
</div>
