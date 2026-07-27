<script lang="ts">
	import type { Snippet } from 'svelte';

	export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';
	export type PopoverAlign = 'start' | 'center' | 'end';

	interface PopoverProps {
		open?: boolean;
		placement?: PopoverPlacement;
		align?: PopoverAlign;
		strategy?: 'fixed' | 'absolute';
		offset?: number;
		class?: string;
		panelClass?: string;
		trigger?: Snippet;
		children?: Snippet;
		onopenchange?: (open: boolean) => void;
	}

	let {
		open = $bindable(false),
		placement = 'bottom',
		align = 'center',
		strategy = 'fixed',
		offset = 8,
		class: className = '',
		panelClass = '',
		trigger,
		children,
		onopenchange
	}: PopoverProps = $props();

	const panelId = `popover-${Math.random().toString(36).slice(2, 9)}`;

	let rootEl = $state<HTMLDivElement | null>(null);
	let panelEl = $state<HTMLDivElement | null>(null);
	let panelStyle = $state('margin:0;inset:auto;');

	function setOpen(next: boolean) {
		if (open === next) return;
		open = next;
		onopenchange?.(next);
	}

	function getTriggerEl(): HTMLElement | null {
		if (!rootEl) return null;
		return (
			(rootEl.querySelector('[data-popover-trigger]') as HTMLElement | null) ??
			(rootEl.querySelector('button,a,[role="button"]') as HTMLElement | null) ??
			rootEl
		);
	}

	function positionPanel() {
		if (!panelEl || strategy !== 'fixed') return;
		if (!panelEl.matches(':popover-open')) return;

		const el = getTriggerEl();
		if (!el) return;
		const trigger = el.getBoundingClientRect();
		// Hidden / zero-size triggers → skip (avoids 0,0 flash)
		if (trigger.width < 2 && trigger.height < 2) return;

		const vv = window.visualViewport;
		const viewW = vv?.width ?? window.innerWidth;
		const viewH = vv?.height ?? window.innerHeight;
		const viewLeft = vv?.offsetLeft ?? 0;
		const viewTop = vv?.offsetTop ?? 0;
		const pad = 8;

		const panelW = Math.max(panelEl.offsetWidth, 280);
		const panelH = Math.max(panelEl.offsetHeight, 120);

		let place: PopoverPlacement = placement;
		if (place === 'top' || place === 'bottom') {
			const spaceAbove = trigger.top - viewTop - pad;
			const spaceBelow = viewTop + viewH - trigger.bottom - pad;
			if (place === 'top' && panelH + offset > spaceAbove && spaceBelow > spaceAbove) {
				place = 'bottom';
			} else if (place === 'bottom' && panelH + offset > spaceBelow && spaceAbove > spaceBelow) {
				place = 'top';
			}
		}

		let top = 0;
		let left = 0;

		if (place === 'top') top = trigger.top - panelH - offset;
		else if (place === 'bottom') top = trigger.bottom + offset;
		else if (place === 'left') left = trigger.left - panelW - offset;
		else left = trigger.right + offset;

		if (place === 'top' || place === 'bottom') {
			if (align === 'start') left = trigger.left;
			else if (align === 'end') left = trigger.right - panelW;
			else left = trigger.left + trigger.width / 2 - panelW / 2;
		} else if (align === 'start') top = trigger.top;
		else if (align === 'end') top = trigger.bottom - panelH;
		else top = trigger.top + trigger.height / 2 - panelH / 2;

		left = Math.min(Math.max(viewLeft + pad, left), viewLeft + viewW - panelW - pad);
		top = Math.min(Math.max(viewTop + pad, top), viewTop + viewH - panelH - pad);

		panelStyle = [
			'margin:0',
			'inset:auto',
			`top:${Math.round(top)}px`,
			`left:${Math.round(left)}px`,
			'right:auto',
			'bottom:auto',
			`width:${Math.round(panelW)}px`
		].join(';');
	}

	function syncNative() {
		if (strategy !== 'fixed' || !panelEl) return;
		const isOpen = panelEl.matches(':popover-open');
		try {
			if (open && !isOpen) panelEl.showPopover();
			else if (!open && isOpen) panelEl.hidePopover();
		} catch {
			/* ignore */
		}
	}

	function onToggle(e: ToggleEvent) {
		const next = e.newState === 'open';
		setOpen(next);
		if (next) {
			queueMicrotask(() => {
				positionPanel();
				requestAnimationFrame(() => {
					positionPanel();
					requestAnimationFrame(positionPanel);
				});
			});
		}
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) setOpen(false);
	}

	function onDocPointerDown(e: PointerEvent) {
		if (!open || strategy === 'fixed') return;
		if (!rootEl?.contains(e.target as Node) && !panelEl?.contains(e.target as Node)) {
			setOpen(false);
		}
	}

	$effect(() => {
		open;
		strategy;
		queueMicrotask(() => {
			syncNative();
			if (open) {
				positionPanel();
				requestAnimationFrame(positionPanel);
			}
		});
	});

	$effect(() => {
		if (!open || strategy !== 'fixed') return;
		const onWin = () => positionPanel();
		window.addEventListener('resize', onWin);
		window.addEventListener('scroll', onWin, true);
		return () => {
			window.removeEventListener('resize', onWin);
			window.removeEventListener('scroll', onWin, true);
		};
	});

	const absolutePos = {
		top: 'bottom-full mb-2',
		bottom: 'top-full mt-2',
		left: 'right-full mr-2',
		right: 'left-full ml-2'
	};

	const absoluteAlign = {
		start: { top: 'left-0', bottom: 'left-0', left: 'top-0', right: 'top-0' },
		center: {
			top: 'left-1/2 -translate-x-1/2',
			bottom: 'left-1/2 -translate-x-1/2',
			left: 'top-1/2 -translate-y-1/2',
			right: 'top-1/2 -translate-y-1/2'
		},
		end: { top: 'right-0', bottom: 'right-0', left: 'bottom-0', right: 'bottom-0' }
	};
</script>

<svelte:document onpointerdown={onDocPointerDown} onkeydown={onKey} />

<div class={['relative inline-flex', className]} bind:this={rootEl}>
	{#if trigger}{@render trigger()}{/if}

	{#if strategy === 'fixed'}
		<div
			bind:this={panelEl}
			id={panelId}
			popover="auto"
			role="dialog"
			ontoggle={onToggle}
			style={panelStyle}
			class={[
				'popover-panel m-0 max-w-[min(20rem,calc(100vw-1rem))] rounded-xl border border-border bg-surface-elevated p-3 shadow-xl outline-none',
				panelClass
			]}
		>
			{#if children}{@render children()}{/if}
		</div>
	{:else if open}
		<div
			bind:this={panelEl}
			role="dialog"
			class={[
				'absolute z-50 min-w-48 rounded-xl border border-border bg-surface-elevated p-3 shadow-xl',
				absolutePos[placement],
				absoluteAlign[align][placement],
				panelClass
			]}
		>
			{#if children}{@render children()}{/if}
		</div>
	{/if}
</div>

<style>
	/* UA popover defaults to inset:0 — force anchor via inline style */
	.popover-panel:popover-open {
		inset: unset;
	}
</style>
