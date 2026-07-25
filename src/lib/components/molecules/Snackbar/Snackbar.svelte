<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import X from '@lucide/svelte/icons/x';
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import CircleAlert from '@lucide/svelte/icons/circle-alert';
	import Info from '@lucide/svelte/icons/info';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';

	export type SnackbarPosition =
		| 'bottom'
		| 'top'
		| 'bottom-left'
		| 'bottom-right'
		| 'top-left'
		| 'top-right';

	export type SnackbarVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

	interface SnackbarProps {
		open?: boolean;
		message?: string;
		title?: string;
		actionLabel?: string;
		duration?: number;
		position?: SnackbarPosition;
		variant?: SnackbarVariant;
		dismissible?: boolean;
		showIcon?: boolean;
		class?: string;
		children?: Snippet;
		onaction?: () => void;
		onclose?: () => void;
	}

	let {
		open = $bindable(false),
		message = '',
		title,
		actionLabel,
		duration = 4000,
		position = 'bottom',
		variant = 'default',
		dismissible = true,
		showIcon = true,
		class: className = '',
		children,
		onaction,
		onclose
	}: SnackbarProps = $props();

	let timer: ReturnType<typeof setTimeout> | undefined;

	const positionClass: Record<SnackbarPosition, string> = {
		bottom: 'bottom-[max(1rem,env(safe-area-inset-bottom))] inset-x-0 justify-center',
		top: 'top-[max(1rem,env(safe-area-inset-top))] inset-x-0 justify-center',
		'bottom-left': 'bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 justify-start',
		'bottom-right': 'bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 justify-end',
		'top-left': 'top-[max(1rem,env(safe-area-inset-top))] left-4 justify-start',
		'top-right': 'top-[max(1rem,env(safe-area-inset-top))] right-4 justify-end'
	};

	const shell: Record<SnackbarVariant, string> = {
		default:
			'border-border bg-surface-elevated text-primary shadow-lg ring-1 ring-black/5 dark:ring-white/10',
		success:
			'border-emerald-200/80 bg-emerald-50 text-emerald-950 shadow-lg dark:border-emerald-800/60 dark:bg-emerald-950/90 dark:text-emerald-50',
		error:
			'border-red-200/80 bg-red-50 text-red-950 shadow-lg dark:border-red-800/60 dark:bg-red-950/90 dark:text-red-50',
		warning:
			'border-amber-200/80 bg-amber-50 text-amber-950 shadow-lg dark:border-amber-800/60 dark:bg-amber-950/90 dark:text-amber-50',
		info: 'border-sky-200/80 bg-sky-50 text-sky-950 shadow-lg dark:border-sky-800/60 dark:bg-sky-950/90 dark:text-sky-50'
	};

	const iconTone: Record<SnackbarVariant, string> = {
		default: 'text-muted',
		success: 'text-emerald-600 dark:text-emerald-400',
		error: 'text-red-600 dark:text-red-400',
		warning: 'text-amber-600 dark:text-amber-400',
		info: 'text-sky-600 dark:text-sky-400'
	};

	$effect(() => {
		if (!open) return;
		clearTimeout(timer);
		if (duration > 0) {
			timer = setTimeout(() => {
				open = false;
				onclose?.();
			}, duration);
		}
		return () => clearTimeout(timer);
	});

	function close() {
		open = false;
		onclose?.();
	}

	function action() {
		onaction?.();
		close();
	}
</script>

{#if open}
	<div
		class={[
			'pointer-events-none fixed z-[60] flex px-4',
			positionClass[position],
			className
		]}
		role="status"
		aria-live="polite"
	>
		<div
			class={[
				'pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border px-3.5 py-3 animate-in fade-in slide-in-from-bottom-2 duration-200',
				shell[variant]
			]}
		>
			{#if showIcon && variant !== 'default'}
				<span class={['mt-0.5 shrink-0', iconTone[variant]]} aria-hidden="true">
					{#if variant === 'success'}
						<CircleCheck class="h-5 w-5" />
					{:else if variant === 'error'}
						<CircleAlert class="h-5 w-5" />
					{:else if variant === 'warning'}
						<TriangleAlert class="h-5 w-5" />
					{:else}
						<Info class="h-5 w-5" />
					{/if}
				</span>
			{/if}

			<div class="min-w-0 flex-1 pt-0.5">
				{#if children}
					{@render children()}
				{:else}
					{#if title}
						<p class="text-sm font-semibold leading-5">{title}</p>
					{/if}
					{#if message}
						<p class={['text-sm leading-5', title ? 'mt-0.5 opacity-90' : '']}>{message}</p>
					{/if}
				{/if}
			</div>

			<div class="flex shrink-0 items-center gap-1">
				{#if actionLabel}
					<Button size="xs" variant="secondary" class="shadow-none" onclick={action}>
						{actionLabel}
					</Button>
				{/if}
				{#if dismissible}
					<button
						type="button"
						class="inline-flex h-7 w-7 items-center justify-center rounded-lg text-current/60 transition-colors hover:bg-black/5 hover:text-current dark:hover:bg-white/10"
						aria-label="Dismiss"
						onclick={close}
					>
						<X class="h-4 w-4" aria-hidden="true" />
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}
