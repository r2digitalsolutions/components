<script module lang="ts">
	let scrollLockCount = 0;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	type DrawerSide = 'left' | 'right' | 'top' | 'bottom';
	type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
	type DrawerMotion = 'idle' | 'open' | 'closing';

	interface DrawerProps {
		id?: string;
		open?: boolean;
		title?: string;
		description?: string;
		side?: DrawerSide;
		size?: DrawerSize;
		closeOnBackdrop?: boolean;
		closeOnEscape?: boolean;
		showClose?: boolean;
		blurBackdrop?: boolean;
		class?: string;
		children?: Snippet;
		footer?: Snippet;
		onclose?: () => void;
	}

	let {
		id = `drawer-${Math.random().toString(36).slice(2, 9)}`,
		open = $bindable(false),
		title,
		description,
		side = 'right',
		size = 'md',
		closeOnBackdrop = true,
		closeOnEscape = true,
		showClose = true,
		blurBackdrop = true,
		class: className = '',
		children,
		footer,
		onclose
	}: DrawerProps = $props();

	let dialogEl = $state<HTMLDialogElement | null>(null);
	let motion = $state<DrawerMotion>('idle');
	let closeFallbackTimer: ReturnType<typeof setTimeout> | null = null;
	let enterRaf = 0;

	const titleId = $derived(`${id}-title`);
	const descriptionId = $derived(`${id}-description`);
	const ANIM_MS = 280;

	const sizeClasses: Record<DrawerSide, Record<DrawerSize, string>> = {
		left: {
			sm: 'w-72 max-w-[90vw]',
			md: 'w-96 max-w-[90vw]',
			lg: 'w-[28rem] max-w-[92vw]',
			xl: 'w-[36rem] max-w-[94vw]',
			full: 'w-screen'
		},
		right: {
			sm: 'w-72 max-w-[90vw]',
			md: 'w-96 max-w-[90vw]',
			lg: 'w-[28rem] max-w-[92vw]',
			xl: 'w-[36rem] max-w-[94vw]',
			full: 'w-screen'
		},
		top: {
			sm: 'h-48 max-h-[80vh]',
			md: 'h-64 max-h-[80vh]',
			lg: 'h-80 max-h-[85vh]',
			xl: 'h-96 max-h-[90vh]',
			full: 'h-screen'
		},
		bottom: {
			sm: 'h-48 max-h-[80vh]',
			md: 'h-64 max-h-[80vh]',
			lg: 'h-80 max-h-[85vh]',
			xl: 'h-96 max-h-[90vh]',
			full: 'h-screen'
		}
	};

	const sidePanelClasses: Record<DrawerSide, string> = {
		left: 'h-full max-h-none rounded-none border-y-0 border-l-0',
		right: 'h-full max-h-none rounded-none border-y-0 border-r-0',
		top: 'w-full max-w-none rounded-none border-x-0 border-t-0',
		bottom: 'w-full max-w-none rounded-none border-x-0 border-b-0'
	};

	$effect(() => {
		if (!dialogEl) return;

		if (open) {
			clearCloseFallback();
			cancelEnterRaf();

			if (!dialogEl.open) {
				// Paint off-screen first, then transition in (avoids skipped enter on <dialog>)
				motion = 'idle';
				dialogEl.showModal();
				enterRaf = requestAnimationFrame(() => {
					enterRaf = requestAnimationFrame(() => {
						if (open) motion = 'open';
					});
				});
			} else if (motion !== 'open') {
				motion = 'open';
			}
			return;
		}

		if (dialogEl.open && motion !== 'closing') {
			startClosing();
		}
	});

	$effect(() => {
		const locked = open || motion === 'closing';
		if (!locked || typeof document === 'undefined') return;

		scrollLockCount += 1;
		if (scrollLockCount === 1) {
			const scrollbar = window.innerWidth - document.documentElement.clientWidth;
			document.documentElement.style.overflow = 'hidden';
			document.body.style.overflow = 'hidden';
			if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
		}

		return () => {
			scrollLockCount = Math.max(0, scrollLockCount - 1);
			if (scrollLockCount === 0) {
				document.documentElement.style.overflow = '';
				document.body.style.overflow = '';
				document.body.style.paddingRight = '';
			}
		};
	});

	function cancelEnterRaf() {
		if (enterRaf) {
			cancelAnimationFrame(enterRaf);
			enterRaf = 0;
		}
	}

	function clearCloseFallback() {
		if (closeFallbackTimer !== null) {
			clearTimeout(closeFallbackTimer);
			closeFallbackTimer = null;
		}
	}

	function startClosing() {
		if (motion === 'closing' || !dialogEl?.open) return;
		cancelEnterRaf();
		motion = 'closing';
		clearCloseFallback();
		closeFallbackTimer = setTimeout(finishClose, ANIM_MS + 40);
	}

	function finishClose() {
		if (motion !== 'closing') return;
		clearCloseFallback();
		motion = 'idle';
		if (dialogEl?.open) dialogEl.close();
	}

	function close() {
		if (!dialogEl?.open || motion === 'closing' || !open) return;
		open = false;
		onclose?.();
	}

	function handleDialogClose() {
		cancelEnterRaf();
		clearCloseFallback();
		motion = 'idle';
		if (open) {
			open = false;
			onclose?.();
		}
	}

	function handleCancelEvent(event: Event) {
		event.preventDefault();
		if (!closeOnEscape) return;
		close();
	}

	function handleBackdropClick(event: MouseEvent) {
		if (!closeOnBackdrop || event.target !== dialogEl) return;
		close();
	}

	function handlePanelTransitionEnd(event: TransitionEvent) {
		if (event.target !== event.currentTarget) return;
		if (event.propertyName !== 'transform') return;
		if (motion !== 'closing') return;
		finishClose();
	}
</script>

<dialog
	bind:this={dialogEl}
	id={id}
	data-side={side}
	data-motion={motion}
	aria-labelledby={title ? titleId : undefined}
	aria-describedby={description ? descriptionId : undefined}
	onclose={handleDialogClose}
	oncancel={handleCancelEvent}
	onclick={handleBackdropClick}
	class={[
		'drawer m-0 h-full w-full max-h-none max-w-none overflow-clip border-0 bg-transparent p-0 open:block',
		blurBackdrop && 'backdrop:bg-black/40 backdrop:backdrop-blur-sm',
		!blurBackdrop && 'backdrop:bg-black/40'
	]}
>
	<div
		class={[
			'drawer-panel flex flex-col border border-border bg-surface-elevated shadow-xl outline-none',
			sidePanelClasses[side],
			sizeClasses[side][size],
			className
		]}
		role="document"
		ontransitionend={handlePanelTransitionEnd}
	>
		{#if title || showClose}
			<header class="flex shrink-0 items-start gap-3 border-b border-border px-4 py-3.5">
				<div class="min-w-0 flex-1">
					{#if title}
						<h2 id={titleId} class="text-base font-semibold text-primary">
							{title}
						</h2>
					{/if}
					{#if description}
						<p id={descriptionId} class="mt-0.5 text-xs text-secondary">
							{description}
						</p>
					{/if}
				</div>
				{#if showClose}
					<Button variant="ghost" size="sm" aria-label="Close" onclick={close}>
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</Button>
				{/if}
			</header>
		{/if}

		<div class="min-h-0 flex-1 overflow-y-auto px-4 py-4 text-sm text-primary">
			{#if children}
				{@render children()}
			{/if}
		</div>

		{#if footer}
			<footer class="shrink-0 border-t border-border px-4 py-3">
				{@render footer()}
			</footer>
		{/if}
	</div>
</dialog>

<style>
	/*
	 * Use overflow:clip (not hidden). hidden creates a scroll container, so
	 * translateX/Y into the positive axis (right/bottom) expands scrollable
	 * overflow and the panel stays visually on-screen — killing the enter anim.
	 */
	.drawer {
		overflow: clip;
		overscroll-behavior: contain;
	}

	.drawer::backdrop {
		opacity: 0;
		transition: opacity 0.22s ease;
	}

	.drawer[data-motion='open']::backdrop {
		opacity: 1;
		transition-duration: 0.28s;
	}

	.drawer[data-motion='closing']::backdrop {
		opacity: 0;
	}

	.drawer-panel {
		position: absolute;
		transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);
		will-change: transform;
	}

	.drawer[data-motion='closing'] .drawer-panel {
		transition-duration: 0.22s;
	}

	/* Dock + off-screen (idle / closing) */
	.drawer[data-side='left'] .drawer-panel {
		inset: 0 auto 0 0;
		transform: translate3d(-100%, 0, 0);
	}
	.drawer[data-side='right'] .drawer-panel {
		inset: 0 0 0 auto;
		transform: translate3d(100%, 0, 0);
	}
	.drawer[data-side='top'] .drawer-panel {
		inset: 0 0 auto 0;
		transform: translate3d(0, -100%, 0);
	}
	.drawer[data-side='bottom'] .drawer-panel {
		inset: auto 0 0 0;
		transform: translate3d(0, 100%, 0);
	}

	/* On-screen */
	.drawer[data-motion='open'][data-side='left'] .drawer-panel,
	.drawer[data-motion='open'][data-side='right'] .drawer-panel,
	.drawer[data-motion='open'][data-side='top'] .drawer-panel,
	.drawer[data-motion='open'][data-side='bottom'] .drawer-panel {
		transform: translate3d(0, 0, 0);
	}

	@media (prefers-reduced-motion: reduce) {
		.drawer::backdrop,
		.drawer-panel {
			transition-duration: 0.01ms !important;
		}
	}
</style>
