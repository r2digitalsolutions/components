<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Textarea from '$lib/components/atoms/Textarea/Textarea.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';

	interface CommentComposerProps {
		value?: string;
		placeholder?: string;
		avatar?: string;
		name?: string;
		submitLabel?: string;
		loading?: boolean;
		disabled?: boolean;
		class?: string;
		onsubmit?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		placeholder = 'Write a comment…',
		avatar,
		name = 'You',
		submitLabel = 'Comment',
		loading = false,
		disabled = false,
		class: className = '',
		onsubmit
	}: CommentComposerProps = $props();

	function submit() {
		const trimmed = value.trim();
		if (!trimmed || loading || disabled) return;
		onsubmit?.(trimmed);
		value = '';
	}
</script>

<Card class={className} padding="md" chrome={false}>
	<div class="flex gap-3">
		<Avatar src={avatar} {name} size="md" />
		<div class="min-w-0 flex-1 space-y-3">
			<Textarea bind:value {placeholder} {disabled} rows={3} />
			<div class="flex justify-end">
				<Button
					size="sm"
					{loading}
					disabled={disabled || !value.trim()}
					onclick={submit}
				>
					{submitLabel}
				</Button>
			</div>
		</div>
	</div>
</Card>
