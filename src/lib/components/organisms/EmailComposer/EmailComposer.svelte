<script lang="ts">
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import TagInput from '$lib/components/molecules/TagInput/TagInput.svelte';
	import RichTextEditor from '$lib/components/molecules/RichTextEditor/RichTextEditor.svelte';
	import FileRow from '$lib/components/molecules/FileRow/FileRow.svelte';
	import type { FileRowData } from '$lib/components/molecules/FileRow/FileRow.svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';
	import Heading from '$lib/components/atoms/Heading/Heading.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	interface EmailComposerProps {
		to?: string[];
		cc?: string[];
		subject?: string;
		body?: string;
		attachments?: FileRowData[];
		loading?: boolean;
		class?: string;
		onsend?: (payload: {
			to: string[];
			cc: string[];
			subject: string;
			body: string;
			attachments: FileRowData[];
		}) => void;
	}

	let {
		to = $bindable<string[]>([]),
		cc = $bindable<string[]>([]),
		subject = $bindable(''),
		body = $bindable('<p></p>'),
		attachments = $bindable<FileRowData[]>([]),
		loading = false,
		class: className = '',
		onsend
	}: EmailComposerProps = $props();

	let showCc = $state(false);
</script>

<Card class={`w-full max-w-2xl ${className}`} padding="lg" chrome={false}>
	<div class="mb-4 flex items-center justify-between gap-3">
		<Heading level={2} size="lg">New message</Heading>
		{#if !showCc}
			<Button size="xs" variant="ghost" onclick={() => (showCc = true)}>Cc</Button>
		{/if}
	</div>

	<Stack gap="md">
		<TagInput bind:value={to} label="To" placeholder="Add recipients" />
		{#if showCc}
			<TagInput bind:value={cc} label="Cc" placeholder="Add Cc" />
		{/if}
		<FormField label="Subject" bind:value={subject} placeholder="Subject" />
		<RichTextEditor bind:value={body} placeholder="Write your email…" minHeight="12rem" />

		<div class="space-y-2">
			<div class="flex items-center justify-between">
				<p class="text-sm font-medium text-primary">Attachments</p>
				<Button
					size="xs"
					variant="secondary"
					onclick={() => {
						attachments = [
							...attachments,
							{
								id: `a-${Date.now()}`,
								name: `attachment-${attachments.length + 1}.pdf`,
								size: '240 KB',
								type: 'PDF',
								status: 'ready'
							}
						];
					}}
				>
					Add file
				</Button>
			</div>
			{#if attachments.length}
				<Stack gap="sm">
					{#each attachments as file (file.id)}
						<FileRow
							{file}
							onremove={(f) => (attachments = attachments.filter((x) => x.id !== f.id))}
						/>
					{/each}
				</Stack>
			{/if}
		</div>

		<FormActions
			submitLabel="Send"
			cancelLabel="Discard"
			{loading}
			align="end"
			onsubmit={() => onsend?.({ to, cc, subject, body, attachments })}
			oncancel={() => {
				to = [];
				cc = [];
				subject = '';
				body = '<p></p>';
				attachments = [];
			}}
		/>
	</Stack>
</Card>
