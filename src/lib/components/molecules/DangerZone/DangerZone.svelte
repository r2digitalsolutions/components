<script lang="ts">
	import type { Snippet } from 'svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Heading from '$lib/components/atoms/Heading/Heading.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import ConfirmDialog from '$lib/components/molecules/ConfirmDialog/ConfirmDialog.svelte';

	interface DangerZoneProps {
		title?: string;
		description?: string;
		actionLabel?: string;
		confirmTitle?: string;
		confirmMessage?: string;
		class?: string;
		children?: Snippet;
		onconfirm?: () => void;
	}

	let {
		title = 'Danger zone',
		description = 'Irreversible and destructive actions live here.',
		actionLabel = 'Delete workspace',
		confirmTitle = 'Are you sure?',
		confirmMessage = 'This action cannot be undone.',
		class: className = '',
		children,
		onconfirm
	}: DangerZoneProps = $props();

	let open = $state(false);
</script>

<Card
	class={['border-red-200 dark:border-red-900/50', className].filter(Boolean).join(' ')}
	padding="lg"
	variant="bordered"
	chrome={false}
>
	<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
		<div class="min-w-0 space-y-1">
			<Heading level={3} size="sm" class="text-red-700 dark:text-red-400">{title}</Heading>
			<Text size="xs" tone="muted">{description}</Text>
			{#if children}
				<div class="pt-2">
					{@render children()}
				</div>
			{/if}
		</div>
		<Button size="sm" variant="destructive" onclick={() => (open = true)}>{actionLabel}</Button>
	</div>
</Card>

<ConfirmDialog
	bind:open
	title={confirmTitle}
	description={confirmMessage}
	confirmLabel={actionLabel}
	onconfirm={() => {
		open = false;
		onconfirm?.();
	}}
	oncancel={() => (open = false)}
/>
