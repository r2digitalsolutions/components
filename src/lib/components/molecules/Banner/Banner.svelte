<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	interface BannerProps {
		title?: string;
		description?: string;
		variant?: 'info' | 'success' | 'warning' | 'error' | 'brand';
		dismissible?: boolean;
		actionLabel?: string;
		class?: string;
		children?: Snippet;
		ondismiss?: () => void;
		onaction?: () => void;
	}

	let {
		title = '',
		description = '',
		variant = 'info',
		dismissible = true,
		actionLabel,
		class: className = '',
		children,
		ondismiss,
		onaction
	}: BannerProps = $props();

	let open = $state(true);

	const tones: Record<string, string> = {
		info: 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-100',
		success:
			'border-green-200 bg-green-50 text-green-900 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-100',
		warning:
			'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100',
		error:
			'border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100',
		brand:
			'border-brand-200 bg-brand-50 text-brand-900 dark:border-brand-900/50 dark:bg-brand-950/40 dark:text-brand-100'
	};

	function dismiss() {
		open = false;
		ondismiss?.();
	}
</script>

{#if open}
	<div
		class={[
			'flex w-full items-start gap-3 rounded-xl border px-4 py-3',
			tones[variant],
			className
		]}
		role="status"
	>
		<div class="min-w-0 flex-1">
			{#if title}
				<p class="text-sm font-semibold">{title}</p>
			{/if}
			{#if description}
				<p class="mt-0.5 text-sm opacity-90">{description}</p>
			{/if}
			{#if children}
				<div class="mt-1 text-sm">{@render children()}</div>
			{/if}
		</div>
		<div class="flex shrink-0 items-center gap-2">
			{#if actionLabel}
				<Button size="xs" variant="secondary" onclick={() => onaction?.()}>{actionLabel}</Button>
			{/if}
			{#if dismissible}
				<button
					type="button"
					onclick={dismiss}
					class="rounded-lg p-1 opacity-70 hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
					aria-label="Dismiss"
				>
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			{/if}
		</div>
	</div>
{/if}
