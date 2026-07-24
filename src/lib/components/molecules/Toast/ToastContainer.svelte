<script lang="ts">
	import { toastStore, type Toast, type ToastPosition } from './toast.svelte.js';
	import { fly, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	interface ToastContainerProps {
		position?: ToastPosition;
		class?: string;
	}

	const { position = 'bottom-right', class: className = '' }: ToastContainerProps = $props();

	let layerEl = $state<HTMLDivElement | null>(null);

	const isTop = $derived(position.startsWith('top'));
	const hasToasts = $derived(toastStore.toasts.length > 0);

	const positionStyle: Record<ToastPosition, string> = {
		'top-left': 'top:1rem;left:1rem;align-items:flex-start',
		'top-center': 'top:1rem;left:50%;transform:translateX(-50%);align-items:center',
		'top-right': 'top:1rem;right:1rem;align-items:flex-end',
		'bottom-left': 'bottom:1rem;left:1rem;align-items:flex-start',
		'bottom-center': 'bottom:1rem;left:50%;transform:translateX(-50%);align-items:center',
		'bottom-right': 'bottom:1rem;right:1rem;align-items:flex-end'
	};

	const tone = {
		default: {
			bar: 'bg-border-strong',
			iconWrap: 'bg-surface-overlay text-secondary',
			icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'
		},
		success: {
			bar: 'bg-green-500',
			iconWrap: 'bg-green-100 text-green-700 dark:bg-green-950/70 dark:text-green-300',
			icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zm-1.5 14.5l-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7z'
		},
		error: {
			bar: 'bg-red-500',
			iconWrap: 'bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300',
			icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zm1 11V7h-2v6h2zm0 4v-2h-2v2h2z'
		},
		warning: {
			bar: 'bg-amber-500',
			iconWrap: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300',
			icon: 'M12 2L1 21h22L12 2zm0 6l5.5 11h-11L12 8zm-1 4h2v4h-2v-4zm0 6h2v2h-2v-2z'
		},
		info: {
			bar: 'bg-sky-500',
			iconWrap: 'bg-sky-100 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300',
			icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'
		}
	} as const;

	const actionClass: Record<string, string> = {
		primary: 'bg-brand-600 text-white hover:bg-brand-700',
		secondary: 'border border-border bg-surface-elevated text-primary hover:bg-surface-overlay',
		ghost: 'text-secondary hover:bg-surface-overlay hover:text-primary',
		destructive: 'bg-red-600 text-white hover:bg-red-700'
	};

	$effect(() => {
		if (!layerEl) return;
		if (hasToasts) {
			if (!layerEl.matches(':popover-open')) layerEl.showPopover();
		} else if (layerEl.matches(':popover-open')) {
			layerEl.hidePopover();
		}
	});

	function runAction(toast: Toast, actionId: string) {
		const action = toast.actions?.find((a) => a.id === actionId);
		action?.onClick?.();
		if (action?.dismissOnClick !== false) toastStore.dismiss(toast.id);
	}
</script>

<!-- popover=manual → top layer, above dialogs/dropdowns; not light-dismissed -->
<div
	bind:this={layerEl}
	popover="manual"
	class={['toast-layer m-0 p-0 inset-auto border-0 bg-transparent shadow-none', className]}
	style={positionStyle[position]}
	aria-live="polite"
	aria-label="Notifications"
>
	<div class="flex w-[min(100vw-2rem,24rem)] flex-col gap-2.5">
		{#each toastStore.toasts as item (item.id)}
			<div
				class="pointer-events-auto w-full"
				animate:flip={{ duration: 200 }}
				in:fly={{ y: isTop ? -12 : 12, duration: 220, opacity: 0 }}
				out:fade={{ duration: 160 }}
			>
				{#if item.appearance === 'card'}
					<div
						class="overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-xl"
						role="status"
					>
						<div class={['h-1 w-full', tone[item.variant].bar]}></div>
						<div class="flex gap-3 p-4">
							<div
								class={['flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', tone[item.variant].iconWrap]}
								aria-hidden="true"
							>
								<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
									<path d={tone[item.variant].icon} />
								</svg>
							</div>
							<div class="min-w-0 flex-1">
								<div class="flex items-start justify-between gap-2">
									<div class="min-w-0">
										{#if item.title}
											<p class="text-sm font-semibold text-primary">{item.title}</p>
										{/if}
										<p class={['text-sm leading-relaxed text-secondary', item.title && 'mt-0.5']}>
											{item.message}
										</p>
									</div>
									{#if item.dismissible}
										<button
											type="button"
											onclick={() => toastStore.dismiss(item.id)}
											class="rounded-lg p-1 text-secondary transition hover:bg-surface-overlay hover:text-primary"
											aria-label="Dismiss"
										>
											<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
											</svg>
										</button>
									{/if}
								</div>

								{#if item.actions?.length}
									<div class="mt-3 flex flex-wrap gap-2">
										{#each item.actions as action (action.id)}
											<button
												type="button"
												onclick={() => runAction(item, action.id)}
												class={[
													'inline-flex items-center rounded-lg px-2.5 py-1.5 text-xs font-medium transition',
													actionClass[action.variant ?? 'secondary']
												]}
											>
												{action.label}
											</button>
										{/each}
									</div>
								{/if}
							</div>
						</div>
					</div>
				{:else}
					{@const isCompact =
						!item.actions?.length && !(item.title && item.message) && !item.pinned}
					<div
						class="relative overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-lg"
						role="status"
					>
						<div class={['absolute inset-y-0 left-0 w-1', tone[item.variant].bar]}></div>
						<div
							class={[
								'flex gap-3 py-3 pr-3 pl-4',
								isCompact ? 'items-center' : 'items-start'
							]}
						>
							<div
								class={[
									'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
									!isCompact && 'mt-0.5',
									tone[item.variant].iconWrap
								]}
								aria-hidden="true"
							>
								<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
									<path d={tone[item.variant].icon} />
								</svg>
							</div>

							<div class="min-w-0 flex-1">
								<div class={['flex gap-2', isCompact ? 'items-center' : 'items-start']}>
									<div class="min-w-0 flex-1">
										{#if item.title || item.pinned}
											<div class={['flex items-center gap-2', item.message && 'mb-0.5']}>
												{#if item.title}
													<p class="text-sm font-semibold text-primary">{item.title}</p>
												{/if}
												{#if item.pinned}
													<span
														class="rounded-md bg-surface-overlay px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary"
													>
														Pinned
													</span>
												{/if}
											</div>
										{/if}
										{#if item.message}
											<p class="text-sm leading-relaxed text-secondary">{item.message}</p>
										{/if}
									</div>

									{#if item.dismissible}
										<button
											type="button"
											onclick={() => toastStore.dismiss(item.id)}
											class="rounded-lg p-1 text-secondary transition hover:bg-surface-overlay hover:text-primary"
											aria-label="Dismiss"
										>
											<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
											</svg>
										</button>
									{/if}
								</div>

								{#if item.actions?.length}
									<div class="mt-2.5 flex flex-wrap gap-1.5">
										{#each item.actions as action (action.id)}
											<button
												type="button"
												onclick={() => runAction(item, action.id)}
												class={[
													'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium transition',
													actionClass[action.variant ?? 'ghost']
												]}
											>
												{action.label}
											</button>
										{/each}
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.toast-layer {
		position: fixed;
		width: max-content;
		max-width: calc(100vw - 2rem);
		overflow: visible;
		pointer-events: none;
	}

	.toast-layer:popover-open {
		display: block;
	}

	.toast-layer:not(:popover-open) {
		display: none;
	}
</style>
