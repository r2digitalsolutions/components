<script lang="ts">
	import SearchInput from '$lib/components/molecules/SearchInput/SearchInput.svelte';
	import CloseButton from '$lib/components/atoms/CloseButton/CloseButton.svelte';
	import type { Snippet } from 'svelte';

	interface SearchSheetProps {
		open?: boolean;
		query?: string;
		placeholder?: string;
		title?: string;
		class?: string;
		children?: Snippet;
		onclose?: () => void;
		onsearch?: (query: string) => void;
	}

	let {
		open = $bindable(false),
		query = $bindable(''),
		placeholder = 'Search…',
		title = 'Search',
		class: className = '',
		children,
		onclose,
		onsearch
	}: SearchSheetProps = $props();

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
</script>

<dialog
	bind:this={dialogEl}
	class={[
		'm-0 h-full w-full max-w-none border-0 bg-surface p-0 text-inherit backdrop:bg-black/40 open:flex open:flex-col',
		className
	]}
	onclose={() => {
		open = false;
	}}
>
	<div
		class="flex items-center gap-2 border-b border-border px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))]"
	>
		<div class="min-w-0 flex-1">
			<SearchInput
				bind:value={query}
				{placeholder}
				size="md"
				oninput={() => onsearch?.(query)}
				onsubmit={() => onsearch?.(query)}
			/>
		</div>
		<CloseButton onclick={close} />
	</div>
	<div class="min-h-0 flex-1 overflow-y-auto px-4 py-3">
		{#if !query}
			<p class="text-sm text-muted">{title}</p>
		{/if}
		{@render children?.()}
	</div>
</dialog>
