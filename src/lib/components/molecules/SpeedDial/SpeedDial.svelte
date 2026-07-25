<script lang="ts">
	import type { Snippet } from 'svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';

	export interface SpeedDialAction {
		id: string;
		label: string;
		icon?: Snippet;
		onclick?: () => void;
	}

	type FloatPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

	interface SpeedDialProps {
		actions?: SpeedDialAction[];
		label?: string;
		position?: FloatPosition;
		open?: boolean;
		placement?: 'fixed' | 'absolute';
		class?: string;
		children?: Snippet;
		ontoggle?: (open: boolean) => void;
	}

	let {
		actions = [],
		label = 'Open actions',
		position = 'bottom-right',
		open = $bindable(false),
		placement = 'absolute',
		class: className = '',
		children,
		ontoggle
	}: SpeedDialProps = $props();

	const corners: Record<FloatPosition, string> = {
		'bottom-right': 'bottom-4 right-4 items-end',
		'bottom-left': 'bottom-4 left-4 items-start',
		'top-right': 'top-4 right-4 items-end',
		'top-left': 'top-4 left-4 items-start'
	};

	const stackDir = $derived(
		position.startsWith('top') ? 'flex-col-reverse' : 'flex-col'
	);

	function toggle() {
		open = !open;
		ontoggle?.(open);
	}

	function run(action: SpeedDialAction) {
		action.onclick?.();
		open = false;
		ontoggle?.(false);
	}
</script>

<div class={['z-40 flex gap-2', placement, corners[position], stackDir, className]}>
	{#if open}
		{#each actions as action (action.id)}
			<button
				type="button"
				class="group flex items-center gap-2"
				onclick={() => run(action)}
			>
				{#if position.endsWith('right')}
					<span
						class="rounded-md bg-surface-elevated px-2 py-1 text-xs font-medium text-primary opacity-0 shadow-sm ring-1 ring-border transition-opacity group-hover:opacity-100"
					>
						{action.label}
					</span>
				{/if}
				<span
					class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-elevated text-secondary shadow-md hover:text-primary"
					aria-hidden="true"
				>
					{#if action.icon}
						{@render action.icon()}
					{:else}
						<span class="h-1.5 w-1.5 rounded-full bg-current"></span>
					{/if}
				</span>
				{#if position.endsWith('left')}
					<span
						class="rounded-md bg-surface-elevated px-2 py-1 text-xs font-medium text-primary opacity-0 shadow-sm ring-1 ring-border transition-opacity group-hover:opacity-100"
					>
						{action.label}
					</span>
				{/if}
			</button>
		{/each}
	{/if}

	<IconButton
		{label}
		variant="primary"
		size="lg"
		rounded
		aria-expanded={open}
		class="shadow-lg"
		onclick={toggle}
	>
		{#if children}
			{@render children()}
		{:else}
			<svg
				class={['h-5 w-5 transition-transform', open && 'rotate-45']}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				aria-hidden="true"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
			</svg>
		{/if}
	</IconButton>
</div>
