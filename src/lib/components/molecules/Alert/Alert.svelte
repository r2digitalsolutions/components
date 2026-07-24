<script lang="ts">
	import type { Snippet } from 'svelte';

	type AlertVariant = 'info' | 'success' | 'warning' | 'error';

	interface AlertProps {
		variant?: AlertVariant;
		title?: string;
		message?: string;
		dismissible?: boolean;
		class?: string;
		children?: Snippet;
		ondismiss?: () => void;
	}

	let {
		variant = 'info',
		title,
		message,
		dismissible = false,
		class: className = '',
		children,
		ondismiss
	}: AlertProps = $props();

	let dismissed = $state(false);

	const variantStyles: Record<AlertVariant, { wrapper: string; iconClass: string; svg: string }> = {
		info: {
			wrapper: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/50 text-sky-900 dark:text-sky-200',
			iconClass: 'text-sky-500',
			svg: `<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>`
		},
		success: {
			wrapper: 'bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800/50 text-green-900 dark:text-green-200',
			iconClass: 'text-green-500',
			svg: `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>`
		},
		warning: {
			wrapper: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200',
			iconClass: 'text-amber-500',
			svg: `<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>`
		},
		error: {
			wrapper: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/50 text-red-900 dark:text-red-200',
			iconClass: 'text-red-500',
			svg: `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>`
		}
	};

	function handleDismiss() {
		dismissed = true;
		ondismiss?.();
	}
</script>

{#if !dismissed}
	<div
		class={[
			'flex items-start gap-3 p-4 border rounded-xl shadow-xs transition-all duration-200 w-full',
			variantStyles[variant].wrapper,
			className
		]}
		role="alert"
	>
		<!-- Icon -->
		<svg
			class={['h-5 w-5 shrink-0 mt-0.5', variantStyles[variant].iconClass]}
			viewBox="0 0 20 20"
			fill="currentColor"
			aria-hidden="true"
		>
			{@html variantStyles[variant].svg}
		</svg>

		<div class="flex-1 min-w-0">
			{#if title}
				<h4 class="text-sm font-semibold mb-0.5">{title}</h4>
			{/if}
			{#if message}
				<p class="text-xs leading-relaxed opacity-90">{message}</p>
			{/if}
			{@render children?.()}
		</div>

		{#if dismissible}
			<button
				type="button"
				onclick={handleDismiss}
				class="shrink-0 opacity-60 hover:opacity-100 transition-opacity p-0.5 rounded"
				aria-label="Dismiss alert"
			>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		{/if}
	</div>
{/if}
