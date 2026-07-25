<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';

	interface ImageCropperProps {
		src?: string;
		aspect?: number;
		class?: string;
		oncrop?: (dataUrl: string) => void;
	}

	let {
		src = '',
		aspect = 1,
		class: className = '',
		oncrop
	}: ImageCropperProps = $props();

	let container = $state<HTMLDivElement | null>(null);
	let imgEl = $state<HTMLImageElement | null>(null);
	let crop = $state({ x: 20, y: 20, w: 160, h: 160 });
	let dragging = $state(false);
	let start = $state({ x: 0, y: 0, cx: 0, cy: 0 });

	$effect(() => {
		aspect;
		crop = { ...crop, h: Math.max(40, crop.w / aspect) };
	});

	function onPointerDown(e: PointerEvent) {
		dragging = true;
		start = { x: e.clientX, y: e.clientY, cx: crop.x, cy: crop.y };
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging || !container) return;
		const dx = e.clientX - start.x;
		const dy = e.clientY - start.y;
		const maxX = container.clientWidth - crop.w;
		const maxY = container.clientHeight - crop.h;
		crop = {
			...crop,
			x: Math.min(maxX, Math.max(0, start.cx + dx)),
			y: Math.min(maxY, Math.max(0, start.cy + dy))
		};
	}

	function onPointerUp() {
		dragging = false;
	}

	function exportCrop() {
		if (!imgEl || !container) return;
		const scaleX = imgEl.naturalWidth / container.clientWidth;
		const scaleY = imgEl.naturalHeight / container.clientHeight;
		const canvas = document.createElement('canvas');
		canvas.width = Math.round(crop.w * scaleX);
		canvas.height = Math.round(crop.h * scaleY);
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.drawImage(
			imgEl,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.w * scaleX,
			crop.h * scaleY,
			0,
			0,
			canvas.width,
			canvas.height
		);
		oncrop?.(canvas.toDataURL('image/png'));
	}
</script>

<div class={['space-y-3', className]}>
	<div bind:this={container} class="relative overflow-hidden rounded-xl border border-border bg-zinc-900">
		<img bind:this={imgEl} {src} alt="Crop source" class="block w-full select-none" draggable="false" />
		<div
			class="absolute cursor-move border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
			style:left="{crop.x}px"
			style:top="{crop.y}px"
			style:width="{crop.w}px"
			style:height="{crop.h}px"
			onpointerdown={onPointerDown}
			onpointermove={onPointerMove}
			onpointerup={onPointerUp}
			role="presentation"
		></div>
	</div>
	<Button size="sm" onclick={exportCrop}>Crop</Button>
</div>
