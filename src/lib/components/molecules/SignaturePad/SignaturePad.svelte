<script lang="ts">
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	type PenColor = 'ink' | 'brand' | 'blue';

	interface SignaturePadProps {
		value?: string;
		height?: number;
		label?: string;
		description?: string;
		disabled?: boolean;
		/** Pen thickness in CSS pixels */
		strokeWidth?: number;
		penColor?: PenColor;
		class?: string;
		onchange?: (dataUrl: string) => void;
		onclear?: () => void;
	}

	let {
		value = $bindable(''),
		height = 200,
		label = 'Signature',
		description = 'Draw your signature in the box below',
		disabled = false,
		strokeWidth = 2.25,
		penColor = 'ink',
		class: className = '',
		onchange,
		onclear
	}: SignaturePadProps = $props();

	let canvas = $state<HTMLCanvasElement | null>(null);
	let drawing = $state(false);
	let isEmpty = $state(true);
	let strokes = $state<{ x: number; y: number }[][]>([]);
	let currentStroke = $state<{ x: number; y: number }[] | null>(null);
	let dpr = $state(1);

	const colors: Record<PenColor, { light: string; dark: string }> = {
		ink: { light: '#18181b', dark: '#f4f4f5' },
		brand: { light: '#4f46e5', dark: '#818cf8' },
		blue: { light: '#1d4ed8', dark: '#60a5fa' }
	};

	function isDark() {
		return typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
	}

	function strokeColor(forExport = false) {
		const c = colors[penColor];
		if (forExport) return c.light;
		return isDark() ? c.dark : c.light;
	}

	function ctx() {
		return canvas?.getContext('2d') ?? null;
	}

	/** Pointer → device-pixel coords */
	function pos(e: PointerEvent) {
		if (!canvas) return { x: 0, y: 0 };
		const rect = canvas.getBoundingClientRect();
		return {
			x: ((e.clientX - rect.left) / rect.width) * canvas.width,
			y: ((e.clientY - rect.top) / rect.height) * canvas.height
		};
	}

	function paintBackground(c: CanvasRenderingContext2D) {
		if (!canvas) return;
		const w = canvas.width;
		const h = canvas.height;
		c.clearRect(0, 0, w, h);
		c.fillStyle = isDark() ? '#18181b' : '#ffffff';
		c.fillRect(0, 0, w, h);

		const guideY = h * 0.72;
		c.beginPath();
		c.setLineDash([6 * dpr, 6 * dpr]);
		c.strokeStyle = isDark() ? 'rgba(255,255,255,0.12)' : 'rgba(24,24,27,0.12)';
		c.lineWidth = dpr;
		c.moveTo(w * 0.08, guideY);
		c.lineTo(w * 0.92, guideY);
		c.stroke();
		c.setLineDash([]);

		c.strokeStyle = isDark() ? 'rgba(255,255,255,0.2)' : 'rgba(24,24,27,0.2)';
		c.lineWidth = 1.25 * dpr;
		const x0 = w * 0.08;
		const xSize = Math.min(12 * dpr, h * 0.05);
		c.beginPath();
		c.moveTo(x0, guideY - xSize);
		c.lineTo(x0 + xSize * 1.15, guideY);
		c.moveTo(x0 + xSize * 1.15, guideY - xSize);
		c.lineTo(x0, guideY);
		c.stroke();
	}

	function paintStroke(c: CanvasRenderingContext2D, points: { x: number; y: number }[]) {
		if (points.length < 2) return;
		c.beginPath();
		c.lineWidth = strokeWidth * dpr;
		c.lineCap = 'round';
		c.lineJoin = 'round';
		c.strokeStyle = strokeColor();
		c.moveTo(points[0].x, points[0].y);
		for (let i = 1; i < points.length; i++) {
			const midX = (points[i - 1].x + points[i].x) / 2;
			const midY = (points[i - 1].y + points[i].y) / 2;
			c.quadraticCurveTo(points[i - 1].x, points[i - 1].y, midX, midY);
		}
		c.lineTo(points[points.length - 1].x, points[points.length - 1].y);
		c.stroke();
	}

	function redraw() {
		if (!canvas) return;
		const c = ctx();
		if (!c) return;
		paintBackground(c);
		for (const stroke of strokes) paintStroke(c, stroke);
		if (currentStroke) paintStroke(c, currentStroke);
	}

	function setupCanvas() {
		if (!canvas) return;
		dpr = window.devicePixelRatio || 1;
		const cssW = canvas.clientWidth || canvas.parentElement?.clientWidth || 320;
		canvas.width = Math.max(1, Math.floor(cssW * dpr));
		canvas.height = Math.max(1, Math.floor(height * dpr));
		redraw();
	}

	function exportValue() {
		if (!canvas) return;
		if (strokes.length === 0) {
			value = '';
			isEmpty = true;
			onchange?.('');
			return;
		}

		const out = document.createElement('canvas');
		out.width = canvas.width;
		out.height = canvas.height;
		const ec = out.getContext('2d');
		if (!ec) return;
		ec.fillStyle = '#ffffff';
		ec.fillRect(0, 0, out.width, out.height);
		for (const stroke of strokes) {
			if (stroke.length < 2) continue;
			ec.beginPath();
			ec.lineWidth = strokeWidth * dpr;
			ec.lineCap = 'round';
			ec.lineJoin = 'round';
			ec.strokeStyle = strokeColor(true);
			ec.moveTo(stroke[0].x, stroke[0].y);
			for (let i = 1; i < stroke.length; i++) {
				const midX = (stroke[i - 1].x + stroke[i].x) / 2;
				const midY = (stroke[i - 1].y + stroke[i].y) / 2;
				ec.quadraticCurveTo(stroke[i - 1].x, stroke[i - 1].y, midX, midY);
			}
			ec.lineTo(stroke[stroke.length - 1].x, stroke[stroke.length - 1].y);
			ec.stroke();
		}
		value = out.toDataURL('image/png');
		isEmpty = false;
		onchange?.(value);
	}

	function start(e: PointerEvent) {
		if (disabled) return;
		e.preventDefault();
		drawing = true;
		currentStroke = [pos(e)];
		canvas?.setPointerCapture(e.pointerId);
	}

	function move(e: PointerEvent) {
		if (!drawing || !currentStroke || disabled) return;
		currentStroke = [...currentStroke, pos(e)];
		redraw();
	}

	function end() {
		if (!drawing) return;
		drawing = false;
		if (currentStroke && currentStroke.length > 1) {
			strokes = [...strokes, currentStroke];
		}
		currentStroke = null;
		redraw();
		exportValue();
	}

	function clear() {
		strokes = [];
		currentStroke = null;
		value = '';
		isEmpty = true;
		redraw();
		onchange?.('');
		onclear?.();
	}

	function undo() {
		if (!strokes.length) return;
		strokes = strokes.slice(0, -1);
		redraw();
		exportValue();
	}

	$effect(() => {
		height;
		penColor;
		strokeWidth;
		if (!canvas) return;
		setupCanvas();

		const onResize = () => setupCanvas();
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	});
</script>

<Card class={['w-full', className].filter(Boolean).join(' ')} padding="none" chrome>
	{#snippet header()}
		<div class="flex flex-wrap items-start justify-between gap-3 px-4 py-3 sm:px-5">
			<div class="min-w-0">
				<p class="text-sm font-semibold text-primary">{label}</p>
				{#if description}
					<p class="mt-0.5 text-xs text-muted">{description}</p>
				{/if}
			</div>
			<span
				class={[
					'rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
					isEmpty
						? 'bg-surface-overlay text-muted'
						: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
				]}
			>
				{isEmpty ? 'Empty' : 'Signed'}
			</span>
		</div>
	{/snippet}

	<div class="relative px-4 pb-2 pt-3 sm:px-5">
		<div
			class={[
				'relative overflow-hidden rounded-xl border border-dashed border-border bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] dark:bg-zinc-900',
				disabled && 'opacity-60',
				drawing && 'ring-2 ring-brand-500/25'
			]}
		>
			{#if isEmpty && !drawing}
				<p
					class="pointer-events-none absolute inset-x-0 top-[38%] z-10 text-center text-sm tracking-wide text-muted/45"
					aria-hidden="true"
				>
					Sign here
				</p>
			{/if}
			<canvas
				bind:this={canvas}
				class={[
					'relative z-0 block w-full touch-none',
					disabled ? 'cursor-not-allowed' : 'cursor-crosshair'
				]}
				style:height="{height}px"
				onpointerdown={start}
				onpointermove={move}
				onpointerup={end}
				onpointercancel={end}
				aria-label={label}
				aria-disabled={disabled}
			></canvas>
		</div>
	</div>

	{#snippet footer()}
		<div class="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 sm:px-5">
			<p class="text-[11px] text-muted">
				{#if disabled}
					Read only
				{:else}
					Mouse or touch · {strokes.length}
					{strokes.length === 1 ? 'stroke' : 'strokes'}
				{/if}
			</p>
			<div class="flex items-center gap-2">
				<Button size="sm" variant="ghost" onclick={undo} disabled={disabled || !strokes.length}>
					Undo
				</Button>
				<Button size="sm" variant="secondary" onclick={clear} disabled={disabled || isEmpty}>
					Clear
				</Button>
			</div>
		</div>
	{/snippet}
</Card>
