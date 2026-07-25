<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';

	interface FollowButtonProps {
		following?: boolean;
		size?: 'xs' | 'sm' | 'md';
		disabled?: boolean;
		followLabel?: string;
		followingLabel?: string;
		unfollowLabel?: string;
		class?: string;
		onchange?: (following: boolean) => void;
	}

	let {
		following = $bindable(false),
		size = 'sm',
		disabled = false,
		followLabel = 'Follow',
		followingLabel = 'Following',
		unfollowLabel = 'Unfollow',
		class: className = '',
		onchange
	}: FollowButtonProps = $props();

	let hovered = $state(false);

	const label = $derived(
		following ? (hovered ? unfollowLabel : followingLabel) : followLabel
	);

	function toggle() {
		if (disabled) return;
		following = !following;
		onchange?.(following);
	}
</script>

<Button
	{size}
	variant={following ? (hovered ? 'destructive' : 'secondary') : 'primary'}
	{disabled}
	class={className}
	onclick={toggle}
	onmouseenter={() => (hovered = true)}
	onmouseleave={() => (hovered = false)}
	onfocus={() => (hovered = true)}
	onblur={() => (hovered = false)}
>
	{label}
</Button>
