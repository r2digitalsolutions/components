<script lang="ts">
	export type PanKnobSize = 'sm' | 'md' | 'lg';

	interface PanKnobProps {
		/** Pan value from -1 (full L) to 1 (full R). 0 is center. */
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		size?: PanKnobSize;
		disabled?: boolean;
		showLabel?: boolean;
		showValue?: boolean;
		label?: string;
		class?: string;
		oninput?: (value: number) => void;
		onchange?: (value: number) => void;
	}

	let {
		value = $bindable(0),
		min = -1,
		max = 1,
		step = 0.01,
		size = 'md',
		disabled = false,
		showLabel = true,
		showValue = true,
		label = 'Pan',
		class: className = '',
		oninput,
		onchange
	}: PanKnobProps = $props();

	/** Degrees of travel from center to either extreme (Logic-like). */
	const SWEEP = 135;

	const px = $derived({ sm: 28, md: 36, lg: 48 }[size]);
	const stroke = $derived({ sm: 2.5, md: 3, lg: 3.5 }[size]);
	const clamped = $derived(Math.min(max, Math.max(min, value)));
	const norm = $derived(max === min ? 0 : (clamped - min) / (max - min)); // 0..1
	const bipolar = $derived(norm * 2 - 1); // -1..1 relative to min/max
	const rotation = $derived(bipolar * SWEEP);

	const display = $derived.by(() => {
		const abs = Math.round(Math.abs(bipolar) * 64);
		if (abs === 0) return 'C';
		return bipolar < 0 ? `L${abs}` : `R${abs}`;
	});

	let dragging = $state(false);
	let startY = 0;
	let startValue = 0;

	function snap(v: number) {
		const stepped = Math.round(v / step) * step;
		return Math.min(max, Math.max(min, Number(stepped.toFixed(4))));
	}

	function commit(next: number, final = false) {
		const v = snap(next);
		value = v;
		oninput?.(v);
		if (final) onchange?.(v);
	}

	function onPointerDown(e: PointerEvent) {
		if (disabled) return;
		e.preventDefault();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		dragging = true;
		startY = e.clientY;
		startValue = clamped;
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging || disabled) return;
		const sensitivity = e.shiftKey ? 300 : 100;
		const delta = (startY - e.clientY) / sensitivity;
		commit(startValue + delta * (max - min));
	}

	function onPointerUp(e: PointerEvent) {
		if (!dragging) return;
		dragging = false;
		try {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		} catch {
			/* already released */
		}
		onchange?.(clamped);
	}

	function onDblClick() {
		if (disabled) return;
		commit(0, true);
	}

	function onKeyDown(e: KeyboardEvent) {
		if (disabled) return;
		const fine = e.shiftKey ? step : step * 5;
		if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
			e.preventDefault();
			commit(clamped + fine, true);
		} else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
			e.preventDefault();
			commit(clamped - fine, true);
		} else if (e.key === 'Home') {
			e.preventDefault();
			commit(0, true);
		}
	}

	/** Polar helper: angle 0 = 12 o'clock, positive clockwise. */
	function polar(cx: number, cy: number, r: number, deg: number) {
		const rad = ((deg - 90) * Math.PI) / 180;
		return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
	}

	function arcPath(r: number, fromDeg: number, toDeg: number) {
		const c = px / 2;
		const start = polar(c, c, r, fromDeg);
		const end = polar(c, c, r, toDeg);
		const delta = toDeg - fromDeg;
		const large = Math.abs(delta) > 180 ? 1 : 0;
		const sweep = delta >= 0 ? 1 : 0;
		return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} ${sweep} ${end.x} ${end.y}`;
	}

	const trackR = $derived(px / 2 - stroke);
	const trackPath = $derived(arcPath(trackR, -SWEEP, SWEEP));
	const fillPath = $derived(
		Math.abs(bipolar) < 0.001 ? '' : arcPath(trackR, 0, rotation)
	);
	const indicator = $derived(polar(px / 2, px / 2, trackR - stroke * 1.6, rotation));
</script>

<div class={['inline-flex flex-col items-center gap-0.5 select-none', className]}>
	{#if showLabel}
		<span class="text-[9px] font-medium uppercase tracking-wide text-muted">{label}</span>
	{/if}

	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		role="slider"
		tabindex={disabled ? -1 : 0}
		aria-label={label}
		aria-valuemin={min}
		aria-valuemax={max}
		aria-valuenow={clamped}
		aria-valuetext={display}
		aria-disabled={disabled || undefined}
		class={[
			'relative touch-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
			disabled ? 'cursor-not-allowed opacity-50' : 'cursor-ns-resize'
		]}
		style:width="{px}px"
		style:height="{px}px"
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
		ondblclick={onDblClick}
		onkeydown={onKeyDown}
	>
		<svg width={px} height={px} viewBox="0 0 {px} {px}" aria-hidden="true" class="block">
			<!-- Track arc -->
			<path
				d={trackPath}
				fill="none"
				stroke="var(--color-border-strong, #d4d4d8)"
				stroke-width={stroke}
				stroke-linecap="round"
			/>

			<!-- Bipolar fill from center -->
			{#if fillPath}
				<path
					d={fillPath}
					fill="none"
					stroke="var(--color-brand-500, #3b82f6)"
					stroke-width={stroke}
					stroke-linecap="round"
				/>
			{/if}

			<!-- Knob body -->
			<circle
				cx={px / 2}
				cy={px / 2}
				r={trackR - stroke * 1.8}
				fill="var(--surface-elevated, #fff)"
				stroke="var(--border, #e4e4e7)"
				stroke-width="1"
			/>

			<!-- Center pip -->
			<circle
				cx={px / 2}
				cy={px / 2}
				r={1.5}
				fill="var(--border-strong, #d4d4d8)"
			/>

			<!-- Indicator notch -->
			<circle
				cx={indicator.x}
				cy={indicator.y}
				r={stroke * 0.85}
				fill="var(--color-brand-500, #3b82f6)"
			/>
		</svg>
	</div>

	{#if showValue}
		<span class="font-mono text-[9px] tabular-nums text-secondary">{display}</span>
	{/if}
</div>
