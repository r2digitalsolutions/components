<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import PhoneFrame from '$lib/components/molecules/PhoneFrame/PhoneFrame.svelte';
	import ActionSheet from './ActionSheet.svelte';
	import type { ActionSheetItem } from './ActionSheet.svelte';

	interface Props {
		example?: 'photo' | 'share' | 'account' | 'sort' | 'confirmDelete' | 'disabled';
	}

	let { example = 'photo' }: Props = $props();

	let open = $state(false);
	let last = $state('');

	const sheets: Record<
		NonNullable<Props['example']>,
		{ title?: string; message?: string; cancelLabel?: string; actions: ActionSheetItem[] }
	> = {
		photo: {
			title: 'Photo options',
			message: 'Choose how you want to continue',
			actions: [
				{ id: 'camera', label: 'Take photo' },
				{ id: 'library', label: 'Choose from library' },
				{ id: 'file', label: 'Upload file', description: 'PNG, JPG up to 10 MB' },
				{ id: 'delete', label: 'Delete photo', variant: 'destructive' }
			]
		},
		share: {
			title: 'Share',
			message: 'Send this project to your team',
			actions: [
				{ id: 'link', label: 'Copy link', description: 'Anyone with the link can view' },
				{ id: 'email', label: 'Email' },
				{ id: 'slack', label: 'Share to Slack' },
				{ id: 'qr', label: 'Show QR code' }
			]
		},
		account: {
			title: 'Account',
			actions: [
				{ id: 'profile', label: 'View profile' },
				{ id: 'settings', label: 'Settings' },
				{ id: 'switch', label: 'Switch workspace', description: 'R2 Digi · Acme Labs' },
				{ id: 'logout', label: 'Sign out', variant: 'destructive' }
			]
		},
		sort: {
			title: 'Sort by',
			actions: [
				{ id: 'recent', label: 'Most recent' },
				{ id: 'name', label: 'Name A–Z' },
				{ id: 'size', label: 'File size' },
				{ id: 'type', label: 'Type' }
			]
		},
		confirmDelete: {
			title: 'Delete conversation?',
			message: 'This cannot be undone. Messages will be removed for everyone.',
			cancelLabel: 'Keep conversation',
			actions: [
				{ id: 'archive', label: 'Archive instead' },
				{ id: 'delete', label: 'Delete forever', variant: 'destructive' }
			]
		},
		disabled: {
			title: 'Export',
			message: 'Some formats need a Pro plan',
			actions: [
				{ id: 'csv', label: 'CSV' },
				{ id: 'json', label: 'JSON' },
				{ id: 'pdf', label: 'PDF report', description: 'Pro only', disabled: true },
				{ id: 'xlsx', label: 'Excel', description: 'Pro only', disabled: true }
			]
		}
	};

	const cfg = $derived(sheets[example]);

	const labels: Record<NonNullable<Props['example']>, string> = {
		photo: 'Open photo sheet',
		share: 'Open share sheet',
		account: 'Open account sheet',
		sort: 'Open sort sheet',
		confirmDelete: 'Delete conversation',
		disabled: 'Open export sheet'
	};

	$effect(() => {
		example;
		open = false;
		last = '';
	});
</script>

<PhoneFrame size="sm" class="mx-auto">
	<div class="flex h-full flex-col bg-surface">
		<div class="flex-1 space-y-3 p-4 pt-10">
			<p class="text-sm font-semibold text-primary">ActionSheet</p>
			<p class="text-xs leading-relaxed text-muted">
				Bottom sheet with optional title, descriptions, destructive actions, and disabled rows.
			</p>
			<Button
				size="sm"
				variant={example === 'confirmDelete' ? 'destructive' : 'primary'}
				fullWidth
				onclick={() => (open = true)}
			>
				{labels[example]}
			</Button>
			{#if last}
				<p class="text-xs text-secondary">
					Selected: <span class="font-medium text-primary">{last}</span>
				</p>
			{/if}
		</div>
	</div>
</PhoneFrame>

<ActionSheet
	bind:open
	title={cfg.title}
	message={cfg.message}
	actions={cfg.actions}
	cancelLabel={cfg.cancelLabel}
	onselect={(id) => (last = id)}
/>
