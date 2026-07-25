<script lang="ts">
	import type { Snippet } from 'svelte';
	import CloseButton from '$lib/components/atoms/CloseButton/CloseButton.svelte';

	interface BottomSheetProps {
		open?: boolean;
		title?: string;
		/** Max height as CSS (default 70vh) */
		maxHeight?: string;
		closeOnBackdrop?: boolean;
		showHandle?: boolean;
		class?: string;
		children?: Snippet;
		footer?: Snippet;
		onclose?: () => void;
	}

	let {
		open = $bindable(false),
		title,
		maxHeight = '70vh',
		closeOnBackdrop = true,
		showHandle = true,
		class: className = '',
		children,
		footer,
		onclose
	}: BottomSheetProps = $props();

	function close() {
		open = false;
		onclose?.();
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			e.preventDefault();
			close();
		}
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[2px]"
		onclick={(e) => {
			if (closeOnBackdrop && e.target === e.currentTarget) close();
		}}
		role="presentation"
	>
		<div
			role="dialog"
			aria-modal="true"
			aria-label={title ?? 'Sheet'}
			class={[
				'flex w-full max-w-lg flex-col rounded-t-2xl border border-border border-b-0 bg-surface-elevated shadow-xl',
				'animate-[slideUp_180ms_ease-out]',
				className
			]}
			style:max-height={maxHeight}
		>
			{#if showHandle}
				<div class="flex justify-center pt-2.5 pb-1" aria-hidden="true">
					<span class="h-1 w-10 rounded-full bg-border-strong"></span>
				</div>
			{/if}

			{#if title}
				<div class="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
					<h2 class="text-sm font-semibold text-primary">{title}</h2>
					<CloseButton onclick={close} label="Close sheet" />
				</div>
			{/if}

			<div class="min-h-0 flex-1 overflow-y-auto px-4 py-3">
				{#if children}
					{@render children()}
				{/if}
			</div>

			{#if footer}
				<div class="border-t border-border px-4 py-3">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	@keyframes slideUp {
		from {
			transform: translateY(100%);
			opacity: 0.6;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>
