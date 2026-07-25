<script lang="ts">
	import type { Snippet } from 'svelte';

	type CalloutTone = 'info' | 'success' | 'warning' | 'error' | 'neutral';

	interface CalloutProps {
		tone?: CalloutTone;
		title?: string;
		class?: string;
		icon?: Snippet;
		children?: Snippet;
		actions?: Snippet;
	}

	let {
		tone = 'info',
		title,
		class: className = '',
		icon,
		children,
		actions
	}: CalloutProps = $props();

	const tones: Record<CalloutTone, { wrap: string; icon: string }> = {
		info: {
			wrap: 'border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-100',
			icon: 'text-sky-600 dark:text-sky-400'
		},
		success: {
			wrap: 'border-green-200 bg-green-50 text-green-950 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-100',
			icon: 'text-green-600 dark:text-green-400'
		},
		warning: {
			wrap: 'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100',
			icon: 'text-amber-600 dark:text-amber-400'
		},
		error: {
			wrap: 'border-red-200 bg-red-50 text-red-950 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100',
			icon: 'text-red-600 dark:text-red-400'
		},
		neutral: {
			wrap: 'border-border bg-surface-overlay text-primary',
			icon: 'text-muted'
		}
	};
</script>

<aside
	class={['flex gap-3 rounded-xl border px-4 py-3', tones[tone].wrap, className]}
	role="note"
>
	<div class={['mt-0.5 shrink-0', tones[tone].icon]}>
		{#if icon}
			{@render icon()}
		{:else if tone === 'success'}
			<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		{:else if tone === 'warning'}
			<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
				/>
			</svg>
		{:else if tone === 'error'}
			<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM12 2a10 10 0 100 20 10 10 0 000-20z" />
			</svg>
		{:else}
			<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
				/>
			</svg>
		{/if}
	</div>

	<div class="min-w-0 flex-1 space-y-1">
		{#if title}
			<p class="text-sm font-semibold">{title}</p>
		{/if}
		{#if children}
			<div class="text-sm leading-relaxed opacity-90">
				{@render children()}
			</div>
		{/if}
		{#if actions}
			<div class="pt-1">
				{@render actions()}
			</div>
		{/if}
	</div>
</aside>
