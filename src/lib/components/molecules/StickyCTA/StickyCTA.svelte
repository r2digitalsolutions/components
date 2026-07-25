<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import SafeArea from '$lib/components/atoms/SafeArea/SafeArea.svelte';

	interface StickyCTAProps {
		label?: string;
		secondaryLabel?: string;
		hint?: string;
		disabled?: boolean;
		loading?: boolean;
		blur?: boolean;
		/** Use absolute inside a framed demo / phone shell */
		placement?: 'fixed' | 'absolute';
		class?: string;
		leading?: Snippet;
		onprimary?: () => void;
		onsecondary?: () => void;
	}

	const {
		label = 'Continue',
		secondaryLabel,
		hint,
		disabled = false,
		loading = false,
		blur = true,
		placement = 'fixed',
		class: className = '',
		leading,
		onprimary,
		onsecondary
	}: StickyCTAProps = $props();
</script>

<div
	class={[
		'inset-x-0 bottom-0 z-40 border-t border-border',
		placement,
		blur ? 'bg-surface-elevated/90 backdrop-blur-xl' : 'bg-surface-elevated',
		className
	]}
>
	<SafeArea top={false} bottom class="px-4 pt-3">
		{#if hint}
			<p class="mb-2 text-center text-xs text-muted">{hint}</p>
		{/if}
		<div class="flex items-center gap-3">
			{#if leading}
				<div class="min-w-0 flex-1">
					{@render leading()}
				</div>
			{/if}
			{#if secondaryLabel}
				<Button variant="secondary" class="flex-1" {disabled} onclick={() => onsecondary?.()}>
					{secondaryLabel}
				</Button>
			{/if}
			<Button class="flex-1" {disabled} {loading} onclick={() => onprimary?.()}>
				{label}
			</Button>
		</div>
	</SafeArea>
</div>
