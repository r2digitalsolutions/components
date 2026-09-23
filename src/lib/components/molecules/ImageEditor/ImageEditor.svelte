<script lang="ts">
	import Slider from '$lib/components/atoms/Slider/Slider.svelte';

	export type ImageEditorFormat = 'image/jpeg' | 'image/png' | 'image/webp';

	interface ImageEditorProps {
		src?: string;
		/** Viewport width / height. Default `3` (wide cover). */
		aspect?: number;
		minZoom?: number;
		maxZoom?: number;
		zoomLabel?: string;
		outputFormat?: ImageEditorFormat;
		outputQuality?: number;
		/** Exported width in px. Height follows `aspect`. */
		outputWidth?: number;
		class?: string;
	}

	let {
		src = '',
		aspect = 3,
		minZoom = 1,
		maxZoom = 3,
		zoomLabel = 'Zoom',
		outputFormat = 'image/jpeg',
		outputQuality = 0.92,
		outputWidth = 1600,
		class: className = ''
	}: ImageEditorProps = $props();

	let frameEl = $state<HTMLDivElement | null>(null);
	let imgEl = $state<HTMLImageElement | null>(null);
	let zoom = $state(1);
	let panX = $state(0);
	let panY = $state(0);
	let frameW = $state(0);
	let frameH = $state(0);
	let naturalW = $state(0);
	let naturalH = $state(0);
	let dragging = $state(false);
	let exportError = $state('');

	let pointerStart = { x: 0, y: 0, panX: 0, panY: 0 };

	const fitted = $derived.by(() => {
		if (!frameW || !frameH || !naturalW || !naturalH) return { w: 0, h: 0 };
		const scale = Math.min(frameW / naturalW, frameH / naturalH) * zoom;
		return { w: naturalW * scale, h: naturalH * scale };
	});

	const offset = $derived({
		x: (frameW - fitted.w) / 2 + panX,
		y: (frameH - fitted.h) / 2 + panY
	});

	$effect(() => {
		src;
		zoom = 1;
		panX = 0;
		panY = 0;
		exportError = '';
	});

	$effect(() => {
		const frame = frameEl;
		if (!frame) return;
		measure();
		const observer = new ResizeObserver(() => measure());
		observer.observe(frame);
		return () => observer.disconnect();
	});

	function measure() {
		if (!frameEl) return;
		frameW = frameEl.clientWidth;
		frameH = frameEl.clientHeight;
	}

	function onImageLoad() {
		if (!imgEl) return;
		naturalW = imgEl.naturalWidth;
		naturalH = imgEl.naturalHeight;
		measure();
	}

	function onPointerDown(event: PointerEvent) {
		if (!fitted.w) return;
		dragging = true;
		pointerStart = { x: event.clientX, y: event.clientY, panX, panY };
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}

	function onPointerMove(event: PointerEvent) {
		if (!dragging) return;
		panX = pointerStart.panX + (event.clientX - pointerStart.x);
		panY = pointerStart.panY + (event.clientY - pointerStart.y);
	}

	function onPointerUp(event: PointerEvent) {
		dragging = false;
		const target = event.currentTarget as HTMLElement;
		if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
	}

	function onWheel(event: WheelEvent) {
		event.preventDefault();
		const next = zoom + (event.deltaY < 0 ? 0.08 : -0.08);
		zoom = Math.min(maxZoom, Math.max(minZoom, Number(next.toFixed(2))));
	}

	export async function exportFile(filename = 'image.jpg'): Promise<File> {
		exportError = '';
		if (!imgEl || !frameW || !frameH || !fitted.w) {
			throw new Error('Image is not ready');
		}
		const canvas = document.createElement('canvas');
		canvas.width = outputWidth;
		canvas.height = Math.max(1, Math.round(outputWidth / aspect));
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error('Canvas is not available');
		const scale = canvas.width / frameW;
		ctx.fillStyle = '#0a0a0a';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(imgEl, offset.x * scale, offset.y * scale, fitted.w * scale, fitted.h * scale);
		const blob = await new Promise<Blob | null>((resolve) => {
			canvas.toBlob(resolve, outputFormat, outputQuality);
		});
		if (!blob) {
			exportError = 'Could not export this image';
			throw new Error(exportError);
		}
		const ext =
			outputFormat === 'image/png' ? 'png' : outputFormat === 'image/webp' ? 'webp' : 'jpg';
		const base = filename.replace(/\.[a-z0-9]+$/i, '') || 'image';
		return new File([blob], `${base}.${ext}`, { type: outputFormat });
	}
</script>

<div class={['gap-3 flex w-full flex-col', className]}>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={frameEl}
		class="rounded-xl bg-neutral-950 relative w-full touch-none overflow-hidden"
		style:aspect-ratio={aspect}
		aria-label={zoomLabel}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
		onwheel={onWheel}
	>
		{#if src}
			<img
				bind:this={imgEl}
				{src}
				alt=""
				crossorigin="anonymous"
				draggable="false"
				class="pointer-events-none absolute max-w-none select-none"
				style:width="{fitted.w}px"
				style:height="{fitted.h}px"
				style:left="{offset.x}px"
				style:top="{offset.y}px"
				onload={onImageLoad}
			/>
		{/if}
	</div>
	<Slider
		label={zoomLabel}
		min={minZoom}
		max={maxZoom}
		step={0.05}
		bind:value={zoom}
		showValue
		valuePosition="inline"
		unit="×"
		form=""
	/>
	{#if exportError}
		<p class="text-xs text-danger">{exportError}</p>
	{/if}
</div>
