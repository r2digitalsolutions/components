<script lang="ts">
	import ProfileHeaderUploader from './ProfileHeaderUploader.svelte';

	let props = $props<{
		label?: string;
		coverHelperText?: string;
		avatarHelperText?: string;
		accept?: string;
		maxCoverMb?: number;
		maxAvatarMb?: number;
		disabled?: boolean;
	}>();
</script>

<div class="w-[28rem] max-w-full">
	<ProfileHeaderUploader
		label={props.label ?? 'Profile media'}
		coverHelperText={props.coverHelperText ?? 'Cover · PNG or JPG · max 10MB'}
		avatarHelperText={props.avatarHelperText ?? 'Avatar · square image recommended'}
		accept={props.accept ?? 'image/*'}
		maxCoverMb={props.maxCoverMb ?? 10}
		maxAvatarMb={props.maxAvatarMb ?? 5}
		disabled={props.disabled ?? false}
	/>
</div>
