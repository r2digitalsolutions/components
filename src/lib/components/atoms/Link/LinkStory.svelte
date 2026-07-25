<script lang="ts">
	import Link from './Link.svelte';

	let {
		variant = 'brand',
		size = 'md',
		external = true
	}: {
		variant?: 'default' | 'muted' | 'brand' | 'underline';
		size?: 'sm' | 'md' | 'lg';
		external?: boolean;
	} = $props();
</script>

<div class="flex flex-wrap items-center gap-4">
	<Link href="https://r2digisolutions.com" {variant} {size} {external}>
		Visit R2DigiSolutions
	</Link>
	<Link href="#docs" variant="underline" size="sm" external={false}>Documentation</Link>
	<Link href="#disabled" disabled={true}>Disabled link</Link>
</div>
