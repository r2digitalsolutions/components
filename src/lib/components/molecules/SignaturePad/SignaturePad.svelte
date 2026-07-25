<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';

	interface SignaturePadProps {
		value?: string;
		height?: number;
		class?: string;
		onchange?: (dataUrl: string) => void;
	}

	let {
		value = $bindable(''),
		height = 180,
		class: className = '',
		onchange
	}: SignaturePadProps = $props();

	let canvas = $state<HTMLCanvasElement | null>(null);
	let drawing = $state(false);

	function ctx() {
		return canvas?.getContext('2d') ?? null;
	}

	function pos(e: PointerEvent) {
		if (!canvas) return { x: 0, y: 0 };
		const rect = canvas.getBoundingClientRect();
		return {
			x: ((e.clientX - rect.left) / rect.width) * canvas.width,
			y: ((e.clientY - rect.top) / rect.height) * canvas.height
		};
	}

	function start(e: PointerEvent) {
		drawing = true;
		const c = ctx();
		if (!c) return;
		const p = pos(e);
		c.beginPath();
		c.moveTo(p.x, p.y);
		canvas?.setPointerCapture(e.pointerId);
	}

	function move(e: PointerEvent) {
		if (!drawing) return;
		const c = ctx();
		if (!c) return;
		const p = pos(e);
		c.lineWidth = 2;
		c.lineCap = 'round';
		c.strokeStyle = '#18181b';
		c.lineTo(p.x, p.y);
		c.stroke();
	}

	function end() {
		if (!drawing || !canvas) return;
		drawing = false;
		value = canvas.toDataURL('image/png');
		onchange?.(value);
	}

	function clear() {
		const c = ctx();
		if (!canvas || !c) return;
		c.clearRect(0, 0, canvas.width, canvas.height);
		value = '';
		onchange?.('');
	}

	$effect(() => {
		if (!canvas) return;
		const dpr = window.devicePixelRatio || 1;
		canvas.width = canvas.clientWidth * dpr;
		canvas.height = height * dpr;
		const c = ctx();
		if (c) {
			c.setTransform(dpr, 0, 0, dpr, 0, 0);
			c.fillStyle = '#fff';
			c.fillRect(0, 0, canvas.clientWidth, height);
		}
	});
</script>

<div class={['space-y-2', className]}>
	<canvas
		bind:this={canvas}
		class="w-full touch-none rounded-xl border border-border bg-white"
		style:height="{height}px"
		onpointerdown={start}
		onpointermove={move}
		onpointerup={end}
		onpointerleave={end}
		aria-label="Signature pad"
	></canvas>
	<div class="flex justify-end">
		<Button size="sm" variant="secondary" onclick={clear}>Clear</Button>
	</div>
</div>
