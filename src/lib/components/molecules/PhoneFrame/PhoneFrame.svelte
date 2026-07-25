<script lang="ts">
	import type { Snippet } from 'svelte';
	import HomeIndicator from '$lib/components/atoms/HomeIndicator/HomeIndicator.svelte';

	export type PhoneFrameSize = 'sm' | 'md' | 'lg';

	interface PhoneFrameProps {
		size?: PhoneFrameSize;
		notch?: boolean;
		homeIndicator?: boolean;
		/** Side volume / power buttons (phone silhouette) */
		buttons?: boolean;
		class?: string;
		children?: Snippet;
	}

	const {
		size = 'md',
		notch = true,
		homeIndicator = true,
		buttons = true,
		class: className = '',
		children
	}: PhoneFrameProps = $props();

	/** iPhone-like silhouette ~9∶19.5 + chassis radius per size */
	const dims: Record<PhoneFrameSize, string> = {
		sm: 'w-[260px] [--phone-r:2.2rem] [--phone-screen-r:1.55rem]',
		md: 'w-[300px] [--phone-r:2.55rem] [--phone-screen-r:1.85rem]',
		lg: 'w-[340px] [--phone-r:2.9rem] [--phone-screen-r:2.15rem]'
	};
</script>

<!--
  Phone silhouette: iPhone aspect, continuous chassis radius, bezel padding,
  clip-path screen, and --phone-safe-* so AppBar / SafeArea / nav inset correctly.
-->
<div
	class={[
		'phone-frame relative z-10 mx-auto box-border aspect-[9/19.5] overflow-visible',
		dims[size],
		className
	]}
	style:--phone-safe-top={notch ? '2.75rem' : '0.75rem'}
	style:--phone-safe-bottom={homeIndicator ? '1.35rem' : '0.5rem'}
>
	{#if buttons}
		<span
			class="pointer-events-none absolute -left-[3px] top-[18%] z-20 h-7 w-[3px] rounded-l-sm bg-zinc-800 dark:bg-zinc-700"
			aria-hidden="true"
		></span>
		<span
			class="pointer-events-none absolute -left-[3px] top-[26%] z-20 h-12 w-[3px] rounded-l-sm bg-zinc-800 dark:bg-zinc-700"
			aria-hidden="true"
		></span>
		<span
			class="pointer-events-none absolute -right-[3px] top-[24%] z-20 h-14 w-[3px] rounded-r-sm bg-zinc-800 dark:bg-zinc-700"
			aria-hidden="true"
		></span>
	{/if}

	<div
		class={[
			'phone-frame__chassis relative h-full w-full overflow-hidden rounded-[var(--phone-r)]',
			'bg-zinc-950 p-[10px] shadow-[0_28px_60px_-18px_rgba(0,0,0,0.55)]',
			'dark:bg-zinc-900'
		]}
	>
		<div class="phone-frame__screen relative flex h-full min-h-0 flex-col overflow-hidden bg-surface">
			{#if notch}
				<div
					class="pointer-events-none absolute inset-x-0 top-0 z-50 flex justify-center pt-2.5"
				>
					<span class="h-6 w-[6.75rem] rounded-full bg-zinc-950 dark:bg-black"></span>
				</div>
			{/if}

			<div class="relative z-0 flex min-h-0 flex-1 flex-col overflow-hidden">
				{@render children?.()}
			</div>

			{#if homeIndicator}
				<div
					class="pointer-events-none absolute inset-x-0 bottom-1 z-50 flex justify-center"
				>
					<HomeIndicator tone="dark" class="opacity-70" />
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.phone-frame__screen {
		border-radius: var(--phone-screen-r);
		clip-path: inset(0 round var(--phone-screen-r));
		-webkit-clip-path: inset(0 round var(--phone-screen-r));
		isolation: isolate;
		transform: translateZ(0);
	}
</style>
