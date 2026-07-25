<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	export type SnackbarPosition = 'bottom' | 'top';

	interface SnackbarProps {
		open?: boolean;
		message?: string;
		actionLabel?: string;
		duration?: number;
		position?: SnackbarPosition;
		class?: string;
		children?: Snippet;
		onaction?: () => void;
		onclose?: () => void;
	}

	let {
		open = $bindable(false),
		message = '',
		actionLabel,
		duration = 4000,
		position = 'bottom',
		class: className = '',
		children,
		onaction,
		onclose
	}: SnackbarProps = $props();

	let timer: ReturnType<typeof setTimeout> | undefined;

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

	function action() {
		onaction?.();
		open = false;
		onclose?.();
	}
</script>

{#if open}
	<div
		class={[
			'pointer-events-none fixed inset-x-0 z-[60] flex justify-center px-4',
			position === 'bottom'
				? 'bottom-[max(1rem,env(safe-area-inset-bottom,0px))]'
				: 'top-[max(1rem,env(safe-area-inset-top,0px))]',
			className
		]}
		role="status"
		aria-live="polite"
	>
		<div
			class="pointer-events-auto flex max-w-md items-center gap-3 rounded-xl bg-zinc-900 px-4 py-3 text-sm text-white shadow-xl dark:bg-zinc-100 dark:text-zinc-900"
		>
			<div class="min-w-0 flex-1">
				{#if children}
					{@render children()}
				{:else}
					{message}
				{/if}
			</div>
			{#if actionLabel}
				<Button size="xs" variant="ghost" class="shrink-0 text-brand-300 hover:bg-white/10 dark:text-brand-700" onclick={action}>
					{actionLabel}
				</Button>
			{/if}
		</div>
	</div>
{/if}
