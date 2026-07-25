<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';

	export interface TourStep {
		id: string;
		selector: string;
		title: string;
		content: string;
		placement?: 'top' | 'bottom' | 'left' | 'right';
	}

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

	let rect = $state<DOMRect | null>(null);

	const step = $derived(steps[current]);

	function measure() {
		if (!step || typeof document === 'undefined') {
			rect = null;
			return;
		}
		const el = document.querySelector(step.selector);
		rect = el?.getBoundingClientRect() ?? null;
	}

	$effect(() => {
		if (!open) return;
		measure();
		window.addEventListener('resize', measure);
		window.addEventListener('scroll', measure, true);
		return () => {
			window.removeEventListener('resize', measure);
			window.removeEventListener('scroll', measure, true);
		};
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
		measure();
	}

	function prev() {
		if (current <= 0) return;
		current -= 1;
		onchange?.(current);
		measure();
	}

	const popStyle = $derived.by(() => {
		if (!rect) return 'top: 50%; left: 50%; transform: translate(-50%, -50%);';
		const placement = step?.placement ?? 'bottom';
		const gap = 12;
		if (placement === 'top') {
			return `top: ${rect.top - gap}px; left: ${rect.left + rect.width / 2}px; transform: translate(-50%, -100%);`;
		}
		if (placement === 'left') {
			return `top: ${rect.top + rect.height / 2}px; left: ${rect.left - gap}px; transform: translate(-100%, -50%);`;
		}
		if (placement === 'right') {
			return `top: ${rect.top + rect.height / 2}px; left: ${rect.right + gap}px; transform: translate(0, -50%);`;
		}
		return `top: ${rect.bottom + gap}px; left: ${rect.left + rect.width / 2}px; transform: translate(-50%, 0);`;
	});
</script>

{#if open && step}
	<div class={['fixed inset-0 z-50', className]} role="dialog" aria-modal="true" aria-label="Product tour">
		<div class="absolute inset-0 bg-black/50" onclick={close} role="presentation"></div>

		{#if rect}
			<div
				class="pointer-events-none absolute rounded-xl ring-2 ring-brand-400 ring-offset-2 ring-offset-transparent"
				style:top="{rect.top - 4}px"
				style:left="{rect.left - 4}px"
				style:width="{rect.width + 8}px"
				style:height="{rect.height + 8}px"
			></div>
		{/if}

		<div
			class="absolute z-10 w-[min(100%-2rem,20rem)] rounded-2xl border border-border bg-surface-elevated p-4 shadow-xl"
			style={popStyle}
		>
			<p class="text-sm font-semibold text-primary">{step.title}</p>
			<p class="mt-1 text-sm text-secondary">{step.content}</p>
			<div class="mt-4 flex items-center justify-between gap-2">
				<button type="button" class="text-xs text-muted hover:text-primary" onclick={close}>Skip</button>
				<div class="flex items-center gap-2">
					<span class="text-xs text-muted">{current + 1}/{steps.length}</span>
					<Button size="sm" variant="secondary" disabled={current === 0} onclick={prev}>Back</Button>
					<Button size="sm" onclick={next}>{current >= steps.length - 1 ? 'Done' : 'Next'}</Button>
				</div>
			</div>
		</div>
	</div>
{/if}
