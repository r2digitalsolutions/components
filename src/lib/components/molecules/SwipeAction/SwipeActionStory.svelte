<script lang="ts">
	import SwipeAction, {
		type SwipeActionItem
	} from './SwipeAction.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	type Example = 'mail' | 'inbox' | 'tasks' | 'files' | 'rightOnly' | 'leftOnly' | 'disabled';

	let props = $props<{
		example?: Example;
		threshold?: number;
		closeOnAction?: boolean;
		disabled?: boolean;
	}>();

	let last = $state('—');
	let openSide = $state<'left' | 'right' | 'closed'>('closed');
	let hidden = $state<Record<string, boolean>>({});

	const example = $derived(props.example ?? 'mail');

	function act(id: string, label: string) {
		last = label;
		if (id === 'delete' || id === 'trash') {
			hidden = { ...hidden, [example]: true };
		}
	}

	const mailLeft: SwipeActionItem[] = [
		{ id: 'archive', label: 'Archive', variant: 'brand', onclick: () => act('archive', 'Archive') },
		{ id: 'snooze', label: 'Snooze', variant: 'muted', onclick: () => act('snooze', 'Snooze') }
	];

	const mailRight: SwipeActionItem[] = [
		{ id: 'read', label: 'Read', variant: 'default', onclick: () => act('read', 'Mark read') },
		{ id: 'flag', label: 'Flag', variant: 'warning', onclick: () => act('flag', 'Flag') },
		{ id: 'trash', label: 'Delete', variant: 'danger', onclick: () => act('trash', 'Delete') }
	];

	const inboxLeft: SwipeActionItem[] = [
		{ id: 'pin', label: 'Pin', variant: 'brand', onclick: () => act('pin', 'Pin') }
	];

	const inboxRight: SwipeActionItem[] = [
		{ id: 'reply', label: 'Reply', variant: 'success', onclick: () => act('reply', 'Reply') },
		{ id: 'more', label: 'More', variant: 'muted', onclick: () => act('more', 'More') },
		{ id: 'delete', label: 'Delete', variant: 'danger', onclick: () => act('delete', 'Delete') }
	];

	const tasksLeft: SwipeActionItem[] = [
		{ id: 'done', label: 'Done', variant: 'success', onclick: () => act('done', 'Done') },
		{ id: 'later', label: 'Later', variant: 'warning', onclick: () => act('later', 'Later') },
		{ id: 'assign', label: 'Assign', variant: 'brand', onclick: () => act('assign', 'Assign') }
	];

	const tasksRight: SwipeActionItem[] = [
		{ id: 'edit', label: 'Edit', variant: 'default', onclick: () => act('edit', 'Edit') },
		{ id: 'delete', label: 'Delete', variant: 'danger', onclick: () => act('delete', 'Delete') }
	];

	const filesLeft: SwipeActionItem[] = [
		{ id: 'share', label: 'Share', variant: 'brand', onclick: () => act('share', 'Share') },
		{ id: 'star', label: 'Star', variant: 'warning', onclick: () => act('star', 'Star') }
	];

	const filesRight: SwipeActionItem[] = [
		{ id: 'rename', label: 'Rename', variant: 'default', onclick: () => act('rename', 'Rename') },
		{ id: 'move', label: 'Move', variant: 'muted', onclick: () => act('move', 'Move') },
		{ id: 'copy', label: 'Copy', variant: 'success', onclick: () => act('copy', 'Copy') },
		{ id: 'delete', label: 'Delete', variant: 'danger', onclick: () => act('delete', 'Delete') }
	];

	const rightOnly: SwipeActionItem[] = [
		{ id: 'mute', label: 'Mute', variant: 'muted', onclick: () => act('mute', 'Mute') },
		{ id: 'block', label: 'Block', variant: 'warning', onclick: () => act('block', 'Block') },
		{ id: 'delete', label: 'Delete', variant: 'danger', onclick: () => act('delete', 'Delete') }
	];

	const leftOnly: SwipeActionItem[] = [
		{ id: 'restore', label: 'Restore', variant: 'success', onclick: () => act('restore', 'Restore') },
		{ id: 'keep', label: 'Keep', variant: 'brand', onclick: () => act('keep', 'Keep') }
	];

	const rows = $derived.by(() => {
		switch (example) {
			case 'inbox':
				return {
					title: 'Alex Rivera',
					subtitle: 'Swipe both ways · design review notes',
					left: inboxLeft,
					right: inboxRight
				};
			case 'tasks':
				return {
					title: 'Ship SpeedDial docs',
					subtitle: 'Due today · high priority',
					left: tasksLeft,
					right: tasksRight
				};
			case 'files':
				return {
					title: 'brand-guidelines.pdf',
					subtitle: '2.4 MB · Updated 2h ago',
					left: filesLeft,
					right: filesRight
				};
			case 'rightOnly':
				return {
					title: 'Unknown sender',
					subtitle: 'Swipe left for moderation actions',
					left: [] as SwipeActionItem[],
					right: rightOnly
				};
			case 'leftOnly':
				return {
					title: 'Deleted draft',
					subtitle: 'Swipe right to restore',
					left: leftOnly,
					right: [] as SwipeActionItem[]
				};
			case 'disabled':
				return {
					title: 'Locked conversation',
					subtitle: 'Swipe disabled on this row',
					left: mailLeft,
					right: mailRight
				};
			default:
				return {
					title: 'Invoice reminder',
					subtitle: 'From billing@acme.com · swipe either side',
					left: mailLeft,
					right: mailRight
				};
		}
	});
</script>

<div class="w-full max-w-md space-y-3">
	<div class="space-y-0.5">
		<p class="text-xs text-secondary">
			Last action: <span class="font-medium text-primary">{last}</span>
			· side: <span class="font-medium text-primary">{openSide}</span>
		</p>
		<p class="text-[11px] text-muted">
			Drag with grab cursor · ← → keys also reveal · Esc closes
		</p>
	</div>

	{#if hidden[example]}
		<div
			class="rounded-xl border border-dashed border-border bg-surface px-3 py-4 text-center"
		>
			<Text size="sm" tone="muted">Row removed — remount story to reset</Text>
		</div>
	{:else}
		<SwipeAction
			leftActions={rows.left}
			rightActions={rows.right}
			threshold={props.threshold}
			closeOnAction={props.closeOnAction ?? true}
			disabled={props.disabled ?? example === 'disabled'}
			onopen={(side) => (openSide = side)}
			onclose={() => (openSide = 'closed')}
		>
			<div class="flex items-center gap-3 px-3 py-3">
				<div
					class={[
						'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
						example === 'files'
							? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
							: example === 'tasks'
								? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
								: 'bg-brand-500/15 text-brand-700 dark:text-brand-300'
					]}
				>
					{rows.title.slice(0, 2).toUpperCase()}
				</div>
				<div class="min-w-0">
					<p class="truncate text-sm font-medium text-primary">{rows.title}</p>
					<p class="truncate text-xs text-secondary">{rows.subtitle}</p>
				</div>
			</div>
		</SwipeAction>
	{/if}
</div>
