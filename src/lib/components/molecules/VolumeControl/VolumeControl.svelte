<script lang="ts">
	import Volume2 from '@lucide/svelte/icons/volume-2';
	import Volume1 from '@lucide/svelte/icons/volume-1';
	import VolumeX from '@lucide/svelte/icons/volume-x';

	interface VolumeControlProps {
		value?: number;
		muted?: boolean;
		disabled?: boolean;
		/** Show numeric percent */
		showValue?: boolean;
		/**
		 * inline = icon + always-visible slider
		 * compact = mute icon; slider expands on hover/focus/drag
		 */
		variant?: 'inline' | 'compact';
		class?: string;
		onchange?: (value: number) => void;
		onmutechange?: (muted: boolean) => void;
	}

	let {
		value = $bindable(1),
		muted = $bindable(false),
		disabled = false,
		showValue = false,
		variant = 'inline',
		class: className = '',
		onchange,
		onmutechange
	}: VolumeControlProps = $props();

	let hovered = $state(false);
	let focused = $state(false);
	let dragging = $state(false);

	const Icon = $derived(muted || value === 0 ? VolumeX : value < 0.45 ? Volume1 : Volume2);
	const expanded = $derived(variant === 'inline' || hovered || focused || dragging);
	const displayValue = $derived(muted ? 0 : value);

	function toggleMute() {
		if (disabled) return;
		muted = !muted;
		onmutechange?.(muted);
	}

	function onInput(e: Event) {
		const next = Number((e.currentTarget as HTMLInputElement).value);
		value = next;
		if (next > 0 && muted) {
			muted = false;
			onmutechange?.(false);
		}
		onchange?.(next);
	}

	function startDrag(e: PointerEvent) {
		if (disabled || e.button !== 0) return;
		dragging = true;
		(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
	}

	function endDrag(e: PointerEvent) {
		if (!dragging) return;
		const el = e.currentTarget as HTMLElement;
		if (el.hasPointerCapture?.(e.pointerId)) {
			el.releasePointerCapture(e.pointerId);
		}
		dragging = false;
	}
</script>

<div
	class={[
		'flex items-center',
		variant === 'compact' ? 'justify-end gap-0' : 'gap-1.5',
		className
	]}
	role="group"
	aria-label="Volume"
	onpointerenter={() => (hovered = true)}
	onpointerleave={() => {
		if (!dragging) hovered = false;
	}}
>
	{#if variant === 'compact'}
		<!--
			Slider lives INSIDE the hover box and expands width (not absolute outside),
			so moving onto the range doesn't drop :hover / pointer-events.
		-->
		<div
			class={[
				'flex items-center overflow-hidden transition-[width,opacity,margin] duration-200 ease-out',
				expanded ? 'mr-1 w-20 opacity-100' : 'mr-0 w-0 opacity-0'
			]}
		>
			<input
				type="range"
				min="0"
				max="1"
				step="0.01"
				value={displayValue}
				oninput={onInput}
				onpointerdown={startDrag}
				onpointerup={endDrag}
				onpointercancel={endDrag}
				onfocus={() => (focused = true)}
				onblur={() => (focused = false)}
				{disabled}
				tabindex={expanded ? 0 : -1}
				class="h-1.5 w-20 min-w-20 cursor-pointer accent-brand-500 disabled:cursor-not-allowed"
				aria-label="Volume"
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={Math.round(displayValue * 100)}
			/>
		</div>
	{/if}

	<button
		type="button"
		class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-secondary transition hover:bg-surface-overlay hover:text-primary disabled:opacity-50"
		onclick={toggleMute}
		{disabled}
		aria-label={muted ? 'Unmute' : 'Mute'}
		aria-pressed={muted}
	>
		<Icon class="h-4 w-4" strokeWidth={2} />
	</button>

	{#if variant === 'inline'}
		<input
			type="range"
			min="0"
			max="1"
			step="0.01"
			value={displayValue}
			oninput={onInput}
			{disabled}
			class="h-1.5 w-20 max-w-[6rem] cursor-pointer accent-brand-500 disabled:cursor-not-allowed sm:w-24"
			aria-label="Volume"
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={Math.round(displayValue * 100)}
		/>
		{#if showValue}
			<span class="w-8 text-right font-mono text-[10px] tabular-nums text-muted">
				{Math.round(displayValue * 100)}
			</span>
		{/if}
	{/if}
</div>
