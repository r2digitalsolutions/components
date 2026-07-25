<script lang="ts">
	type SpacerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
	type SpacerAxis = 'y' | 'x' | 'both';

	interface SpacerProps {
		size?: SpacerSize;
		axis?: SpacerAxis;
		class?: string;
	}

	const { size = 'md', axis = 'y', class: className = '' }: SpacerProps = $props();

	const sizes: Record<SpacerSize, string> = {
		xs: '0.25rem',
		sm: '0.5rem',
		md: '1rem',
		lg: '1.5rem',
		xl: '2rem',
		'2xl': '3rem'
	};

	const style = $derived(
		[
			axis === 'y' || axis === 'both' ? `height:${sizes[size]}` : 'height:0',
			axis === 'x' || axis === 'both' ? `width:${sizes[size]}` : 'width:0'
		].join(';')
	);
</script>

<div class={['shrink-0', className]} style={style} aria-hidden="true"></div>
