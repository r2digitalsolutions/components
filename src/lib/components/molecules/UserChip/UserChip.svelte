<script module lang="ts">
	export type UserChipStatus = 'online' | 'offline' | 'busy' | 'away';
	export type UserChipSize = 'xs' | 'sm' | 'md' | 'lg';
	export type UserChipVariant = 'default' | 'soft' | 'outline' | 'brand';
	export type UserChipLabel = 'first' | 'full';
</script>

<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import X from '@lucide/svelte/icons/x';

	interface UserChipProps {
		name: string;
		avatar?: string;
		/** Secondary text (role, team, email…) */
		description?: string;
		status?: UserChipStatus;
		size?: UserChipSize;
		variant?: UserChipVariant;
		/** Show first name only, or full name */
		label?: UserChipLabel;
		/** Highlight as selected / active filter */
		selected?: boolean;
		disabled?: boolean;
		/** Show remove (×) control */
		removable?: boolean;
		class?: string;
		onclick?: () => void;
		onremove?: () => void;
	}

	const {
		name,
		avatar,
		description,
		status,
		size = 'md',
		variant = 'default',
		label = 'first',
		selected = false,
		disabled = false,
		removable = false,
		class: className = '',
		onclick,
		onremove
	}: UserChipProps = $props();

	const displayName = $derived(
		label === 'full' ? name : (name.trim().split(/\s+/)[0] ?? name)
	);

	const avatarSize = $derived(
		size === 'xs' ? 'xs' : size === 'sm' ? 'xs' : size === 'md' ? 'sm' : 'md'
	);

	const sizeClasses: Record<UserChipSize, string> = {
		xs: 'gap-1 py-0.5 pl-0.5 pr-1',
		sm: 'gap-1.5 py-0.5 pl-0.5 pr-1.5',
		md: 'gap-1.5 py-1 pl-1 pr-2',
		lg: 'gap-2 py-1.5 pl-1.5 pr-2.5'
	};

	const nameClasses: Record<UserChipSize, string> = {
		xs: 'text-[10px] leading-none',
		sm: 'text-[11px] leading-none',
		md: 'text-xs leading-none',
		lg: 'text-sm leading-none'
	};

	const descClasses: Record<UserChipSize, string> = {
		xs: 'text-[9px] leading-none',
		sm: 'text-[10px] leading-none',
		md: 'text-[11px] leading-none',
		lg: 'text-xs leading-none'
	};

	const removeSize: Record<UserChipSize, string> = {
		xs: 'h-3.5 w-3.5',
		sm: 'h-4 w-4',
		md: 'h-5 w-5',
		lg: 'h-6 w-6'
	};

	const removeIcon: Record<UserChipSize, string> = {
		xs: 'h-2.5 w-2.5',
		sm: 'h-3 w-3',
		md: 'h-3.5 w-3.5',
		lg: 'h-4 w-4'
	};

	const variantClasses = $derived.by(() => {
		if (selected) {
			return 'border-brand-500/40 bg-brand-50 text-primary shadow-sm dark:bg-brand-950/50';
		}
		switch (variant) {
			case 'soft':
				return 'border-transparent bg-surface-overlay shadow-none';
			case 'outline':
				return 'border-border-strong bg-transparent shadow-none';
			case 'brand':
				return 'border-brand-500/30 bg-brand-500/10 shadow-none';
			default:
				return 'border-border bg-surface-elevated shadow-sm';
		}
	});

	function handleClick() {
		if (disabled) return;
		onclick?.();
	}

	function handleRemove(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		if (disabled) return;
		onremove?.();
	}
</script>

{#snippet avatarBlock()}
	<Avatar
		src={avatar}
		{name}
		size={avatarSize}
		status={status ?? null}
		ringed={false}
	/>
{/snippet}

{#snippet labelBlock()}
	<span class="min-w-0 text-left leading-none">
		<span class={['block truncate font-medium text-primary', nameClasses[size]]} title={name}>
			{displayName}
		</span>
		{#if description}
			<span
				class={['mt-px block truncate text-secondary leading-none', descClasses[size]]}
				title={description}
			>
				{description}
			</span>
		{/if}
	</span>
{/snippet}

{#snippet removeBlock()}
	{#if removable}
		<button
			type="button"
			class={[
				'inline-flex shrink-0 items-center justify-center rounded-full text-muted transition-colors',
				'hover:bg-black/5 hover:text-primary dark:hover:bg-white/10',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
				removeSize[size],
				disabled && 'pointer-events-none opacity-40'
			]}
			aria-label={`Remove ${name}`}
			disabled={disabled}
			onclick={handleRemove}
		>
			<X class={removeIcon[size]} strokeWidth={2.5} />
		</button>
	{/if}
{/snippet}

{#if onclick}
	<span
		class={[
			'inline-flex max-w-full items-center rounded-full border transition-colors',
			sizeClasses[size],
			variantClasses,
			disabled && 'pointer-events-none opacity-50',
			className
		]}
	>
		<button
			type="button"
			class={[
				'inline-flex min-w-0 flex-1 items-center text-left outline-none',
				'focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-brand-500/30',
				size === 'xs' || size === 'sm' ? 'gap-1' : size === 'lg' ? 'gap-2' : 'gap-1.5',
				!disabled && 'cursor-pointer'
			]}
			disabled={disabled}
			aria-pressed={selected}
			onclick={handleClick}
		>
			{@render avatarBlock()}
			{@render labelBlock()}
		</button>
		{@render removeBlock()}
	</span>
{:else}
	<span
		class={[
			'inline-flex max-w-full items-center rounded-full border transition-colors',
			sizeClasses[size],
			variantClasses,
			disabled && 'opacity-50',
			className
		]}
		aria-disabled={disabled || undefined}
	>
		<span
			class={[
				'inline-flex min-w-0 items-center',
				size === 'xs' || size === 'sm' ? 'gap-1' : size === 'lg' ? 'gap-2' : 'gap-1.5'
			]}
		>
			{@render avatarBlock()}
			{@render labelBlock()}
		</span>
		{@render removeBlock()}
	</span>
{/if}
