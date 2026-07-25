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
		 * compact = mute icon; slider appears on hover/focus
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

	const Icon = $derived(muted || value === 0 ? VolumeX : value < 0.45 ? Volume1 : Volume2);

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
</script>

{#if variant === 'compact'}
	<div
		class={[
			'group/vol relative flex items-center justify-end',
			className
		]}
	>
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
		<div
			class="pointer-events-none absolute right-full top-1/2 mr-1 flex -translate-y-1/2 items-center opacity-0 transition group-hover/vol:pointer-events-auto group-hover/vol:opacity-100 group-focus-within/vol:pointer-events-auto group-focus-within/vol:opacity-100"
		>
			<input
				type="range"
				min="0"
				max="1"
				step="0.01"
				value={muted ? 0 : value}
				oninput={onInput}
				{disabled}
				class="h-1.5 w-20 cursor-pointer accent-brand-500 disabled:cursor-not-allowed"
				aria-label="Volume"
			/>
		</div>
	</div>
{:else}
	<div class={['flex items-center gap-1.5', className]}>
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
		<input
			type="range"
			min="0"
			max="1"
			step="0.01"
			value={muted ? 0 : value}
			oninput={onInput}
			{disabled}
			class="h-1.5 w-20 max-w-[6rem] cursor-pointer accent-brand-500 disabled:cursor-not-allowed sm:w-24"
			aria-label="Volume"
		/>
		{#if showValue}
			<span class="w-8 text-right font-mono text-[10px] tabular-nums text-muted">
				{Math.round((muted ? 0 : value) * 100)}
			</span>
		{/if}
	</div>
{/if}
