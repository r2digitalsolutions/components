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

	let isLoaded = $state(false);
	let hasError = $state(false);
	let activeSrc = $state(src);

	$effect(() => {
		activeSrc = src;
		isLoaded = false;
		hasError = false;
	});

	function handleLoad() {
		isLoaded = true;
		hasError = false;
	}

	function handleError() {
		if (fallbackSrc && activeSrc !== fallbackSrc) {
			activeSrc = fallbackSrc;
		} else {
			hasError = true;
			isLoaded = true;
		}
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

	const styleStr = $derived([
		aspectRatio ? `aspect-ratio:${aspectRatio}` : '',
		width ? `width:${typeof width === 'number' ? `${width}px` : width}` : '',
		height ? `height:${typeof height === 'number' ? `${height}px` : height}` : ''
	].filter(Boolean).join(';'));
</script>

<div
	class={['relative overflow-hidden bg-surface-overlay', roundedClass, className]}
	style={styleStr || undefined}
>
	{#if !isLoaded && !hasError}
		<!-- Skeleton shimmer -->
		<div class="absolute inset-0 animate-pulse bg-surface-overlay">
			<div class="h-full w-full bg-gradient-to-r from-surface-overlay via-border to-surface-overlay bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]"></div>
		</div>
	{/if}

	{#if hasError}
		<!-- Error placeholder -->
		<div class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-overlay text-muted">
			<svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 10.5h.008v.008H13.5V10.5zm-7.5 9h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 006 21.75z" />
			</svg>
			<span class="text-xs">{alt || 'Image not found'}</span>
		</div>
	{:else}
		<img
			src={activeSrc}
			{alt}
			{loading}
			onload={handleLoad}
			onerror={handleError}
			class={[
				'block h-full w-full transition-opacity duration-300',
				objectFitClass,
				isLoaded ? 'opacity-100' : 'opacity-0'
			]}
		/>
	{/if}
</div>

<style>
	@keyframes shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}
</style>
