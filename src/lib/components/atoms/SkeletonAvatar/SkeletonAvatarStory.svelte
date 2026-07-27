<script lang="ts">
	import SkeletonAvatar from './SkeletonAvatar.svelte';
	import type { SkeletonAvatarShape, SkeletonAvatarSize } from './SkeletonAvatar.svelte';

	let props = $props<{
		size?: SkeletonAvatarSize;
		shape?: SkeletonAvatarShape;
	}>();
</script>

<div class="flex items-end gap-4">
	<SkeletonAvatar size={props.size ?? 'md'} shape={props.shape ?? 'circle'} />
	<SkeletonAvatar size="sm" shape={props.shape ?? 'circle'} />
	<SkeletonAvatar size="lg" shape={props.shape ?? 'circle'} />
</div>
