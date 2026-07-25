<script lang="ts">
	import type { Snippet } from 'svelte';
	import Info from '@lucide/svelte/icons/info';
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import CircleAlert from '@lucide/svelte/icons/circle-alert';
	import X from '@lucide/svelte/icons/x';

	export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

	/** Extensible list entry for structured alert details */
	export interface AlertItem {
		text: string;
		id?: string;
	}

	interface AlertProps {
		variant?: AlertVariant;
		title?: string;
		message?: string;
		items?: AlertItem[];
		dismissible?: boolean;
		showIcon?: boolean;
		class?: string;
		children?: Snippet;
		ondismiss?: () => void;
	}

	let {
		variant = 'info',
		title,
		message,
		items = [],
		dismissible = false,
		showIcon = true,
		class: className = '',
		children,
		ondismiss
	}: AlertProps = $props();

	let dismissed = $state(false);

	const hasItems = $derived(items.length > 0);

	const shell: Record<AlertVariant, string> = {
		info: 'border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-800/70 dark:bg-sky-950/45 dark:text-sky-50',
		success:
			'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-800/70 dark:bg-emerald-950/45 dark:text-emerald-50',
		warning:
			'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-800/70 dark:bg-amber-950/45 dark:text-amber-50',
		error:
			'border-red-200 bg-red-50 text-red-950 dark:border-red-800/70 dark:bg-red-950/45 dark:text-red-50'
	};

	const accent: Record<AlertVariant, string> = {
		info: 'bg-sky-500',
		success: 'bg-emerald-500',
		warning: 'bg-amber-500',
		error: 'bg-red-500'
	};

	const iconTone: Record<AlertVariant, string> = {
		info: 'text-sky-600 dark:text-sky-400',
		success: 'text-emerald-600 dark:text-emerald-400',
		warning: 'text-amber-600 dark:text-amber-400',
		error: 'text-red-600 dark:text-red-400'
	};

	const muted: Record<AlertVariant, string> = {
		info: 'text-sky-800/80 dark:text-sky-100/75',
		success: 'text-emerald-800/80 dark:text-emerald-100/75',
		warning: 'text-amber-900/80 dark:text-amber-100/75',
		error: 'text-red-800/80 dark:text-red-100/75'
	};

	function handleDismiss() {
		dismissed = true;
		ondismiss?.();
	}
</script>

{#if !dismissed}
	<div
		class={[
			'relative flex w-full items-start gap-3 overflow-hidden rounded-xl border px-4 py-3.5',
			shell[variant],
			className
		]}
		role="alert"
	>
		<span class={['absolute inset-y-0 left-0 w-1', accent[variant]]} aria-hidden="true"></span>

		{#if showIcon}
			<span class={['mt-0.5 shrink-0', iconTone[variant]]} aria-hidden="true">
				{#if variant === 'success'}
					<CircleCheck class="h-5 w-5" />
				{:else if variant === 'warning'}
					<TriangleAlert class="h-5 w-5" />
				{:else if variant === 'error'}
					<CircleAlert class="h-5 w-5" />
				{:else}
					<Info class="h-5 w-5" />
				{/if}
			</span>
		{/if}

		<div class="min-w-0 flex-1">
			{#if title}
				<h4 class="m-0 text-sm font-semibold leading-snug">{title}</h4>
			{/if}
			{#if message}
				<p class={['m-0 text-[13px] leading-relaxed', title ? 'mt-1' : '', muted[variant]]}>
					{message}
				</p>
			{/if}
			{#if hasItems}
				<ul
					class={[
						'm-0 list-disc space-y-1 pl-4 text-[13px] leading-relaxed',
						muted[variant],
						message || title ? 'mt-2' : ''
					]}
				>
					{#each items as item, index (item.id ?? index)}
						<li>{item.text}</li>
					{/each}
				</ul>
			{/if}
			{@render children?.()}
		</div>

		{#if dismissible}
			<button
				type="button"
				onclick={handleDismiss}
				class={[
					'-mr-1 -mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors',
					muted[variant],
					'hover:bg-black/5 hover:text-current dark:hover:bg-white/10'
				]}
				aria-label="Dismiss alert"
			>
				<X class="h-4 w-4" aria-hidden="true" />
			</button>
		{/if}
	</div>
{/if}
