<script lang="ts">
	import SpeedDial from './SpeedDial.svelte';
	import type {
		SpeedDialAction,
		SpeedDialDirection,
		SpeedDialLabels,
		SpeedDialPosition,
		SpeedDialSize,
		SpeedDialVariant
	} from './SpeedDial.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	type Example = 'compose' | 'media' | 'toolbar' | 'destructive';

	let props = $props<{
		example?: Example;
		position?: SpeedDialPosition;
		direction?: SpeedDialDirection;
		variant?: SpeedDialVariant;
		size?: SpeedDialSize;
		showLabels?: SpeedDialLabels;
		backdrop?: boolean;
		closeOnAction?: boolean;
		closeOnOutsideClick?: boolean;
		closeOnEscape?: boolean;
	}>();

	let open = $state(false);
	let last = $state('—');

	const example = $derived(props.example ?? 'compose');

	const composeActions: SpeedDialAction[] = [
		{ id: 'note', label: 'New note', icon: 'note', onclick: () => (last = 'note') },
		{ id: 'upload', label: 'Upload file', icon: 'upload', onclick: () => (last = 'upload') },
		{ id: 'invite', label: 'Invite', icon: 'invite', onclick: () => (last = 'invite') },
		{ id: 'mail', label: 'Send email', icon: 'mail', onclick: () => (last = 'mail') }
	];

	const mediaActions: SpeedDialAction[] = [
		{ id: 'camera', label: 'Camera', icon: 'camera', onclick: () => (last = 'camera') },
		{ id: 'image', label: 'Gallery', icon: 'image', onclick: () => (last = 'image') },
		{ id: 'file', label: 'Document', icon: 'file', onclick: () => (last = 'file') },
		{ id: 'link', label: 'Attach link', icon: 'link', onclick: () => (last = 'link') }
	];

	const toolbarActions: SpeedDialAction[] = [
		{ id: 'edit', label: 'Edit', icon: 'edit', onclick: () => (last = 'edit') },
		{ id: 'copy', label: 'Duplicate', icon: 'copy', onclick: () => (last = 'copy') },
		{ id: 'share', label: 'Share', icon: 'share', onclick: () => (last = 'share') },
		{ id: 'star', label: 'Favorite', icon: 'star', onclick: () => (last = 'star') },
		{ id: 'search', label: 'Find in page', icon: 'search', onclick: () => (last = 'search') }
	];

	const destructiveActions: SpeedDialAction[] = [
		{ id: 'edit', label: 'Rename', icon: 'edit', onclick: () => (last = 'rename') },
		{ id: 'share', label: 'Share', icon: 'share', onclick: () => (last = 'share') },
		{
			id: 'trash',
			label: 'Delete',
			icon: 'trash',
			variant: 'destructive',
			onclick: () => (last = 'delete')
		}
	];

	const actions = $derived(
		example === 'media'
			? mediaActions
			: example === 'toolbar'
				? toolbarActions
				: example === 'destructive'
					? destructiveActions
					: composeActions
	);
</script>

<div
	class="relative h-72 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface"
>
	<div class="space-y-1 p-4">
		<Text size="sm" class="font-medium text-primary">Speed dial playground</Text>
		<p class="text-xs text-secondary">
			Last action: <span class="font-medium text-primary">{last}</span>
			· open: {open ? 'yes' : 'no'}
		</p>
		<p class="text-[11px] text-muted">
			Escape / outside click close when enabled. Labels: {props.showLabels ?? 'hover'}.
		</p>
	</div>

	<SpeedDial
		bind:open
		{actions}
		position={props.position ?? 'bottom-right'}
		direction={props.direction ?? 'auto'}
		variant={props.variant ?? 'primary'}
		size={props.size ?? 'lg'}
		showLabels={props.showLabels ?? 'hover'}
		backdrop={props.backdrop ?? false}
		closeOnAction={props.closeOnAction ?? true}
		closeOnOutsideClick={props.closeOnOutsideClick ?? true}
		closeOnEscape={props.closeOnEscape ?? true}
	/>
</div>
