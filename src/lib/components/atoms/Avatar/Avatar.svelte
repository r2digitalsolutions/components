<script lang="ts">
	type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
	type AvatarStatus = 'online' | 'offline' | 'busy' | 'away' | null;

	interface AvatarProps {
		src?: string;
		alt?: string;
		name?: string;
		size?: AvatarSize;
		status?: AvatarStatus;
		/** Soft outline around the avatar (disable inside AvatarGroup) */
		ringed?: boolean;
		class?: string;
	}

	const {
		src,
		alt,
		name,
		size = 'md',
		status = null,
		ringed = true,
		class: className = ''
	}: AvatarProps = $props();

	let imgError = $state(false);

	const sizeClasses: Record<AvatarSize, string> = {
		xs: 'h-6 w-6 text-xs',
		sm: 'h-8 w-8 text-xs',
		md: 'h-10 w-10 text-sm',
		lg: 'h-12 w-12 text-base',
		xl: 'h-16 w-16 text-lg',
		'2xl': 'h-20 w-20 text-xl'
	};

	const statusDotSizes: Record<AvatarSize, string> = {
		xs: 'h-1.5 w-1.5',
		sm: 'h-2 w-2',
		md: 'h-2.5 w-2.5',
		lg: 'h-3 w-3',
		xl: 'h-3.5 w-3.5',
		'2xl': 'h-4 w-4'
	};

	const statusColors: Record<NonNullable<AvatarStatus>, string> = {
		online: 'bg-green-500',
		offline: 'bg-surface-overlay border-2 border-border',
		busy: 'bg-red-500',
		away: 'bg-amber-500'
	};

	// Get initials from name
	const initials = $derived.by(() => {
		if (!name) return '?';
		const parts = name.trim().split(/\s+/);
		if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
		return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
	});

	// Color based on name hash (consistent)
	const bgColor = $derived.by(() => {
		if (!name) return 'bg-brand-500';
		const colors = [
			'bg-brand-500',
			'bg-violet-500',
			'bg-rose-500',
			'bg-teal-500',
			'bg-amber-500',
			'bg-cyan-500',
			'bg-fuchsia-500'
		];
		const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return colors[hash % colors.length];
	});

	const showImage = $derived(!!src && !imgError);
</script>

<span class={['relative inline-flex aspect-square shrink-0', className]}>
	<span
		class={[
			'inline-flex aspect-square items-center justify-center overflow-hidden rounded-full',
			ringed && 'ring-2 ring-surface-elevated',
			sizeClasses[size],
			!showImage && [bgColor, 'text-white font-semibold']
		]}
		role={alt ? 'img' : undefined}
		aria-label={alt ?? name}
	>
		{#if showImage}
			<img
				{src}
				alt={alt ?? name}
				class="h-full w-full object-cover"
				onerror={() => (imgError = true)}
			/>
		{:else}
			<span aria-hidden="true">{initials}</span>
		{/if}
	</span>

	{#if status}
		<span
			class={[
				'absolute bottom-0 right-0 rounded-full ring-2 ring-surface',
				statusDotSizes[size],
				statusColors[status]
			]}
			aria-label={`Status: ${status}`}
		></span>
	{/if}
</span>
