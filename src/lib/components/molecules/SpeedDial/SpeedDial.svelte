<script module lang="ts">
	export type SpeedDialPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
	export type SpeedDialDirection = 'up' | 'down' | 'left' | 'right' | 'auto';
	export type SpeedDialLabels = 'hover' | 'always' | 'never';
	export type SpeedDialSize = 'sm' | 'md' | 'lg';
	export type SpeedDialVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
	export type SpeedDialIconName =
		| 'note'
		| 'upload'
		| 'invite'
		| 'edit'
		| 'share'
		| 'trash'
		| 'camera'
		| 'link'
		| 'mail'
		| 'image'
		| 'file'
		| 'copy'
		| 'search'
		| 'star';

	export interface SpeedDialAction {
		id: string;
		label: string;
		/** Built-in icon key */
		icon?: SpeedDialIconName;
		disabled?: boolean;
		variant?: 'default' | 'destructive';
		onclick?: () => void;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';

	interface SpeedDialProps {
		actions?: SpeedDialAction[];
		label?: string;
		/** Corner of the positioned parent / viewport */
		position?: SpeedDialPosition;
		/**
		 * Fan-out direction. `auto` derives from `position`
		 * (bottom → up, top → down).
		 */
		direction?: SpeedDialDirection;
		open?: boolean;
		placement?: 'fixed' | 'absolute';
		variant?: SpeedDialVariant;
		size?: SpeedDialSize;
		/** When to show action labels */
		showLabels?: SpeedDialLabels;
		/** Dimmed overlay behind the dial while open */
		backdrop?: boolean;
		closeOnAction?: boolean;
		closeOnOutsideClick?: boolean;
		closeOnEscape?: boolean;
		disabled?: boolean;
		class?: string;
		/** Main FAB icon (defaults to + that rotates when open) */
		children?: Snippet;
		ontoggle?: (open: boolean) => void;
		onaction?: (action: SpeedDialAction) => void;
	}

	let {
		actions = [],
		label = 'Open actions',
		position = 'bottom-right',
		direction = 'auto',
		open = $bindable(false),
		placement = 'absolute',
		variant = 'primary',
		size = 'lg',
		showLabels = 'hover',
		backdrop = false,
		closeOnAction = true,
		closeOnOutsideClick = true,
		closeOnEscape = true,
		disabled = false,
		class: className = '',
		children,
		ontoggle,
		onaction
	}: SpeedDialProps = $props();

	let rootEl = $state<HTMLDivElement | null>(null);

	const resolvedDirection = $derived.by((): Exclude<SpeedDialDirection, 'auto'> => {
		if (direction !== 'auto') return direction;
		return position.startsWith('top') ? 'down' : 'up';
	});

	const isVertical = $derived(
		resolvedDirection === 'up' || resolvedDirection === 'down'
	);

	const corners: Record<SpeedDialPosition, string> = {
		'bottom-right': 'bottom-4 right-4',
		'bottom-left': 'bottom-4 left-4',
		'top-right': 'top-4 right-4',
		'top-left': 'top-4 left-4'
	};

	const stackClass = $derived(
		{
			up: 'flex-col-reverse items-center',
			down: 'flex-col items-center',
			left: 'flex-row-reverse items-end',
			right: 'flex-row items-end'
		}[resolvedDirection]
	);

	const labelSide = $derived.by(() => {
		if (!isVertical) return 'none' as const;
		return position.endsWith('right') ? ('left' as const) : ('right' as const);
	});

	const actionSize = $derived(
		size === 'sm' ? 'h-9 w-9' : size === 'md' ? 'h-10 w-10' : 'h-11 w-11'
	);

	const iconPx = $derived(size === 'sm' ? 'h-4 w-4' : 'h-[1.125rem] w-[1.125rem]');

	function setOpen(next: boolean) {
		if (disabled && next) return;
		open = next;
		ontoggle?.(next);
	}

	function toggle() {
		if (disabled) return;
		setOpen(!open);
	}

	function close() {
		if (!open) return;
		setOpen(false);
	}

	function run(action: SpeedDialAction) {
		if (action.disabled) return;
		action.onclick?.();
		onaction?.(action);
		if (closeOnAction) close();
	}

	function onWindowKeydown(e: KeyboardEvent) {
		if (!open || !closeOnEscape) return;
		if (e.key === 'Escape') {
			e.preventDefault();
			close();
		}
	}

	function onWindowPointerDown(e: PointerEvent) {
		if (!open || !closeOnOutsideClick || !rootEl) return;
		const t = e.target as Node;
		if (rootEl.contains(t)) return;
		close();
	}

	const iconPaths: Record<SpeedDialIconName, string> = {
		note: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
		upload:
			'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
		invite:
			'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
		edit: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
		share:
			'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z',
		trash:
			'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
		camera:
			'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z',
		link: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
		mail: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
		image:
			'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
		file: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
		copy: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z',
		search:
			'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
		star: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
	};
</script>

<svelte:window onkeydown={onWindowKeydown} onpointerdown={onWindowPointerDown} />

{#if backdrop && open}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div
		class={[
			'z-30 bg-black/30 backdrop-blur-[1px] transition-opacity',
			placement === 'fixed' ? 'fixed inset-0' : 'absolute inset-0'
		]}
		onclick={close}
		aria-hidden="true"
	></div>
{/if}

<div
	bind:this={rootEl}
	class={['z-40 flex gap-2.5', placement, corners[position], stackClass, className]}
>
	{#if open}
		{#each actions as action, i (action.id)}
			<button
				type="button"
				class={[
					'group/action speed-dial-action flex items-center gap-2',
					isVertical ? 'flex-row' : 'flex-col-reverse',
					action.disabled && 'pointer-events-none opacity-40'
				]}
				style:animation-delay={`${i * 35}ms`}
				disabled={action.disabled}
				aria-label={action.label}
				onclick={() => run(action)}
			>
				{#if showLabels !== 'never' && labelSide === 'left'}
					<span
						class={[
							'whitespace-nowrap rounded-md bg-surface-elevated px-2 py-1 text-xs font-medium text-primary shadow-sm ring-1 ring-border transition-opacity',
							showLabels === 'always'
								? 'opacity-100'
								: 'pointer-events-none opacity-0 group-hover/action:opacity-100 group-focus-visible/action:opacity-100'
						]}
					>
						{action.label}
					</span>
				{/if}

				<span
					class={[
						'inline-flex shrink-0 items-center justify-center rounded-full border shadow-md transition-colors',
						actionSize,
						action.variant === 'destructive'
							? 'border-red-500/30 bg-red-500 text-white hover:bg-red-600'
							: 'border-border bg-surface-elevated text-secondary hover:border-border-strong hover:text-primary'
					]}
					aria-hidden="true"
				>
					{#if action.icon && iconPaths[action.icon]}
						<svg
							class={iconPx}
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d={iconPaths[action.icon]} />
						</svg>
					{:else}
						<span class="h-1.5 w-1.5 rounded-full bg-current"></span>
					{/if}
				</span>

				{#if showLabels !== 'never' && labelSide === 'right'}
					<span
						class={[
							'whitespace-nowrap rounded-md bg-surface-elevated px-2 py-1 text-xs font-medium text-primary shadow-sm ring-1 ring-border transition-opacity',
							showLabels === 'always'
								? 'opacity-100'
								: 'pointer-events-none opacity-0 group-hover/action:opacity-100 group-focus-visible/action:opacity-100'
						]}
					>
						{action.label}
					</span>
				{/if}

				{#if showLabels !== 'never' && !isVertical}
					<span
						class={[
							'max-w-[7rem] truncate rounded-md bg-surface-elevated px-2 py-1 text-center text-[11px] font-medium text-primary shadow-sm ring-1 ring-border transition-opacity',
							showLabels === 'always'
								? 'opacity-100'
								: 'pointer-events-none absolute bottom-full mb-1.5 opacity-0 group-hover/action:opacity-100 group-focus-visible/action:opacity-100'
						]}
					>
						{action.label}
					</span>
				{/if}
			</button>
		{/each}
	{/if}

	<IconButton
		{label}
		{variant}
		{size}
		{disabled}
		rounded
		aria-expanded={open}
		aria-haspopup="menu"
		class="shadow-lg shadow-black/10 dark:shadow-black/40"
		onclick={toggle}
	>
		{#if children}
			{@render children()}
		{:else}
			<svg
				class={['h-5 w-5 transition-transform duration-200', open && 'rotate-45']}
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

<style>
	.speed-dial-action {
		position: relative;
		animation: speed-dial-in 180ms cubic-bezier(0.32, 0.72, 0, 1) both;
	}

	@keyframes speed-dial-in {
		from {
			opacity: 0;
			transform: scale(0.7);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.speed-dial-action {
			animation: none;
		}
	}
</style>
