<script lang="ts">
	export type SkeletonAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	export type SkeletonAvatarShape = 'circle' | 'rounded';

	interface SkeletonAvatarProps {
		size?: SkeletonAvatarSize;
		shape?: SkeletonAvatarShape;
		class?: string;
	}

	const {
		size = 'md',
		shape = 'circle',
		class: className = ''
	}: SkeletonAvatarProps = $props();

	const sizeClasses: Record<SkeletonAvatarSize, string> = {
		xs: 'h-6 w-6',
		sm: 'h-8 w-8',
		md: 'h-10 w-10',
		lg: 'h-12 w-12',
		xl: 'h-16 w-16'
	};

	const shapeClasses: Record<SkeletonAvatarShape, string> = {
		circle: 'rounded-full',
		rounded: 'rounded-lg'
	};
</script>

<div
	class={[
		'shrink-0 animate-pulse bg-border-strong dark:bg-surface-overlay',
		sizeClasses[size],
		shapeClasses[shape],
		className
	]}
	aria-hidden="true"
></div>
