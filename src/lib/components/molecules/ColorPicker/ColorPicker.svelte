<script lang="ts">
	import { createId } from '$lib/utils/id.js';

	export type ColorFormat = 'hex' | 'rgb' | 'hsl';
	type ColorPickerSize = 'sm' | 'md' | 'lg';

	interface ColorPickerProps {
		value?: string;
		swatches?: string[];
		label?: string;
		/** Enable alpha channel / transparency. */
		alpha?: boolean;
		/** Output format written to `value`. */
		format?: ColorFormat;
		/** Show preset swatches. */
		showSwatches?: boolean;
		size?: ColorPickerSize;
		disabled?: boolean;
		open?: boolean;
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable('#6366f1'),
		swatches = [
			'#6366f1',
			'#22c55e',
			'#f59e0b',
			'#ef4444',
			'#0ea5e9',
			'#ec4899',
			'#8b5cf6',
			'#14b8a6',
			'#111827',
			'#f8fafc',
			'rgba(99,102,241,0.35)',
			'transparent'
		],
		label,
		alpha = false,
		format = 'hex',
		showSwatches = true,
		size = 'md',
		disabled = false,
		open = $bindable(false),
		class: className = '',
		onchange
	}: ColorPickerProps = $props();

	const triggerSizeClasses: Record<ColorPickerSize, string> = {
		sm: 'h-8 gap-2 rounded-lg px-2',
		md: 'h-10 gap-2.5 rounded-xl px-2.5',
		lg: 'h-12 gap-3 rounded-xl px-3'
	};

	const swatchSizeClasses: Record<ColorPickerSize, string> = {
		sm: 'h-5 w-5 rounded-md',
		md: 'h-7 w-7 rounded-lg',
		lg: 'h-8 w-8 rounded-lg'
	};

	const valueSizeClasses: Record<ColorPickerSize, string> = {
		sm: 'text-sm',
		md: 'text-sm',
		lg: 'text-base'
	};

	const chevronSizeClasses: Record<ColorPickerSize, string> = {
		sm: 'h-3.5 w-3.5',
		md: 'h-4 w-4',
		lg: 'h-4 w-4'
	};

	let rootEl = $state<HTMLDivElement | null>(null);
	let svEl = $state<HTMLDivElement | null>(null);
	let triggerEl = $state<HTMLButtonElement | null>(null);
	let panelEl = $state<HTMLDivElement | null>(null);
	let panelStyle = $state('');

	let hue = $state(250);
	let sat = $state(0.72);
	let val = $state(0.95);
	let alp = $state(1);
	let dragging: 'sv' | 'hue' | 'alpha' | null = null;
	let syncing = false;

	let panelId = $state<string | undefined>(undefined);
	$effect(() => {
		panelId ??= createId('color-picker');
	});

	const rgba = $derived(hsvToRgb(hue, sat, val));

	const preview = $derived(
		`rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alp})`
	);

	const formatted = $derived(formatColor(rgba.r, rgba.g, rgba.b, alp, format, alpha));

	$effect(() => {
		if (syncing) return;
		const parsed = parseColor(value);
		if (!parsed) return;
		const hsv = rgbToHsv(parsed.r, parsed.g, parsed.b);
		if (hue !== hsv.h) hue = hsv.h;
		if (sat !== hsv.s) sat = hsv.s;
		if (val !== hsv.v) val = hsv.v;
		const nextAlp = alpha ? parsed.a : 1;
		if (alp !== nextAlp) alp = nextAlp;
	});

	function commit() {
		const next = formatColor(rgba.r, rgba.g, rgba.b, alp, format, alpha);
		syncing = true;
		value = next;
		onchange?.(next);
		queueMicrotask(() => {
			syncing = false;
		});
	}

	function setFromString(next: string) {
		const parsed = parseColor(next);
		if (!parsed) {
			value = next;
			return;
		}
		const hsv = rgbToHsv(parsed.r, parsed.g, parsed.b);
		hue = hsv.h;
		sat = hsv.s;
		val = hsv.v;
		alp = alpha ? parsed.a : 1;
		commit();
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			open = false;
			hidePanel();
		}
	}

	function onPointer(e: PointerEvent) {
		if (!dragging) return;
		if (dragging === 'sv' && svEl) {
			const rect = svEl.getBoundingClientRect();
			sat = clamp((e.clientX - rect.left) / rect.width, 0, 1);
			val = clamp(1 - (e.clientY - rect.top) / rect.height, 0, 1);
			commit();
		}
	}

	function onPointerUp() {
		dragging = null;
	}

	function startSv(e: PointerEvent) {
		if (disabled) return;
		dragging = 'sv';
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		onPointer(e);
	}

	function onHueInput(e: Event) {
		hue = Number((e.currentTarget as HTMLInputElement).value);
		commit();
	}

	function onAlphaInput(e: Event) {
		alp = Number((e.currentTarget as HTMLInputElement).value);
		commit();
	}

	function onHexInput(e: Event) {
		setFromString((e.currentTarget as HTMLInputElement).value.trim());
	}

	function pickSwatch(swatch: string) {
		if (swatch === 'transparent') {
			alp = 0;
			commit();
			return;
		}
		setFromString(swatch);
	}

	function sameColor(a: string, b: string) {
		const pa = parseColor(a);
		const pb = parseColor(b);
		if (!pa || !pb) return a.toLowerCase() === b.toLowerCase();
		return (
			pa.r === pb.r &&
			pa.g === pb.g &&
			pa.b === pb.b &&
			Math.abs(pa.a - pb.a) < 0.01
		);
	}

	function positionPanel() {
		if (!triggerEl) return;
		const rect = triggerEl.getBoundingClientRect();
		const gap = 8;
		const panelW = 288;
		const approxH = 340;
		const spaceBelow = window.innerHeight - rect.bottom - gap;
		const spaceAbove = rect.top - gap;
		const openUp = spaceBelow < Math.min(approxH, 220) && spaceAbove > spaceBelow;
		const left = Math.min(Math.max(8, rect.left), window.innerWidth - panelW - 8);
		panelStyle = [
			`top:${openUp ? 'auto' : `${rect.bottom + gap}px`}`,
			`bottom:${openUp ? `${window.innerHeight - rect.top + gap}px` : 'auto'}`,
			`left:${left}px`,
			`width:${panelW}px`,
			`margin:0`
		].join(';');
	}

	function showPanel() {
		if (disabled || !panelEl) return;
		positionPanel();
		if (!panelEl.matches(':popover-open')) panelEl.showPopover();
	}

	function hidePanel() {
		if (panelEl?.matches(':popover-open')) panelEl.hidePopover();
	}

	function togglePanel() {
		if (disabled) return;
		if (panelEl?.matches(':popover-open')) hidePanel();
		else showPanel();
	}

	function handleBeforeToggle(event: ToggleEvent) {
		if (event.newState === 'open') {
			if (disabled) {
				event.preventDefault();
				return;
			}
			positionPanel();
		}
	}

	function handleToggle(event: ToggleEvent) {
		open = event.newState === 'open';
	}
</script>

<svelte:window
	onscroll={() => open && positionPanel()}
	onresize={() => open && positionPanel()}
/>

<svelte:document onkeydown={onKey} onpointermove={onPointer} onpointerup={onPointerUp} />

<div class={['relative w-full min-w-0', className]} bind:this={rootEl}>
	{#if label}
		<span class="mb-1.5 block text-sm font-medium text-primary">{label}</span>
	{/if}

	<button
		type="button"
		bind:this={triggerEl}
		{disabled}
		aria-expanded={open}
		aria-controls={panelId}
		aria-haspopup="dialog"
		onclick={togglePanel}
		class={[
			'flex w-full items-center border border-border bg-surface-elevated text-left transition-colors',
			triggerSizeClasses[size],
			'hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/20',
			open && 'border-brand-500 ring-2 ring-brand-500/20',
			disabled && 'cursor-not-allowed opacity-60'
		]}
	>
		<span
			class={[
				'cp-checker relative shrink-0 overflow-hidden border border-border',
				swatchSizeClasses[size]
			]}
		>
			<span class="absolute inset-0" style:background={preview}></span>
		</span>
		<span class={['min-w-0 flex-1 truncate font-mono text-primary', valueSizeClasses[size]]}>
			{value}
		</span>
		<svg
			class={['shrink-0 text-muted', chevronSizeClasses[size]]}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	<div
		bind:this={panelEl}
		id={panelId}
		popover="auto"
		role="dialog"
		aria-label="Color picker"
		class="color-picker-panel z-50 rounded-2xl border border-border bg-surface-elevated p-3 shadow-xl"
		style={panelStyle}
		onbeforetoggle={handleBeforeToggle}
		ontoggle={handleToggle}
	>
		<div
			bind:this={svEl}
			role="presentation"
			class="relative h-36 w-full cursor-crosshair touch-none overflow-hidden rounded-xl"
			style:background={`linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hue} 100% 50%))`}
			onpointerdown={startSv}
		>
			<span
				class="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
				style:left={`${sat * 100}%`}
				style:top={`${(1 - val) * 100}%`}
				style:background={preview}
			></span>
		</div>

		<label class="mt-3 block">
			<span class="sr-only">Hue</span>
			<input
				type="range"
				min="0"
				max="360"
				step="1"
				value={hue}
				oninput={onHueInput}
				class="cp-hue h-3 w-full cursor-pointer appearance-none rounded-full"
			/>
		</label>

		{#if alpha}
			<label class="mt-2 block">
				<span class="sr-only">Opacity</span>
				<input
					type="range"
					min="0"
					max="1"
					step="0.01"
					value={alp}
					oninput={onAlphaInput}
					class="cp-alpha h-3 w-full cursor-pointer appearance-none rounded-full"
					style:--cp-alpha-color={`rgba(${rgba.r},${rgba.g},${rgba.b},1)`}
				/>
			</label>
		{/if}

		<div class="mt-3 flex items-center gap-2">
			<span class="cp-checker relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-border">
				<span class="absolute inset-0" style:background={preview}></span>
			</span>
			<input
				type="text"
				value={formatted}
				onchange={onHexInput}
				onkeydown={(e) => e.key === 'Enter' && onHexInput(e)}
				class="h-9 min-w-0 flex-1 rounded-lg border border-border bg-surface px-2.5 font-mono text-xs text-primary outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
				aria-label="Color value"
			/>
			{#if alpha}
				<span class="w-10 shrink-0 text-right font-mono text-[11px] text-muted">
					{Math.round(alp * 100)}%
				</span>
			{/if}
		</div>

		{#if showSwatches}
			<div class="mt-3 flex flex-wrap gap-1.5">
				{#each swatches as swatch (swatch)}
					<button
						type="button"
						onclick={() => pickSwatch(swatch)}
						class={[
							'cp-checker relative h-7 w-7 overflow-hidden rounded-full border border-border transition-transform hover:scale-110',
							sameColor(value, swatch) &&
								'ring-2 ring-brand-500 ring-offset-2 ring-offset-surface-elevated'
						]}
						aria-label={`Select ${swatch}`}
					>
						<span class="absolute inset-0" style:background={swatch}></span>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>

	.color-picker-panel {
		position: fixed;
	}

	.color-picker-panel:popover-open {
		display: block;
	}

	.color-picker-panel:not(:popover-open) {
		display: none;
	}

	.cp-checker {
		background-color: #fff;
		background-image:
			linear-gradient(45deg, #d4d4d8 25%, transparent 25%),
			linear-gradient(-45deg, #d4d4d8 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #d4d4d8 75%),
			linear-gradient(-45deg, transparent 75%, #d4d4d8 75%);
		background-size: 8px 8px;
		background-position:
			0 0,
			0 4px,
			4px -4px,
			-4px 0;
	}

	:global(.dark) .cp-checker {
		background-color: #27272a;
		background-image:
			linear-gradient(45deg, #3f3f46 25%, transparent 25%),
			linear-gradient(-45deg, #3f3f46 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #3f3f46 75%),
			linear-gradient(-45deg, transparent 75%, #3f3f46 75%);
	}

	.cp-hue {
		background: linear-gradient(
			to right,
			#f00,
			#ff0,
			#0f0,
			#0ff,
			#00f,
			#f0f,
			#f00
		);
	}

	.cp-alpha {
		background-image:
			linear-gradient(to right, transparent, var(--cp-alpha-color)),
			linear-gradient(45deg, #d4d4d8 25%, transparent 25%),
			linear-gradient(-45deg, #d4d4d8 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #d4d4d8 75%),
			linear-gradient(-45deg, transparent 75%, #d4d4d8 75%);
		background-size:
			100% 100%,
			8px 8px,
			8px 8px,
			8px 8px,
			8px 8px;
		background-position:
			0 0,
			0 0,
			0 4px,
			4px -4px,
			-4px 0;
	}

	.cp-hue::-webkit-slider-thumb,
	.cp-alpha::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		height: 14px;
		width: 14px;
		border-radius: 9999px;
		border: 2px solid white;
		background: transparent;
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.25);
		cursor: pointer;
	}

	.cp-hue::-moz-range-thumb,
	.cp-alpha::-moz-range-thumb {
		height: 14px;
		width: 14px;
		border-radius: 9999px;
		border: 2px solid white;
		background: transparent;
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.25);
		cursor: pointer;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>

<script lang="ts" module>
	function clamp(n: number, min: number, max: number) {
		return Math.min(max, Math.max(min, n));
	}

	function hsvToRgb(h: number, s: number, v: number) {
		const c = v * s;
		const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
		const m = v - c;
		let r = 0,
			g = 0,
			b = 0;
		if (h < 60) [r, g, b] = [c, x, 0];
		else if (h < 120) [r, g, b] = [x, c, 0];
		else if (h < 180) [r, g, b] = [0, c, x];
		else if (h < 240) [r, g, b] = [0, x, c];
		else if (h < 300) [r, g, b] = [x, 0, c];
		else [r, g, b] = [c, 0, x];
		return {
			r: Math.round((r + m) * 255),
			g: Math.round((g + m) * 255),
			b: Math.round((b + m) * 255)
		};
	}

	function rgbToHsv(r: number, g: number, b: number) {
		r /= 255;
		g /= 255;
		b /= 255;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		const d = max - min;
		let h = 0;
		if (d !== 0) {
			if (max === r) h = ((g - b) / d) % 6;
			else if (max === g) h = (b - r) / d + 2;
			else h = (r - g) / d + 4;
			h *= 60;
			if (h < 0) h += 360;
		}
		const s = max === 0 ? 0 : d / max;
		return { h, s, v: max };
	}

	function parseColor(input: string): { r: number; g: number; b: number; a: number } | null {
		const raw = input.trim().toLowerCase();
		if (!raw) return null;
		if (raw === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };

		if (raw.startsWith('#')) {
			const hex = raw.slice(1);
			if (hex.length === 3) {
				return {
					r: parseInt(hex[0] + hex[0], 16),
					g: parseInt(hex[1] + hex[1], 16),
					b: parseInt(hex[2] + hex[2], 16),
					a: 1
				};
			}
			if (hex.length === 4) {
				return {
					r: parseInt(hex[0] + hex[0], 16),
					g: parseInt(hex[1] + hex[1], 16),
					b: parseInt(hex[2] + hex[2], 16),
					a: parseInt(hex[3] + hex[3], 16) / 255
				};
			}
			if (hex.length === 6 || hex.length === 8) {
				return {
					r: parseInt(hex.slice(0, 2), 16),
					g: parseInt(hex.slice(2, 4), 16),
					b: parseInt(hex.slice(4, 6), 16),
					a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1
				};
			}
		}

		const rgba = raw.match(
			/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/
		);
		if (rgba) {
			return {
				r: clamp(Number(rgba[1]), 0, 255),
				g: clamp(Number(rgba[2]), 0, 255),
				b: clamp(Number(rgba[3]), 0, 255),
				a: rgba[4] !== undefined ? clamp(Number(rgba[4]), 0, 1) : 1
			};
		}

		const hsla = raw.match(
			/^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)$/
		);
		if (hsla) {
			const h = Number(hsla[1]);
			const s = Number(hsla[2]) / 100;
			const l = Number(hsla[3]) / 100;
			const a = hsla[4] !== undefined ? clamp(Number(hsla[4]), 0, 1) : 1;
			const c = (1 - Math.abs(2 * l - 1)) * s;
			const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
			const m = l - c / 2;
			let r = 0,
				g = 0,
				b = 0;
			if (h < 60) [r, g, b] = [c, x, 0];
			else if (h < 120) [r, g, b] = [x, c, 0];
			else if (h < 180) [r, g, b] = [0, c, x];
			else if (h < 240) [r, g, b] = [0, x, c];
			else if (h < 300) [r, g, b] = [x, 0, c];
			else [r, g, b] = [c, 0, x];
			return {
				r: Math.round((r + m) * 255),
				g: Math.round((g + m) * 255),
				b: Math.round((b + m) * 255),
				a
			};
		}

		return null;
	}

	function toHex(n: number) {
		return n.toString(16).padStart(2, '0');
	}

	function formatColor(
		r: number,
		g: number,
		b: number,
		a: number,
		format: ColorFormat,
		withAlpha: boolean
	) {
		if (format === 'rgb') {
			return withAlpha
				? `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(2))})`
				: `rgb(${r}, ${g}, ${b})`;
		}
		if (format === 'hsl') {
			const { h, s, v } = rgbToHsv(r, g, b);
			// approximate HSL from HSV
			const l = v * (1 - s / 2);
			const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
			const hh = Math.round(h);
			const ss = Math.round(sl * 100);
			const ll = Math.round(l * 100);
			return withAlpha
				? `hsla(${hh}, ${ss}%, ${ll}%, ${Number(a.toFixed(2))})`
				: `hsl(${hh}, ${ss}%, ${ll}%)`;
		}
		const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
		if (withAlpha && a < 0.999) return `${hex}${toHex(Math.round(a * 255))}`;
		return hex;
	}
</script>
