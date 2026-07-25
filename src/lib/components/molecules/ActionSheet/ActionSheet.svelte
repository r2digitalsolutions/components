<script lang="ts">
	export type ActionSheetItemVariant = 'default' | 'destructive' | 'cancel';

	export interface ActionSheetItem {
		id: string;
		label: string;
		description?: string;
		variant?: ActionSheetItemVariant;
		disabled?: boolean;
	}

	interface ActionSheetProps {
		open?: boolean;
		title?: string;
		message?: string;
		actions?: ActionSheetItem[];
		cancelLabel?: string;
		class?: string;
		onselect?: (id: string) => void;
		onclose?: () => void;
	}

	let {
		open = $bindable(false),
		title,
		message,
		actions = [],
		cancelLabel = 'Cancel',
		class: className = '',
		onselect,
		onclose
	}: ActionSheetProps = $props();

	let dialogEl = $state<HTMLDialogElement | null>(null);

	$effect(() => {
		const el = dialogEl;
		if (!el) return;
		if (open && !el.open) el.showModal();
		if (!open && el.open) el.close();
	});

	function close() {
		open = false;
		onclose?.();
	}

	function select(id: string, disabled?: boolean) {
		if (disabled) return;
		onselect?.(id);
		close();
	}

	const tone: Record<ActionSheetItemVariant, string> = {
		default: 'text-primary',
		destructive: 'text-red-600 dark:text-red-400',
		cancel: 'text-secondary font-semibold'
	};
</script>

<dialog
	bind:this={dialogEl}
	class={[
		'm-0 mt-auto w-full max-w-none border-0 bg-transparent p-0 text-inherit backdrop:bg-black/40 open:flex open:flex-col',
		'mx-auto max-w-md pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]',
		className
	]}
	onclick={(e) => {
		if (e.target === dialogEl) close();
	}}
	onclose={() => {
		open = false;
	}}
>
	<div class="mx-3 mb-2 overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-xl">
		{#if title || message}
			<div class="border-b border-border px-4 py-3 text-center">
				{#if title}
					<p class="text-sm font-semibold text-primary">{title}</p>
				{/if}
				{#if message}
					<p class="mt-0.5 text-xs text-muted">{message}</p>
				{/if}
			</div>
		{/if}
		{#each actions as action (action.id)}
			<button
				type="button"
				class={[
					'flex w-full flex-col items-center gap-0.5 border-b border-border px-4 py-3.5 text-sm transition-colors last:border-b-0 hover:bg-surface-overlay disabled:opacity-40',
					tone[action.variant ?? 'default']
				]}
				disabled={action.disabled}
				onclick={() => select(action.id, action.disabled)}
			>
				<span class="font-medium">{action.label}</span>
				{#if action.description}
					<span class="text-xs text-muted">{action.description}</span>
				{/if}
			</button>
		{/each}
	</div>
	<button
		type="button"
		class="mx-3 rounded-2xl border border-border bg-surface-elevated px-4 py-3.5 text-sm font-semibold text-brand-600 shadow-lg dark:text-brand-400"
		onclick={close}
	>
		{cancelLabel}
	</button>
</dialog>
