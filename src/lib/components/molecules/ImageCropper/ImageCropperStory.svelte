<script lang="ts">
	import ImageCropper from './ImageCropper.svelte';
	import type { CropAspect, CropFormat } from './ImageCropper.svelte';

	let {
		aspectPreset = '1:1',
		showGrid = true,
		showPreview = true,
		outputFormat = 'image/png' as CropFormat,
		outputWidth = 0,
		disabled = false,
		variant = 'default'
	}: {
		aspectPreset?: '1:1' | '4:3' | '16:9' | '3:4' | 'free';
		showGrid?: boolean;
		showPreview?: boolean;
		outputFormat?: CropFormat;
		outputWidth?: number;
		disabled?: boolean;
		variant?: 'default' | 'avatar' | 'banner' | 'jpeg';
	} = $props();

	let result = $state('');

	const aspectMap: Record<string, CropAspect> = {
		'1:1': 1,
		'4:3': 4 / 3,
		'16:9': 16 / 9,
		'3:4': 3 / 4,
		free: 'free'
	};

	const resolvedAspect = $derived(
		variant === 'avatar' ? 1 : variant === 'banner' ? 16 / 9 : aspectMap[aspectPreset]
	);

	const resolvedFormat = $derived<CropFormat>(
		variant === 'jpeg' ? 'image/jpeg' : outputFormat
	);

	// Same-origin-friendly Unsplash URLs with CORS (images.unsplash.com)
	const src = $derived(
		variant === 'avatar'
			? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop'
			: variant === 'banner'
				? 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&auto=format&fit=crop'
				: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&auto=format&fit=crop'
	);

	const label = $derived(
		variant === 'avatar'
			? 'Profile photo'
			: variant === 'banner'
				? 'Cover image'
				: variant === 'jpeg'
					? 'Crop → JPEG'
					: 'Crop image'
	);
</script>

<div class="flex w-full max-w-xl flex-col gap-4">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">Image cropper</p>
		<p class="text-xs leading-relaxed text-secondary">
			Live crop on the left updates as you drag. Click <strong class="font-medium text-primary">Export</strong>
			to generate a {resolvedFormat === 'image/jpeg' ? 'JPEG' : resolvedFormat === 'image/webp' ? 'WebP' : 'PNG'}
			and see it on the right.
		</p>
	</div>

	<ImageCropper
		{src}
		aspect={resolvedAspect}
		{showGrid}
		{showPreview}
		outputFormat={resolvedFormat}
		outputWidth={variant === 'avatar' ? 256 : variant === 'jpeg' ? 640 : outputWidth}
		outputQuality={0.9}
		{disabled}
		{label}
		cropLabel="Export {resolvedFormat === 'image/jpeg' ? 'JPEG' : resolvedFormat === 'image/webp' ? 'WebP' : 'PNG'}"
		description={variant === 'avatar'
			? 'Square crop · exports 256px'
			: variant === 'banner'
				? 'Wide 16:9 cover'
				: variant === 'jpeg'
					? 'Exports JPEG with white background'
					: 'Drag to move · handles to resize'}
		oncrop={(url) => (result = url)}
	/>

	{#if result}
		<p class="text-xs text-muted">
			Parent received export · {Math.round(result.length / 1024)} KB · starts with
			<code class="rounded bg-surface-overlay px-1 text-[10px]">{result.slice(0, 30)}…</code>
		</p>
	{/if}
</div>
