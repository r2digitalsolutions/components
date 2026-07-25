<script lang="ts">
	import type { Snippet } from 'svelte';
	import HomeIndicator from '$lib/components/atoms/HomeIndicator/HomeIndicator.svelte';

	export type PhoneFrameSize = 'sm' | 'md' | 'lg';

	interface PhoneFrameProps {
		size?: PhoneFrameSize;
		notch?: boolean;
		homeIndicator?: boolean;
		class?: string;
		children?: Snippet;
	}

	const {
		size = 'md',
		notch = true,
		homeIndicator = true,
		class: className = '',
		children
	}: PhoneFrameProps = $props();

	const dims: Record<PhoneFrameSize, string> = {
		sm: 'w-[240px] h-[480px]',
		md: 'w-[280px] h-[560px]',
		lg: 'w-[320px] h-[640px]'
	};
</script>

<div
	class={[
		'relative mx-auto overflow-hidden rounded-[2.25rem] border-[10px] border-zinc-900 bg-surface shadow-2xl dark:border-zinc-700',
		dims[size],
		className
	]}
>
	{#if notch}
		<div class="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center pt-2">
			<span class="h-5 w-24 rounded-full bg-zinc-900 dark:bg-zinc-950"></span>
		</div>
	{/if}
			<div class="relative flex h-full flex-col overflow-hidden bg-surface">
		<div class="flex min-h-0 flex-1 flex-col overflow-y-auto">
			{@render children?.()}
		</div>
		{#if homeIndicator}
			<HomeIndicator />
		{/if}
	</div>
</div>
