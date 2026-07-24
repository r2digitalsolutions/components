<script lang="ts">
	import ToastContainer from './ToastContainer.svelte';
	import { toast, type ToastPosition } from './toast.svelte.js';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Dialog from '$lib/components/organisms/Dialog/Dialog.svelte';

	let props = $props<{
		position?: ToastPosition;
	}>();

	let dialogOpen = $state(false);

	function stackDemo() {
		toast.info('Sync started', 'Workspace');
		setTimeout(() => toast.success('Files uploaded', 'Done'), 250);
		setTimeout(() => toast.warning('2 items need review', 'Attention'), 500);
		setTimeout(() => toast.error('One file failed validation', 'Partial failure'), 750);
	}
</script>

<div class="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col gap-6 p-6">
	<div>
		<h2 class="text-lg font-semibold text-primary">Toast playground</h2>
		<p class="mt-1 text-sm text-secondary">
			Rendered with <code class="text-primary">popover="manual"</code> (top layer — above dialogs).
		</p>
	</div>

	<section class="rounded-2xl border border-border bg-surface-elevated p-4">
		<h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-secondary">Variants</h3>
		<div class="flex flex-wrap gap-2">
			<Button size="sm" variant="secondary" onclick={() => toast.show('Plain notification')}>Default</Button>
			<Button size="sm" variant="secondary" onclick={() => toast.success('Changes saved', 'Success')}>
				Success
			</Button>
			<Button size="sm" variant="secondary" onclick={() => toast.error('Request failed', 'Error')}>
				Error
			</Button>
			<Button size="sm" variant="secondary" onclick={() => toast.warning('Quota at 90%', 'Warning')}>
				Warning
			</Button>
			<Button size="sm" variant="secondary" onclick={() => toast.info('Update available', 'Info')}>
				Info
			</Button>
		</div>
	</section>

	<section class="rounded-2xl border border-border bg-surface-elevated p-4">
		<h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-secondary">Patterns</h3>
		<div class="flex flex-wrap gap-2">
			<Button size="sm" variant="primary" onclick={stackDemo}>Stacked burst</Button>

			<Button
				size="sm"
				variant="secondary"
				onclick={() =>
					toast.card('Your report is ready to download.', {
						title: 'Export complete',
						variant: 'success',
						actions: [
							{ id: 'download', label: 'Download', variant: 'primary', onClick: () => {} },
							{ id: 'later', label: 'Later', variant: 'ghost' }
						]
					})}
			>
				Card + actions
			</Button>

			<Button
				size="sm"
				variant="secondary"
				onclick={() =>
					toast.show('Invite sent to alex@company.com', {
						title: 'Team invite',
						variant: 'info',
						actions: [
							{ id: 'undo', label: 'Undo', variant: 'secondary' },
							{ id: 'view', label: 'View', variant: 'ghost' }
						]
					})}
			>
				With buttons
			</Button>

			<Button
				size="sm"
				variant="secondary"
				onclick={() =>
					toast.pinned('Maintenance window starts in 10 minutes.', {
						title: 'Scheduled maintenance',
						variant: 'warning',
						actions: [{ id: 'details', label: 'Details', variant: 'secondary' }]
					})}
			>
				Pinned
			</Button>

			<Button
				size="sm"
				variant="secondary"
				onclick={() =>
					toast.error('Payment could not be processed.', 'Billing', {
						appearance: 'card',
						actions: [
							{ id: 'retry', label: 'Retry', variant: 'destructive' },
							{ id: 'support', label: 'Contact support', variant: 'secondary' }
						]
					})}
			>
				Error card
			</Button>

			<Button size="sm" variant="ghost" onclick={() => toast.clear()}>Clear all</Button>
		</div>
	</section>

	<section class="rounded-2xl border border-border bg-surface-elevated p-4">
		<h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-secondary">Top layer check</h3>
		<p class="mb-3 text-sm text-secondary">
			Open the dialog and fire the toast from inside it — the toast should appear above the modal
			(popover top layer). Clicking outside the dialog still closes it by design.
		</p>
		<Button size="sm" variant="outline" onclick={() => (dialogOpen = true)}>Open dialog</Button>
	</section>
</div>

<Dialog
	bind:open={dialogOpen}
	title="Dialog open"
	description="This modal uses the native dialog element. Fire a toast below — it uses the popover top layer."
	hideFooter
	showClose
>
	<div class="flex flex-col gap-3 py-1">
		<p class="text-sm text-secondary">
			If the toast renders above this panel, top-layer stacking works.
		</p>
		<div class="flex flex-wrap gap-2">
			<Button
				size="sm"
				variant="primary"
				onclick={() => toast.success('Appeared above this dialog', 'Top layer')}
			>
				Fire toast
			</Button>
			<Button size="sm" variant="secondary" onclick={() => (dialogOpen = false)}>Close</Button>
		</div>
	</div>
</Dialog>

<ToastContainer position={props.position ?? 'bottom-right'} />
