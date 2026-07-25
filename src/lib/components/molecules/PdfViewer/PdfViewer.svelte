<script lang="ts">
	import Surface from '$lib/components/atoms/Surface/Surface.svelte';
	import Link from '$lib/components/atoms/Link/Link.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	interface PdfViewerProps {
		src: string;
		title?: string;
		height?: string;
		class?: string;
	}

	const {
		src,
		title = 'Document',
		height = '28rem',
		class: className = ''
	}: PdfViewerProps = $props();
</script>

<Surface variant="elevated" padding="none" radius="2xl" class={['overflow-hidden', className].filter(Boolean).join(' ')}>
	<div class="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
		<Text size="sm" tone="primary" as="span" class="font-medium">{title}</Text>
		<Link href={src} external size="sm">Open</Link>
	</div>
	<iframe {src} title={title} class="w-full border-0 bg-surface" style:height={height}></iframe>
</Surface>
