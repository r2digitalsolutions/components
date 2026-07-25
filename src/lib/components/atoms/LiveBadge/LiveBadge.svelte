<script lang="ts">
	interface LiveBadgeProps {
		live?: boolean;
		label?: string;
		offlineLabel?: string;
		pulse?: boolean;
		size?: 'sm' | 'md';
		class?: string;
	}

	const {
		live = true,
		label = 'Live',
		offlineLabel = 'Offline',
		pulse = true,
		size = 'sm',
		class: className = ''
	}: LiveBadgeProps = $props();

	const sizes = {
		sm: 'px-2 py-0.5 text-[10px] gap-1.5',
		md: 'px-2.5 py-1 text-xs gap-2'
	};

	const dot = {
		sm: 'h-1.5 w-1.5',
		md: 'h-2 w-2'
	};

	const text = $derived(live ? label : offlineLabel);
</script>

<span
	class={[
		'inline-flex items-center rounded-full font-semibold uppercase tracking-wide',
		live
			? 'bg-red-500/10 text-red-600 ring-1 ring-inset ring-red-500/25 dark:text-red-400'
			: 'bg-surface-overlay text-muted ring-1 ring-inset ring-border',
		sizes[size],
		className
	]}
	role="status"
	aria-label={text}
>
	<span class="relative inline-flex shrink-0">
		<span
			class={['rounded-full', live ? 'bg-red-500' : 'bg-zinc-400', dot[size]]}
			aria-hidden="true"
		></span>
		{#if live && pulse}
			<span
				class={['absolute inset-0 animate-ping rounded-full bg-red-500 opacity-60', dot[size]]}
				aria-hidden="true"
			></span>
		{/if}
	</span>
	{text}
</span>
