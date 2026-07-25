<script lang="ts">
	import BottomSheet, { type BottomSheetSize } from './BottomSheet.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';

	type Example = 'confirm' | 'actions' | 'form' | 'scroll' | 'minimal';

	let props = $props<{
		example?: Example;
		title?: string;
		description?: string;
		size?: BottomSheetSize;
		maxHeight?: string;
		closeOnBackdrop?: boolean;
		closeOnEscape?: boolean;
		showHandle?: boolean;
		showClose?: boolean;
		blurBackdrop?: boolean;
		draggable?: boolean;
		pullToClose?: boolean;
	}>();

	let open = $state(false);
	let name = $state('');
	let email = $state('');

	const example = $derived(props.example ?? 'confirm');
	const size = $derived(props.size ?? 'lg');
	const closeOnBackdrop = $derived(props.closeOnBackdrop ?? true);
	const closeOnEscape = $derived(props.closeOnEscape ?? true);
	const showHandle = $derived(props.showHandle ?? true);
	const showClose = $derived(props.showClose ?? example !== 'minimal');
	const blurBackdrop = $derived(props.blurBackdrop ?? true);
	const draggable = $derived(props.draggable ?? true);
	const pullToClose = $derived(props.pullToClose ?? true);

	const shareActions = [
		{ id: 'copy', label: 'Copy link' },
		{ id: 'email', label: 'Email' },
		{ id: 'slack', label: 'Slack' },
		{ id: 'export', label: 'Export PDF' }
	];
</script>

<div class="space-y-3">
	<div class="flex flex-wrap gap-2">
		<Button size="sm" onclick={() => (open = true)}>Open sheet</Button>
	</div>

	<p class="text-xs text-secondary">
		{#if draggable && pullToClose}
			Drag the handle or header down to dismiss · Escape / backdrop also close when enabled.
		{:else}
			Use the close control, Escape, or backdrop according to the Storybook controls.
		{/if}
	</p>

	{#if example === 'actions'}
		<BottomSheet
			bind:open
			title={props.title ?? 'Share'}
			description={props.description}
			{size}
			maxHeight={props.maxHeight}
			{closeOnBackdrop}
			{closeOnEscape}
			{showHandle}
			{showClose}
			{blurBackdrop}
			{draggable}
			{pullToClose}
		>
			{#snippet actions()}
				<Button size="sm" variant="ghost" data-no-drag>Help</Button>
			{/snippet}

			<ul class="divide-y divide-border">
				{#each shareActions as item}
					<li>
						<button
							type="button"
							class="flex w-full items-center px-1 py-3 text-left text-sm text-primary hover:bg-surface-muted"
							onclick={() => (open = false)}
						>
							{item.label}
						</button>
					</li>
				{/each}
			</ul>
		</BottomSheet>
	{:else if example === 'form'}
		<BottomSheet
			bind:open
			title={props.title ?? 'Invite teammate'}
			description={props.description ?? 'They will receive an email invitation.'}
			{size}
			maxHeight={props.maxHeight}
			{closeOnBackdrop}
			{closeOnEscape}
			{showHandle}
			{showClose}
			{blurBackdrop}
			{draggable}
			{pullToClose}
		>
			<div class="space-y-3">
				<Input bind:value={name} label="Name" placeholder="Alex Rivera" />
				<Input bind:value={email} label="Email" type="email" placeholder="alex@company.com" />
			</div>

			{#snippet footer()}
				<div class="flex justify-end gap-2">
					<Button size="sm" variant="ghost" onclick={() => (open = false)}>Cancel</Button>
					<Button size="sm" onclick={() => (open = false)}>Send invite</Button>
				</div>
			{/snippet}
		</BottomSheet>
	{:else if example === 'scroll'}
		<BottomSheet
			bind:open
			title={props.title ?? 'Activity'}
			description={props.description ?? 'Pull down or use the handle to dismiss.'}
			{size}
			maxHeight={props.maxHeight}
			{closeOnBackdrop}
			{closeOnEscape}
			{showHandle}
			{showClose}
			{blurBackdrop}
			{draggable}
			{pullToClose}
		>
			<div class="space-y-2">
				{#each Array.from({ length: 16 }, (_, i) => i + 1) as n}
					<div class="rounded-xl border border-border bg-surface px-3 py-2.5">
						<p class="text-sm font-medium text-primary">Event {n}</p>
						<p class="text-xs text-secondary">Scrollable body · drag from top to close.</p>
					</div>
				{/each}
			</div>
		</BottomSheet>
	{:else if example === 'minimal'}
		<BottomSheet
			bind:open
			{size}
			maxHeight={props.maxHeight}
			{closeOnBackdrop}
			{closeOnEscape}
			{showHandle}
			{showClose}
			{blurBackdrop}
			{draggable}
			{pullToClose}
		>
			<Text size="sm">Quick notice without a title chrome. Tap outside or drag to close.</Text>
		</BottomSheet>
	{:else}
		<BottomSheet
			bind:open
			title={props.title ?? 'Confirm action'}
			description={props.description ?? 'This cannot be undone.'}
			{size}
			maxHeight={props.maxHeight}
			{closeOnBackdrop}
			{closeOnEscape}
			{showHandle}
			{showClose}
			{blurBackdrop}
			{draggable}
			{pullToClose}
		>
			<Text size="sm">Delete this project and all of its deployments?</Text>

			{#snippet footer()}
				<div class="flex justify-end gap-2">
					<Button size="sm" variant="ghost" onclick={() => (open = false)}>Cancel</Button>
					<Button size="sm" variant="destructive" onclick={() => (open = false)}>Delete</Button>
				</div>
			{/snippet}
		</BottomSheet>
	{/if}
</div>
