<script lang="ts">
	type ObjectFit = 'cover' | 'contain' | 'fill' | 'none';
	type LoadingStrategy = 'lazy' | 'eager';

	interface ImageProps {
		src: string;
		alt: string;
		fallbackSrc?: string;
		aspectRatio?: string;
		rounded?: boolean | 'sm' | 'md' | 'lg' | 'xl' | 'full';
		objectFit?: ObjectFit;
		loading?: LoadingStrategy;
		width?: number | string;
		height?: number | string;
		class?: string;
	}

	let {
		src,
		alt,
		fallbackSrc,
		aspectRatio,
		rounded = false,
		objectFit = 'cover',
		loading = 'lazy',
		width,
		height,
		class: className = ''
	}: ImageProps = $props();

	let hasError = $state(false);
	let useFallback = $state(false);

	const displaySrc = $derived(useFallback && fallbackSrc ? fallbackSrc : src);

	$effect(() => {
		void src;
		useFallback = false;
		hasError = false;
	});

	function onError() {
		if (fallbackSrc && !useFallback) {
			useFallback = true;
			hasError = false;
			return;
		}
		hasError = true;
	}

	const roundedClass = $derived(
		rounded === false
			? ''
			: rounded === true || rounded === 'md'
				? 'rounded-lg'
				: rounded === 'sm'
					? 'rounded-md'
					: rounded === 'lg'
						? 'rounded-xl'
						: rounded === 'xl'
							? 'rounded-2xl'
							: rounded === 'full'
								? 'rounded-full'
								: ''
	);

	const objectFitClass = $derived(
		objectFit === 'cover'
			? 'object-cover'
			: objectFit === 'contain'
				? 'object-contain'
				: objectFit === 'fill'
					? 'object-fill'
					: 'object-none'
	);

	const styleStr = $derived(
		[
			aspectRatio ? `aspect-ratio:${aspectRatio}` : '',
			width ? `width:${typeof width === 'number' ? `${width}px` : width}` : '',
			height ? `height:${typeof height === 'number' ? `${height}px` : height}` : ''
		]
			.filter(Boolean)
			.join(';')
	);
</script>

<div
	class={['relative overflow-hidden bg-surface-overlay', roundedClass, className]}
	style={styleStr || undefined}
>
	{#if hasError}
		<div
			class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-overlay text-muted"
		>
			<svg
				class="h-8 w-8"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 10.5h.008v.008H13.5V10.5zm-7.5 9h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 006 21.75z"
				/>
			</svg>
			<span class="text-xs">{alt || 'Image not found'}</span>
		</div>
	{:else}
		{#key displaySrc}
			<img
				src={displaySrc}
				{alt}
				{loading}
				decoding="async"
				onerror={onError}
				class={['block h-full w-full', objectFitClass]}
			/>
		{/key}
	{/if}
</div>
