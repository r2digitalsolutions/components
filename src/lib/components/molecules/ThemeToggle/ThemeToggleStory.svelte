<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';

	let props = $props<{
		mode?: 'toggle' | 'select';
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
	}>();
</script>

<div class="flex flex-wrap items-center gap-4">
	<ThemeToggle mode={props.mode ?? 'toggle'} size={props.size ?? 'md'} variant={props.variant ?? 'ghost'} />
	{#if (props.mode ?? 'toggle') === 'toggle'}
		<ThemeToggle mode="select" />
	{/if}
</div>
