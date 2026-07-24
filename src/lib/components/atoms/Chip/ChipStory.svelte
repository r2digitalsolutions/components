<script lang="ts">
	import Chip from './Chip.svelte';

	let props = $props<{
		variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
		size?: 'sm' | 'md';
		selected?: boolean;
		disabled?: boolean;
		dismissible?: boolean;
	}>();

	let tags = $state(['Design', 'Svelte', 'Tailwind']);
	let selected = $state(props.selected ?? false);
</script>

<div class="flex flex-wrap gap-2">
	<Chip
		variant={props.variant ?? 'primary'}
		size={props.size ?? 'md'}
		selected={selected}
		disabled={props.disabled ?? false}
		onclick={() => (selected = !selected)}
	>
		Toggle me
	</Chip>

	{#each tags as tag (tag)}
		<Chip
			variant={props.variant ?? 'default'}
			size={props.size ?? 'md'}
			dismissible={props.dismissible ?? true}
			disabled={props.disabled ?? false}
			ondismiss={() => (tags = tags.filter((t) => t !== tag))}
		>
			{tag}
		</Chip>
	{/each}
</div>
