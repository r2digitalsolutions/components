<script lang="ts">
	import MentionInput from './MentionInput.svelte';
	import type { MentionSuggestion } from './MentionInput.svelte';

	let {
		placement = 'top',
		disabled = false,
		rows = 4,
		variant = 'default'
	}: {
		placement?: 'top' | 'bottom';
		disabled?: boolean;
		rows?: number;
		variant?: 'default' | 'avatars' | 'empty-start' | 'bottom';
	} = $props();

	let value = $state(variant === 'empty-start' ? '' : 'Hey @');
	let lastSelected = $state<string | null>(null);

	const people: MentionSuggestion[] = [
		{
			id: '1',
			label: 'alex',
			description: 'Alex Rivera',
			meta: 'Engineering',
			avatar: 'https://i.pravatar.cc/80?u=alex'
		},
		{
			id: '2',
			label: 'sam',
			description: 'Sam Chen',
			meta: 'Design',
			avatar: 'https://i.pravatar.cc/80?u=sam'
		},
		{
			id: '3',
			label: 'jordan',
			description: 'Jordan Lee',
			meta: 'Product',
			avatar: 'https://i.pravatar.cc/80?u=jordan'
		},
		{
			id: '4',
			label: 'morgan',
			description: 'Morgan Blake',
			meta: 'Support',
			avatar: 'https://i.pravatar.cc/80?u=morgan'
		},
		{
			id: '5',
			label: 'casey',
			description: 'Casey Nguyen',
			meta: 'Marketing',
			avatar: 'https://i.pravatar.cc/80?u=casey'
		},
		{
			id: '6',
			label: 'riley',
			description: 'Riley Brooks',
			meta: 'Sales'
		}
	];

	const plain: MentionSuggestion[] = people.map(({ id, label, description }) => ({
		id,
		label,
		description
	}));

	const suggestions = $derived(variant === 'avatars' || variant === 'default' ? people : plain);
	const resolvedPlacement = $derived(variant === 'bottom' ? 'bottom' : placement);
</script>

<div class="flex w-full max-w-lg flex-col gap-4">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">Mention input</p>
		<p class="text-xs leading-relaxed text-secondary">
			Type <code class="rounded bg-surface-overlay px-1">@</code> to open suggestions. Use arrow
			keys, Enter / Tab to select, Escape to dismiss.
		</p>
	</div>

	<MentionInput
		bind:value
		{suggestions}
		{disabled}
		rows={rows}
		placement={resolvedPlacement}
		label="Message"
		helperText=""
		onselect={(item) => (lastSelected = item.label)}
	/>

	{#if lastSelected}
		<p class="text-xs text-muted">
			Last mention: <span class="font-medium text-primary">@{lastSelected}</span>
		</p>
	{/if}

	<div
		class="rounded-xl border border-border bg-surface-elevated p-3 font-mono text-[11px] leading-relaxed text-secondary"
	>
		<span class="text-muted">value →</span>
		{value || '∅'}
	</div>
</div>
