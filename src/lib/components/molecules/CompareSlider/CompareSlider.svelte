<script lang="ts">
	import Image from '$lib/components/atoms/Image/Image.svelte';

	interface CompareSliderProps {
		beforeSrc: string;
		afterSrc: string;
		beforeAlt?: string;
		afterAlt?: string;
		value?: number;
		class?: string;
	}

	let {
		beforeSrc,
		afterSrc,
		beforeAlt = 'Before',
		afterAlt = 'After',
		value = $bindable(50),
		class: className = ''
	}: CompareSliderProps = $props();
</script>

<div
	class={[
		'relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-surface',
		className
	]}
>
	<div class="absolute inset-0">
		<Image src={afterSrc} alt={afterAlt} objectFit="cover" class="h-full w-full" />
	</div>

	<div class="pointer-events-none absolute inset-0" style:clip-path={`inset(0 ${100 - value}% 0 0)`}>
		<Image src={beforeSrc} alt={beforeAlt} objectFit="cover" class="h-full w-full" />
	</div>

	<div
		class="absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-white shadow"
		style:left={`${value}%`}
		aria-hidden="true"
	>
		<span
			class="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface-elevated text-primary shadow"
		>
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M8 12H4m16 0h-4M9 8l-4 4 4 4m6-8l4 4-4 4"
				/>
			</svg>
		</span>
	</div>

	<input
		type="range"
		min="0"
		max="100"
		bind:value
		aria-label="Compare before and after"
		class="absolute inset-0 z-20 cursor-ew-resize opacity-0"
	/>

	<span
		class="pointer-events-none absolute left-3 top-3 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white"
	>
		Before
	</span>
	<span
		class="pointer-events-none absolute right-3 top-3 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white"
	>
		After
	</span>
</div>
