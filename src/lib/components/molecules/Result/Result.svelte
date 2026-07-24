<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	type ResultStatus = 'success' | 'error' | 'info' | 'warning' | 'empty';

	interface ResultProps {
		status?: ResultStatus;
		title?: string;
		description?: string;
		class?: string;
		icon?: Snippet;
		extra?: Snippet;
		primaryAction?: { label: string; onclick?: () => void };
		secondaryAction?: { label: string; onclick?: () => void };
	}

	let {
		status = 'success',
		title = 'Operation successful',
		description = 'Your changes have been saved.',
		class: className = '',
		icon,
		extra,
		primaryAction,
		secondaryAction
	}: ResultProps = $props();

	const tones: Record<ResultStatus, string> = {
		success: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
		error: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
		info: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400',
		warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
		empty: 'bg-surface-overlay text-secondary border border-border'
	};
</script>

<div class={['flex w-full flex-col items-center justify-center px-6 py-10 text-center', className]}>
	<div
		class={[
			'mb-4 flex h-14 w-14 items-center justify-center rounded-2xl',
			tones[status]
		]}
	>
		{#if icon}
			{@render icon()}
		{:else if status === 'success'}
			<svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
			</svg>
		{:else if status === 'error'}
			<svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		{:else if status === 'warning'}
			<svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
				/>
			</svg>
		{:else if status === 'empty'}
			<svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
				/>
			</svg>
		{:else}
			<svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
				/>
			</svg>
		{/if}
	</div>

	<h3 class="text-lg font-semibold text-primary">{title}</h3>
	{#if description}
		<p class="mt-1 max-w-md text-sm text-muted leading-relaxed">{description}</p>
	{/if}

	{#if primaryAction || secondaryAction}
		<div class="mt-5 flex flex-wrap items-center justify-center gap-2">
			{#if primaryAction}
				<Button size="sm" onclick={() => primaryAction.onclick?.()}>{primaryAction.label}</Button>
			{/if}
			{#if secondaryAction}
				<Button size="sm" variant="secondary" onclick={() => secondaryAction.onclick?.()}>
					{secondaryAction.label}
				</Button>
			{/if}
		</div>
	{/if}

	{#if extra}
		<div class="mt-4">
			{@render extra()}
		</div>
	{/if}
</div>
