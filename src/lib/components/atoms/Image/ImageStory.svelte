<script lang="ts">
	import Image from './Image.svelte';

	let props = $props<{
		src?: string;
		alt?: string;
		fallbackSrc?: string;
		aspectRatio?: string;
		rounded?: boolean;
		objectFit?: 'cover' | 'contain';
		loading?: 'lazy' | 'eager';
	}>();
</script>

<div class="p-6 flex flex-wrap gap-6 items-start">
	<!-- Normal image -->
	<div class="flex flex-col gap-2">
		<p class="text-xs text-secondary font-medium">Normal (cover)</p>
		<Image
			src={props.src ?? 'https://picsum.photos/seed/r2digi/400/300'}
			alt={props.alt ?? 'Sample image'}
			aspectRatio={props.aspectRatio ?? '4/3'}
			rounded={props.rounded ?? true}
			objectFit={props.objectFit ?? 'cover'}
			loading={props.loading ?? 'lazy'}
			class="w-48"
		/>
	</div>

	<!-- With fallback on error -->
	<div class="flex flex-col gap-2">
		<p class="text-xs text-secondary font-medium">With fallback</p>
		<Image
			src="https://broken-url.invalid/image.jpg"
			fallbackSrc="https://picsum.photos/seed/fallback/400/300"
			alt="Broken with fallback"
			aspectRatio="4/3"
			rounded
			class="w-48"
		/>
	</div>

	<!-- Error state (no fallback) -->
	<div class="flex flex-col gap-2">
		<p class="text-xs text-secondary font-medium">Error state</p>
		<Image
			src="https://broken-url.invalid/image.jpg"
			alt="Broken image"
			aspectRatio="4/3"
			rounded
			class="w-48"
		/>
	</div>

	<!-- Rounded full (avatar-like) -->
	<div class="flex flex-col gap-2">
		<p class="text-xs text-secondary font-medium">Rounded full</p>
		<Image
			src="https://picsum.photos/seed/avatar/200/200"
			alt="Avatar"
			rounded="full"
			class="w-20 h-20"
		/>
	</div>
</div>
