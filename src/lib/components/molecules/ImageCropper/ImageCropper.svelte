<script lang="ts">
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	export type CropAspect = number | 'free';
	export type CropFormat = 'image/png' | 'image/jpeg' | 'image/webp';

	interface ImageCropperProps {
		src?: string;
		/** Crop aspect ratio, or `'free'`. Default `1` (square). */
		aspect?: CropAspect;
		/** Minimum crop edge in CSS px */
		minSize?: number;
		/** Max editor height */
		maxHeight?: number;
		label?: string;
		description?: string;
		disabled?: boolean;
		/** Show rule-of-thirds guides */
		showGrid?: boolean;
		/** Live preview of the current crop frame */
		showPreview?: boolean;
		outputFormat?: CropFormat;
		/** 0–1 for jpeg/webp */
		outputQuality?: number;
		/** Max output width (keeps aspect). 0 = natural crop size */
		outputWidth?: number;
		cropLabel?: string;
		class?: string;
		oncrop?: (dataUrl: string) => void;
		onchange?: (crop: { x: number; y: number; w: number; h: number }) => void;
	}

	let {
		src = '',
		aspect = 1,
		minSize = 48,
		maxHeight = 360,
		label = 'Crop image',
		description = 'Drag to move · handles to resize',
		disabled = false,
		showGrid = true,
		showPreview = true,
		outputFormat = 'image/png',
		outputQuality = 0.92,
		outputWidth = 0,
		cropLabel = 'Export',
		class: className = '',
		oncrop,
		onchange
	}: ImageCropperProps = $props();

	type Handle = 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w';

	let container = $state<HTMLDivElement | null>(null);
	let containerW = $state(0);
	let imgEl = $state<HTMLImageElement | null>(null);
	let crop = $state({ x: 24, y: 24, w: 160, h: 160 });
	let active = $state<Handle | null>(null);
	let start = $state({ x: 0, y: 0, crop: { x: 0, y: 0, w: 0, h: 0 } });
	let exported = $state('');
	let exportError = $state('');
	let ready = $state(false);
	let displayW = $state(0);
	let displayH = $state(0);

	const aspectValue = $derived(aspect === 'free' ? null : aspect);
	const formatLabel = $derived(
		outputFormat === 'image/jpeg' ? 'JPEG' : outputFormat === 'image/webp' ? 'WebP' : 'PNG'
	);

	function clampCrop(next: { x: number; y: number; w: number; h: number }) {
		if (!container) return next;
		const cw = container.clientWidth;
		const ch = container.clientHeight;
		let { x, y, w, h } = next;

		w = Math.max(minSize, Math.min(w, cw));
		h = Math.max(minSize, Math.min(h, ch));

		if (aspectValue) {
			h = Math.max(minSize, w / aspectValue);
			if (h > ch) {
				h = ch;
				w = h * aspectValue;
			}
			if (w > cw) {
				w = cw;
				h = w / aspectValue;
			}
		}

		x = Math.min(Math.max(0, x), Math.max(0, cw - w));
		y = Math.min(Math.max(0, y), Math.max(0, ch - h));
		return { x, y, w, h };
	}

	function measureImage() {
		if (!imgEl) return;
		displayW = imgEl.clientWidth;
		displayH = imgEl.clientHeight;
	}

	function initCrop() {
		if (!container || !imgEl) return;
		measureImage();
		const cw = container.clientWidth;
		const ch = container.clientHeight;
		if (cw < 8 || ch < 8) return;

		const ratio = aspectValue ?? cw / Math.max(ch, 1);
		let w = Math.min(cw, ch) * 0.72;
		let h = w / (aspectValue ?? ratio);
		if (aspectValue === null) {
			w = cw * 0.7;
			h = ch * 0.55;
		} else {
			h = w / aspectValue;
			if (h > ch * 0.85) {
				h = ch * 0.85;
				w = h * aspectValue;
			}
		}
		crop = clampCrop({
			x: (cw - w) / 2,
			y: (ch - h) / 2,
			w,
			h
		});
		ready = true;
		exportError = '';
		onchange?.(crop);
	}

	function onPointerDown(handle: Handle, e: PointerEvent) {
		if (disabled) return;
		e.preventDefault();
		e.stopPropagation();
		active = handle;
		start = { x: e.clientX, y: e.clientY, crop: { ...crop } };
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!active || !container || disabled) return;
		const dx = e.clientX - start.x;
		const dy = e.clientY - start.y;
		const s = start.crop;
		let next = { ...s };

		if (active === 'move') {
			next = { ...s, x: s.x + dx, y: s.y + dy };
		} else {
			const fromLeft = active.includes('w');
			const fromRight = active.includes('e');
			const fromTop = active.includes('n');
			const fromBottom = active.includes('s');

			if (fromLeft) {
				next.x = s.x + dx;
				next.w = s.w - dx;
			}
			if (fromRight) next.w = s.w + dx;
			if (fromTop) {
				next.y = s.y + dy;
				next.h = s.h - dy;
			}
			if (fromBottom) next.h = s.h + dy;

			if (aspectValue) {
				if (fromLeft || fromRight) {
					next.h = next.w / aspectValue;
					if (fromTop && !fromBottom) next.y = s.y + s.h - next.h;
					else if (!fromTop && !fromBottom) next.y = s.y + (s.h - next.h) / 2;
				} else if (fromTop || fromBottom) {
					next.w = next.h * aspectValue;
					if (fromLeft && !fromRight) next.x = s.x + s.w - next.w;
					else if (!fromLeft && !fromRight) next.x = s.x + (s.w - next.w) / 2;
				}
			}
		}

		crop = clampCrop(next);
		onchange?.(crop);
	}

	function onPointerUp() {
		active = null;
	}

	function exportCrop() {
		if (!imgEl || !container || disabled) return;
		exportError = '';

		const iw = imgEl.clientWidth || container.clientWidth;
		const ih = imgEl.clientHeight || container.clientHeight;
		if (!iw || !ih || !imgEl.naturalWidth) {
			exportError = 'Image is not ready yet';
			return;
		}

		const scaleX = imgEl.naturalWidth / iw;
		const scaleY = imgEl.naturalHeight / ih;

		let outW = Math.round(crop.w * scaleX);
		let outH = Math.round(crop.h * scaleY);
		if (outputWidth > 0 && outW > outputWidth) {
			const r = outputWidth / outW;
			outW = outputWidth;
			outH = Math.max(1, Math.round(outH * r));
		}

		const canvas = document.createElement('canvas');
		canvas.width = Math.max(1, outW);
		canvas.height = Math.max(1, outH);
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// JPEG has no alpha — fill white first
		if (outputFormat === 'image/jpeg') {
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}

		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = 'high';
		try {
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
			const url = canvas.toDataURL(outputFormat, outputQuality);
			if (!url || url === 'data:,') {
				exportError = `Could not encode ${formatLabel}`;
				return;
			}
			exported = url;
			oncrop?.(url);
		} catch {
			exportError =
				'Export blocked (CORS). Use an image that allows cross-origin access, or a same-origin URL.';
			exported = '';
		}
	}

	function resetCrop() {
		initCrop();
		exported = '';
		exportError = '';
	}

	$effect(() => {
		src;
		aspect;
		queueMicrotask(() => {
			if (imgEl?.complete && imgEl.naturalWidth) initCrop();
		});
	});

	const handles: { id: Handle; class: string }[] = [
		{ id: 'nw', class: 'left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize' },
		{ id: 'ne', class: 'right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize' },
		{ id: 'sw', class: 'left-0 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize' },
		{ id: 'se', class: 'right-0 bottom-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize' },
		{ id: 'n', class: 'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize' },
		{ id: 's', class: 'left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-ns-resize' },
		{ id: 'w', class: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize' },
		{ id: 'e', class: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-ew-resize' }
	];

	const sizeLabel = $derived(`${Math.round(crop.w)} × ${Math.round(crop.h)}`);

	/** Live preview: scale crop box down to fit a small viewport */
	const liveMax = 160;
	const liveScale = $derived.by(() => {
		if (!crop.w || !crop.h) return 1;
		return Math.min(liveMax / crop.w, liveMax / crop.h, 1);
	});
	const liveW = $derived(Math.max(1, Math.round(crop.w * liveScale)));
	const liveH = $derived(Math.max(1, Math.round(crop.h * liveScale)));
</script>

<div class={['space-y-3', className]}>
	<Card padding="none" chrome>
		{#snippet header()}
			<div class="flex flex-wrap items-start justify-between gap-3 px-4 py-3 sm:px-5">
				<div class="min-w-0">
					<p class="text-sm font-semibold text-primary">{label}</p>
					{#if description}
						<p class="mt-0.5 text-xs text-muted">{description}</p>
					{/if}
				</div>
				<p class="font-mono text-[11px] tabular-nums text-muted">
					{sizeLabel} · {formatLabel}
				</p>
			</div>
		{/snippet}

		<div class="px-4 pb-3 pt-3 sm:px-5">
			<div
				bind:this={container}
				bind:clientWidth={containerW}
				class={[
					'relative overflow-hidden rounded-xl bg-zinc-950 select-none',
					disabled && 'opacity-60'
				]}
				style:max-height="{maxHeight}px"
			>
				<img
					bind:this={imgEl}
					{src}
					alt=""
					crossorigin="anonymous"
					class="block h-auto w-full object-contain"
					style:max-height="{maxHeight}px"
					draggable="false"
					onload={initCrop}
				/>

				{#if ready}
					<div
						class="pointer-events-none absolute inset-x-0 top-0 bg-black/55"
						style:height="{crop.y}px"
						aria-hidden="true"
					></div>
					<div
						class="pointer-events-none absolute inset-x-0 bg-black/55"
						style:top="{crop.y + crop.h}px"
						style:bottom="0"
						aria-hidden="true"
					></div>
					<div
						class="pointer-events-none absolute left-0 bg-black/55"
						style:top="{crop.y}px"
						style:height="{crop.h}px"
						style:width="{crop.x}px"
						aria-hidden="true"
					></div>
					<div
						class="pointer-events-none absolute right-0 bg-black/55"
						style:top="{crop.y}px"
						style:height="{crop.h}px"
						style:width="{Math.max(0, containerW - crop.x - crop.w)}px"
						aria-hidden="true"
					></div>

					<div
						class={[
							'absolute box-border border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.35)]',
							!disabled && 'cursor-move',
							active === 'move' && 'border-brand-400'
						]}
						style:left="{crop.x}px"
						style:top="{crop.y}px"
						style:width="{crop.w}px"
						style:height="{crop.h}px"
						onpointerdown={(e) => onPointerDown('move', e)}
						onpointermove={onPointerMove}
						onpointerup={onPointerUp}
						onpointercancel={onPointerUp}
						role="presentation"
					>
						{#if showGrid}
							<div class="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
								{#each { length: 9 } as _, i (i)}
									<span class="border border-white/20"></span>
								{/each}
							</div>
						{/if}

						{#if !disabled}
							{#each handles as handle (handle.id)}
								<button
									type="button"
									tabindex="-1"
									aria-label="Resize {handle.id}"
									class={[
										'absolute z-10 h-3 w-3 rounded-sm border border-zinc-900/40 bg-white shadow',
										handle.class
									]}
									onpointerdown={(e) => onPointerDown(handle.id, e)}
									onpointermove={onPointerMove}
									onpointerup={onPointerUp}
									onpointercancel={onPointerUp}
								></button>
							{/each}
						{/if}
					</div>
				{/if}
			</div>
		</div>

		{#snippet footer()}
			<div class="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 sm:px-5">
				<p class="text-[11px] text-muted">
					{#if aspect === 'free'}
						Free aspect
					{:else}
						Aspect {aspect === 1 ? '1:1' : Number(aspect).toFixed(2)}
					{/if}
					{#if outputWidth > 0}
						· max {outputWidth}px
					{/if}
					· export as {formatLabel}
				</p>
				<div class="flex items-center gap-2">
					<Button size="sm" variant="ghost" onclick={resetCrop} disabled={disabled}>Reset</Button>
					<Button size="sm" onclick={exportCrop} disabled={disabled || !ready}>{cropLabel}</Button>
				</div>
			</div>
		{/snippet}
	</Card>

	{#if exportError}
		<p class="rounded-xl border border-rose-300/50 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-200">
			{exportError}
		</p>
	{/if}

	{#if showPreview && ready}
		<div class="grid gap-3 sm:grid-cols-2">
			<!-- Live view of current frame (CSS clip — no canvas) -->
			<div class="overflow-hidden rounded-2xl border border-border bg-surface-elevated p-3">
				<div class="mb-2 flex items-center justify-between gap-2">
					<p class="text-[11px] font-medium uppercase tracking-wide text-muted">Live crop</p>
					<span class="font-mono text-[10px] text-muted">{sizeLabel}</span>
				</div>
				<div class="flex min-h-40 items-center justify-center rounded-xl bg-zinc-950/5 dark:bg-black/20">
					<div
						class="relative overflow-hidden rounded-lg bg-zinc-900 shadow-sm ring-1 ring-border"
						style:width="{liveW}px"
						style:height="{liveH}px"
					>
						{#if displayW > 0}
							<img
								{src}
								alt=""
								draggable="false"
								class="absolute max-w-none select-none"
								style:width="{displayW * liveScale}px"
								style:height="{displayH * liveScale}px"
								style:left="{-crop.x * liveScale}px"
								style:top="{-crop.y * liveScale}px"
							/>
						{/if}
					</div>
				</div>
				<p class="mt-2 text-[11px] text-muted">Updates as you move the frame</p>
			</div>

			<!-- Exported file preview -->
			<div class="overflow-hidden rounded-2xl border border-border bg-surface-elevated p-3">
				<div class="mb-2 flex items-center justify-between gap-2">
					<p class="text-[11px] font-medium uppercase tracking-wide text-muted">Exported</p>
					{#if exported}
						<span class="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
							{formatLabel} · {Math.round(exported.length / 1024)} KB
						</span>
					{:else}
						<span class="text-[10px] text-muted">Click “{cropLabel}”</span>
					{/if}
				</div>
				<div
					class="flex min-h-40 items-center justify-center rounded-xl bg-[length:12px_12px] bg-[linear-gradient(45deg,#e4e4e7_25%,transparent_25%,transparent_75%,#e4e4e7_75%),linear-gradient(45deg,#e4e4e7_25%,transparent_25%,transparent_75%,#e4e4e7_75%)] bg-[position:0_0,6px_6px] dark:bg-[linear-gradient(45deg,#27272a_25%,transparent_25%,transparent_75%,#27272a_75%),linear-gradient(45deg,#27272a_25%,transparent_25%,transparent_75%,#27272a_75%)]"
				>
					{#if exported}
						<img
							src={exported}
							alt="Exported crop"
							class="max-h-36 max-w-full rounded-md object-contain shadow-md"
						/>
					{:else}
						<p class="px-4 text-center text-xs text-muted">Exported {formatLabel} will appear here</p>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
