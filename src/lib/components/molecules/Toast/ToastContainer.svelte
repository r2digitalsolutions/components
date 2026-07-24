<script lang="ts">
	import { toastStore, type ToastPosition } from './toast.svelte.js';
	import { fly, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	interface ToastContainerProps {
		position?: ToastPosition;
	}

	const { position = 'bottom-right' }: ToastContainerProps = $props();

	const positionClasses: Record<ToastPosition, string> = {
		'top-left': 'top-4 left-4 items-start',
		'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
		'top-right': 'top-4 right-4 items-end',
		'bottom-left': 'bottom-4 left-4 items-start',
		'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
		'bottom-right': 'bottom-4 right-4 items-end'
	};

	const isTop = $derived(position.startsWith('top'));

	const variantConfig = {
		default: {
			wrapper: 'bg-surface-elevated border-border text-primary',
			icon: null,
			iconClass: ''
		},
		success: {
			wrapper: 'bg-surface-elevated border-green-500/30',
			icon: `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>`,
			iconClass: 'text-green-500'
		},
		error: {
			wrapper: 'bg-surface-elevated border-red-500/30',
			icon: `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>`,
			iconClass: 'text-red-500'
		},
		warning: {
			wrapper: 'bg-surface-elevated border-amber-500/30',
			icon: `<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>`,
			iconClass: 'text-amber-500'
		},
		info: {
			wrapper: 'bg-surface-elevated border-sky-500/30',
			icon: `<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>`,
			iconClass: 'text-sky-500'
		}
	};
</script>

<div
	class={['fixed z-50 flex flex-col gap-2 pointer-events-none', positionClasses[position]]}
	aria-live="polite"
	aria-label="Notifications"
>
	{#each toastStore.toasts as toast (toast.id)}
		<div
			class="pointer-events-auto w-full max-w-sm"
			animate:flip={{ duration: 200 }}
			in:fly={{ y: isTop ? -10 : 10, duration: 250, opacity: 0 }}
			out:fade={{ duration: 200 }}
		>
			<div
				class={[
					'flex items-start gap-3 w-full rounded-xl border shadow-lg p-4 backdrop-blur-sm',
					variantConfig[toast.variant].wrapper
				]}
				role="alert"
			>
				{#if variantConfig[toast.variant].icon}
					<svg
						class={['h-5 w-5 shrink-0 mt-0.5', variantConfig[toast.variant].iconClass]}
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						{@html variantConfig[toast.variant].icon}
					</svg>
				{/if}

				<div class="flex-1 min-w-0">
					{#if toast.title}
						<p class="text-sm font-semibold text-primary mb-0.5">{toast.title}</p>
					{/if}
					<p class="text-sm text-secondary leading-relaxed">{toast.message}</p>
				</div>

				{#if toast.dismissible}
					<button
						type="button"
						onclick={() => toastStore.dismiss(toast.id)}
						class="shrink-0 text-muted hover:text-primary transition-colors rounded-md p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
						aria-label="Dismiss notification"
					>
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				{/if}
			</div>
		</div>
	{/each}
</div>
