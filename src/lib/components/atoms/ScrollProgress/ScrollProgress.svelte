<script lang="ts">
	interface ScrollProgressProps {
		/** CSS selector for scroll container; defaults to document */
		target?: string;
		height?: number;
		position?: 'top' | 'bottom';
		/** `fixed` for viewport; `absolute` when nested in a relative scroll parent */
		placement?: 'fixed' | 'absolute';
		/** Track (background) color */
		trackColor?: string;
		/** Fill color */
		color?: string;
		/** Show a subtle track even at 0% */
		showTrack?: boolean;
		class?: string;
	}

	let {
		target,
		height = 3,
		position = 'top',
		placement = 'fixed',
		trackColor = 'rgb(0 0 0 / 0.08)',
		color,
		showTrack = true,
		class: className = ''
	}: ScrollProgressProps = $props();

	let progress = $state(0);
	let rootEl = $state<HTMLElement | null>(null);

	function resolveScrollEl(): HTMLElement | Window | null {
		if (typeof window === 'undefined') return null;
		if (target) {
			const el = document.querySelector(target);
			return el instanceof HTMLElement ? el : null;
		}
		return window;
	}

	function update() {
		const scrollTarget = resolveScrollEl();
		if (!scrollTarget) return;

		if (scrollTarget instanceof HTMLElement) {
			const max = scrollTarget.scrollHeight - scrollTarget.clientHeight;
			progress = max > 0 ? Math.min(100, Math.max(0, (scrollTarget.scrollTop / max) * 100)) : 0;
			return;
		}

		const doc = document.documentElement;
		const max = doc.scrollHeight - doc.clientHeight;
		progress = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
	}

	$effect(() => {
		update();
		const scrollTarget = resolveScrollEl();
		if (!scrollTarget) return;

		scrollTarget.addEventListener('scroll', update, { passive: true });
		window.addEventListener('resize', update);

		let ro: ResizeObserver | undefined;
		if (scrollTarget instanceof HTMLElement && typeof ResizeObserver !== 'undefined') {
			ro = new ResizeObserver(update);
			ro.observe(scrollTarget);
		}

		return () => {
			scrollTarget.removeEventListener('scroll', update);
			window.removeEventListener('resize', update);
			ro?.disconnect();
		};
	});
</script>

<div
	bind:this={rootEl}
	class={[
		'pointer-events-none inset-x-0 z-50 overflow-hidden',
		placement === 'fixed' ? 'fixed' : 'absolute',
		position === 'top' ? 'top-0' : 'bottom-0',
		className
	]}
	role="progressbar"
	aria-valuemin={0}
	aria-valuemax={100}
	aria-valuenow={Math.round(progress)}
	aria-label="Reading progress"
	style:height="{height}px"
	style:background={showTrack ? trackColor : 'transparent'}
>
	<div
		class={[
			'h-full transition-[width] duration-150 ease-out',
			!color && 'bg-brand-500'
		]}
		style:width="{progress}%"
		style:background={color}
	></div>
</div>
