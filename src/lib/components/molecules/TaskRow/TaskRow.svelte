<script lang="ts">
	import SelectionBox from '$lib/components/atoms/SelectionBox/SelectionBox.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';

	export type TaskPriority = 'low' | 'med' | 'high';

	interface TaskRowProps {
		title: string;
		completed?: boolean;
		priority?: TaskPriority;
		due?: string;
		assignee?: string;
		class?: string;
		ontoggle?: (completed: boolean) => void;
		onclick?: () => void;
	}

	let {
		title,
		completed = $bindable(false),
		priority,
		due = '',
		assignee = '',
		class: className = '',
		ontoggle,
		onclick
	}: TaskRowProps = $props();

	const priorityVariant: Record<TaskPriority, 'secondary' | 'warning' | 'error'> = {
		low: 'secondary',
		med: 'warning',
		high: 'error'
	};

	const priorityLabel: Record<TaskPriority, string> = {
		low: 'Low',
		med: 'Medium',
		high: 'High'
	};

	const rowClass = $derived([
		'group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors',
		completed
			? 'border-border/60 bg-surface-overlay/50'
			: 'border-border bg-surface-elevated hover:bg-surface-overlay',
		className
	]);

	function handleToggle(checked: boolean) {
		completed = checked;
		ontoggle?.(checked);
	}

	function handleClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (target.closest('label, input[type="checkbox"]')) return;
		onclick?.();
	}
</script>

{#snippet content()}
	<SelectionBox
		bind:checked={completed}
		size="md"
		label={`Mark "${title}" as ${completed ? 'incomplete' : 'complete'}`}
		onchange={handleToggle}
	/>

	<div class="min-w-0 flex-1">
		<p
			class={[
				'truncate text-sm',
				completed ? 'text-muted line-through' : 'font-medium text-primary'
			]}
		>
			{title}
		</p>
		<div class="mt-0.5 flex flex-wrap items-center gap-2">
			{#if priority}
				<Badge size="sm" variant={priorityVariant[priority]}>{priorityLabel[priority]}</Badge>
			{/if}
			{#if due}
				<span class="text-xs text-muted">Due {due}</span>
			{/if}
		</div>
	</div>

	{#if assignee}
		<Avatar name={assignee} size="xs" ringed={false} class="shrink-0" />
	{/if}
{/snippet}

{#if onclick}
	<button
		type="button"
		class={[rowClass, 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30']}
		onclick={handleClick}
	>
		{@render content()}
	</button>
{:else}
	<div class={rowClass}>
		{@render content()}
	</div>
{/if}
