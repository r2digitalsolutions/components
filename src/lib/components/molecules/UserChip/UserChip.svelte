<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import X from '@lucide/svelte/icons/x';

	export type UserChipStatus = 'online' | 'offline' | 'busy' | 'away';

	interface UserChipProps {
		name: string;
		avatar?: string;
		status?: UserChipStatus;
		/** Show remove (×) control */
		removable?: boolean;
		size?: 'sm' | 'md';
		class?: string;
		onclick?: () => void;
		onremove?: () => void;
	}

	const {
		name,
		avatar,
		status,
		removable = false,
		size = 'md',
		class: className = '',
		onclick,
		onremove
	}: UserChipProps = $props();

	const firstName = $derived(name.split(/\s+/)[0] ?? name);
</script>

<span
	class={[
		'inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-surface-elevated',
		'shadow-sm transition-colors',
		size === 'sm' ? 'py-0.5 pl-0.5 pr-1.5' : 'py-1 pl-1 pr-2',
		onclick && 'cursor-pointer hover:bg-surface-overlay',
		className
	]}
>
	{#if onclick}
		<button
			type="button"
			class="inline-flex min-w-0 items-center gap-1.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
			{onclick}
		>
			<Avatar
				src={avatar}
				{name}
				size={size === 'sm' ? 'xs' : 'sm'}
				status={status ?? null}
				ringed={false}
			/>
			<span
				class={[
					'truncate font-medium text-primary',
					size === 'sm' ? 'text-[11px]' : 'text-xs'
				]}
			>
				{firstName}
			</span>
		</button>
	{:else}
		<span class="inline-flex min-w-0 items-center gap-1.5">
			<Avatar
				src={avatar}
				{name}
				size={size === 'sm' ? 'xs' : 'sm'}
				status={status ?? null}
				ringed={false}
			/>
			<span
				class={[
					'truncate font-medium text-primary',
					size === 'sm' ? 'text-[11px]' : 'text-xs'
				]}
			>
				{firstName}
			</span>
		</span>
	{/if}

	{#if removable}
		<button
			type="button"
			class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-overlay hover:text-primary"
			aria-label={`Remove ${name}`}
			onclick={(e) => {
				e.stopPropagation();
				onremove?.();
			}}
		>
			<X class="h-3 w-3" strokeWidth={2.5} />
		</button>
	{/if}
</span>
