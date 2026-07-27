<script lang="ts">
	import StatusDot from '$lib/components/atoms/StatusDot/StatusDot.svelte';
	import { pageVisibility } from '$lib/utils/pageVisibility.svelte.js';
	import { network } from '$lib/utils/network.svelte.js';

	export type SessionPresence = 'active' | 'away' | 'offline';

	interface SessionPresenceBadgeProps {
		forced?: SessionPresence | null;
		showLabel?: boolean;
		size?: 'sm' | 'md' | 'lg';
		labels?: Partial<Record<SessionPresence, string>>;
		class?: string;
		onchange?: (presence: SessionPresence) => void;
	}

	const {
		forced = null,
		showLabel = true,
		size = 'md',
		labels = {},
		class: className = '',
		onchange
	}: SessionPresenceBadgeProps = $props();

	const defaultLabels: Record<SessionPresence, string> = {
		active: 'Active',
		away: 'Away',
		offline: 'Offline'
	};

	const presence = $derived(
		forced != null
			? forced
			: !network.online
				? 'offline'
				: pageVisibility.isHidden
					? 'away'
					: 'active'
	);

	const label = $derived(labels[presence] ?? defaultLabels[presence]);

	const statusTone = $derived(
		presence === 'active' ? 'online' : presence === 'away' ? 'away' : 'offline'
	);

	$effect(() => {
		onchange?.(presence);
	});
</script>

<StatusDot
	status={statusTone}
	{label}
	{showLabel}
	{size}
	pulse={presence === 'active'}
	class={className}
/>
