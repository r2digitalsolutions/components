<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import StatusDot from '$lib/components/atoms/StatusDot/StatusDot.svelte';

	type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
	type Status = 'online' | 'offline' | 'busy' | 'away';

	interface AvatarLabelProps {
		name: string;
		description?: string;
		avatar?: string;
		size?: AvatarSize;
		status?: Status;
		class?: string;
		onclick?: () => void;
	}

	const {
		name,
		description,
		avatar,
		size = 'md',
		status,
		class: className = '',
		onclick
	}: AvatarLabelProps = $props();
</script>

{#snippet content()}
	<Avatar src={avatar} {name} {size} status={status ?? null} />
	<span class="min-w-0">
		<span class="block truncate text-sm font-medium text-primary">{name}</span>
		{#if description}
			<span class="block truncate text-xs text-muted">{description}</span>
		{:else if status}
			<span class="mt-0.5 block">
				<StatusDot {status} size="sm" showLabel />
			</span>
		{/if}
	</span>
{/snippet}

{#if onclick}
	<button
		type="button"
		class={[
			'inline-flex items-center gap-2.5 rounded-xl px-1 py-0.5 text-left transition-colors',
			'hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
			className
		]}
		{onclick}
	>
		{@render content()}
	</button>
{:else}
	<div class={['inline-flex items-center gap-2.5 text-left', className]}>
		{@render content()}
	</div>
{/if}
