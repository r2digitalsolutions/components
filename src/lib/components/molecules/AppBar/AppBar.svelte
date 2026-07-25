<script lang="ts">
	import type { Snippet } from 'svelte';
	import HamburgerButton from '$lib/components/atoms/HamburgerButton/HamburgerButton.svelte';

	export type AppBarVariant = 'solid' | 'transparent' | 'blur';

	interface AppBarProps {
		title?: string;
		subtitle?: string;
		variant?: AppBarVariant;
		elevated?: boolean;
		sticky?: boolean;
		showMenu?: boolean;
		menuOpen?: boolean;
		safeTop?: boolean;
		class?: string;
		leading?: Snippet;
		trailing?: Snippet;
		onmenu?: (open: boolean) => void;
		onback?: () => void;
		showBack?: boolean;
	}

	let {
		title = '',
		subtitle,
		variant = 'solid',
		elevated = true,
		sticky = true,
		showMenu = false,
		menuOpen = $bindable(false),
		safeTop = true,
		class: className = '',
		leading,
		trailing,
		onmenu,
		onback,
		showBack = false
	}: AppBarProps = $props();

	const surface = {
		solid: 'bg-surface-elevated',
		transparent: 'bg-transparent',
		blur: 'bg-surface-elevated/80 backdrop-blur-xl'
	};
</script>

<header
	class={[
		'z-40 w-full border-b border-border',
		sticky && 'sticky top-0',
		elevated && variant !== 'transparent' && 'shadow-sm',
		surface[variant],
		safeTop &&
			'pt-[max(env(safe-area-inset-top,0px),var(--phone-safe-top,0px))]',
		className
	]}
>
	<div class="flex h-14 items-center gap-2 px-3">
		{#if leading}
			{@render leading()}
		{:else if showMenu}
			<HamburgerButton
				bind:open={menuOpen}
				onchange={(o) => onmenu?.(o)}
			/>
		{:else if showBack}
			<button
				type="button"
				class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-primary hover:bg-surface-overlay"
				aria-label="Back"
				onclick={() => onback?.()}
			>
				<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
			</button>
		{/if}

		<div class="min-w-0 flex-1">
			{#if title}
				<p class="truncate text-base font-semibold tracking-tight text-primary">{title}</p>
			{/if}
			{#if subtitle}
				<p class="truncate text-xs text-muted">{subtitle}</p>
			{/if}
		</div>

		{#if trailing}
			<div class="flex shrink-0 items-center gap-1">
				{@render trailing()}
			</div>
		{/if}
	</div>
</header>
