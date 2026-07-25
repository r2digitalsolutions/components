<script lang="ts">
	interface HomeIndicatorProps {
		tone?: 'light' | 'dark' | 'auto';
		class?: string;
	}

	const { tone = 'auto', class: className = '' }: HomeIndicatorProps = $props();

	const bar = $derived(
		tone === 'light'
			? 'bg-white/80'
			: tone === 'dark'
				? 'bg-zinc-900/80'
				: 'bg-primary/25 dark:bg-white/30'
	);
</script>

<div
	class={['flex w-full justify-center pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-1', className]}
	aria-hidden="true"
>
	<span class={['h-1 w-[34%] max-w-32 rounded-full', bar]}></span>
</div>
