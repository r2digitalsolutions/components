<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';

	export interface TourStep {
		id: string;
		selector: string;
		title: string;
		content: string;
		placement?: 'top' | 'bottom' | 'left' | 'right';
	}

	type Placement = NonNullable<TourStep['placement']>;

	interface TourProps {
		steps?: TourStep[];
		open?: boolean;
		current?: number;
		class?: string;
		onclose?: () => void;
		onchange?: (index: number) => void;
	}

	let {
		steps = [],
		open = $bindable(false),
		current = $bindable(0),
		class: className = '',
		onclose,
		onchange
	}: TourProps = $props();

	const PAD = 16;
	const GAP = 12;

	let targetRect = $state<DOMRect | null>(null);
	let popEl = $state<HTMLDivElement | null>(null);
	let popTop = $state(0);
	let popLeft = $state(0);
	let ready = $state(false);
	let resolvedPlacement = $state<Placement>('bottom');

	const step = $derived(steps[current]);

	function measureTarget() {
		if (!step || typeof document === 'undefined') {
			targetRect = null;
			return;
		}
		const el = document.querySelector(step.selector);
		targetRect = el?.getBoundingClientRect() ?? null;
	}

	function spaceFor(placement: Placement, rect: DOMRect, popW: number, popH: number) {
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		if (placement === 'bottom') return vh - rect.bottom - GAP - PAD;
		if (placement === 'top') return rect.top - GAP - PAD;
		if (placement === 'right') return vw - rect.right - GAP - PAD;
		return rect.left - GAP - PAD;
	}

	function pickPlacement(preferred: Placement, rect: DOMRect, popW: number, popH: number): Placement {
		const opposite: Record<Placement, Placement> = {
			top: 'bottom',
			bottom: 'top',
			left: 'right',
			right: 'left'
		};
		if (spaceFor(preferred, rect, popW, popH) >= (preferred === 'left' || preferred === 'right' ? popW : popH)) {
			return preferred;
		}
		const flip = opposite[preferred];
		if (spaceFor(flip, rect, popW, popH) >= (flip === 'left' || flip === 'right' ? popW : popH)) {
			return flip;
		}
		const order: Placement[] = ['bottom', 'top', 'right', 'left'];
		return order.find((p) => spaceFor(p, rect, popW, popH) >= 0) ?? preferred;
	}

	function rawPosition(placement: Placement, rect: DOMRect, popW: number, popH: number) {
		if (placement === 'top') {
			return { top: rect.top - GAP - popH, left: rect.left + rect.width / 2 - popW / 2 };
		}
		if (placement === 'left') {
			return { top: rect.top + rect.height / 2 - popH / 2, left: rect.left - GAP - popW };
		}
		if (placement === 'right') {
			return { top: rect.top + rect.height / 2 - popH / 2, left: rect.right + GAP };
		}
		return { top: rect.bottom + GAP, left: rect.left + rect.width / 2 - popW / 2 };
	}

	function clamp(value: number, min: number, max: number) {
		return Math.min(Math.max(value, min), Math.max(min, max));
	}

	function positionPopover() {
		if (!targetRect || !popEl || typeof window === 'undefined') return;

		const popW = popEl.offsetWidth || 320;
		const popH = popEl.offsetHeight || 140;
		const preferred = step?.placement ?? 'bottom';
		const placement = pickPlacement(preferred, targetRect, popW, popH);
		const raw = rawPosition(placement, targetRect, popW, popH);

		const maxLeft = window.innerWidth - popW - PAD;
		const maxTop = window.innerHeight - popH - PAD;

		popLeft = clamp(raw.left, PAD, maxLeft);
		popTop = clamp(raw.top, PAD, maxTop);
		resolvedPlacement = placement;
		ready = true;
	}

	function refresh() {
		measureTarget();
		requestAnimationFrame(positionPopover);
	}

	$effect(() => {
		if (!open) {
			ready = false;
			return;
		}
		void current;
		void step;
		ready = false;
		refresh();
		window.addEventListener('resize', refresh);
		window.addEventListener('scroll', refresh, true);
		return () => {
			window.removeEventListener('resize', refresh);
			window.removeEventListener('scroll', refresh, true);
		};
	});

	$effect(() => {
		if (!open || !popEl) return;
		const ro = new ResizeObserver(() => positionPopover());
		ro.observe(popEl);
		return () => ro.disconnect();
	});

	function close() {
		open = false;
		onclose?.();
	}

	function next() {
		if (current >= steps.length - 1) {
			close();
			return;
		}
		current += 1;
		onchange?.(current);
	}

	function prev() {
		if (current <= 0) return;
		current -= 1;
		onchange?.(current);
	}
</script>

{#if open && step}
	<div
		class={['fixed inset-0 z-50', className]}
		role="dialog"
		aria-modal="true"
		aria-label="Product tour"
	>
		<div class="absolute inset-0 bg-black/50" onclick={close} role="presentation"></div>

		{#if targetRect}
			<div
				class="pointer-events-none absolute rounded-xl ring-2 ring-brand-400 ring-offset-2 ring-offset-transparent"
				style:top="{targetRect.top - 4}px"
				style:left="{targetRect.left - 4}px"
				style:width="{targetRect.width + 8}px"
				style:height="{targetRect.height + 8}px"
			></div>
		{/if}

		<div
			bind:this={popEl}
			class={[
				'absolute z-10 w-[min(100%-2rem,20rem)] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-surface-elevated p-4 shadow-xl',
				ready ? 'opacity-100' : 'opacity-0'
			]}
			style:top="{popTop}px"
			style:left="{popLeft}px"
			data-placement={resolvedPlacement}
		>
			<p class="text-sm font-semibold text-primary">{step.title}</p>
			<p class="mt-1 text-sm text-secondary">{step.content}</p>
			<div class="mt-4 flex items-center justify-between gap-2">
				<button type="button" class="text-xs text-muted hover:text-primary" onclick={close}>
					Skip
				</button>
				<div class="flex items-center gap-2">
					<span class="text-xs text-muted">{current + 1}/{steps.length}</span>
					<Button size="sm" variant="secondary" disabled={current === 0} onclick={prev}>
						Back
					</Button>
					<Button size="sm" onclick={next}>
						{current >= steps.length - 1 ? 'Done' : 'Next'}
					</Button>
				</div>
			</div>
		</div>
	</div>
{/if}
