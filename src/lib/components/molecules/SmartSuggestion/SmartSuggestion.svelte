<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import X from '@lucide/svelte/icons/x';

	interface SmartSuggestionProps {
		title: string;
		body?: string;
		actionLabel?: string;
		dismissible?: boolean;
		class?: string;
		onaction?: () => void;
		ondismiss?: () => void;
	}

	let {
		title,
		body,
		actionLabel = 'Apply',
		dismissible = true,
		class: className = '',
		onaction,
		ondismiss
	}: SmartSuggestionProps = $props();
</script>

<aside
	class={[
		'relative flex gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-brand-950 dark:border-brand-900/50 dark:bg-brand-950/30 dark:text-brand-100',
		className
	]}
	role="note"
>
	<div class="mt-0.5 shrink-0 text-brand-600 dark:text-brand-400">
		<Sparkles class="h-5 w-5" strokeWidth={2} />
	</div>

	<div class="min-w-0 flex-1 space-y-2 pr-6">
		<p class="text-sm font-semibold">{title}</p>
		{#if body}
			<p class="text-sm leading-relaxed opacity-90">{body}</p>
		{/if}
		{#if onaction}
			<Button size="xs" variant="outline" onclick={() => onaction?.()}>
				{actionLabel}
			</Button>
		{/if}
	</div>

	{#if dismissible && ondismiss}
		<button
			type="button"
			class="absolute top-3 right-3 rounded-md p-1 text-brand-600/70 transition-colors hover:bg-brand-100 hover:text-brand-800 dark:text-brand-400 dark:hover:bg-brand-900/50 dark:hover:text-brand-200"
			aria-label="Dismiss suggestion"
			onclick={() => ondismiss?.()}
		>
			<X class="h-4 w-4" strokeWidth={2} />
		</button>
	{/if}
</aside>
