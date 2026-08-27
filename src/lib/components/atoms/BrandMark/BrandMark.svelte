<script lang="ts">
	import type { Snippet } from 'svelte';

	export type BrandMarkSize = 'sm' | 'md' | 'lg' | 'xl';

	interface BrandMarkProps {
		/** 1–2 letter mark, or provide children / logoSrc for a custom glyph */
		mark?: string;
		name?: string;
		/** Official logo image URL (SVG/PNG). Replaces initials / children. */
		logoSrc?: string;
		size?: BrandMarkSize;
		showName?: boolean;
		class?: string;
		children?: Snippet;
	}

	const {
		mark,
		name = 'Brand',
		logoSrc,
		size = 'md',
		showName = false,
		class: className = '',
		children
	}: BrandMarkProps = $props();

	const initials = $derived(
		(mark ?? name)
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((w) => w[0]?.toUpperCase() ?? '')
			.join('') || 'B'
	);

	const box: Record<BrandMarkSize, string> = {
		sm: 'h-7 w-7 text-[10px] rounded-lg',
		md: 'h-9 w-9 text-xs rounded-xl',
		lg: 'h-11 w-11 text-sm rounded-xl',
		xl: 'h-14 w-14 text-base rounded-2xl'
	};

	const nameSize: Record<BrandMarkSize, string> = {
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-lg',
		xl: 'text-xl'
	};
</script>

<span class={['inline-flex items-center gap-2.5', className]}>
	<span
		class={[
			'inline-flex shrink-0 items-center justify-center shadow-sm',
			logoSrc ? 'overflow-hidden bg-white' : 'bg-brand-500 font-bold tracking-tight text-white',
			box[size]
		]}
		aria-hidden={showName || !!name}
	>
		{#if logoSrc}
			<img src={logoSrc} alt="" class="h-[78%] w-[78%] object-contain" />
		{:else if children}
			{@render children()}
		{:else}
			{initials}
		{/if}
	</span>
	{#if showName}
		<span class={['font-semibold tracking-tight text-primary', nameSize[size]]}>{name}</span>
	{/if}
	{#if !showName}
		<span class="sr-only">{name}</span>
	{/if}
</span>
