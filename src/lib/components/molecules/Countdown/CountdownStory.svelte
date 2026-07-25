<script lang="ts">
	import Countdown from './Countdown.svelte';

	let props = $props<{
		size?: 'sm' | 'md' | 'lg';
		showDays?: boolean;
	}>();

	const target = new Date(Date.now() + 1000 * 60 * 60 * 26 + 1000 * 45);
</script>

<Countdown
	{target}
	label="Offer ends in"
	size={props.size ?? 'md'}
	showDays={props.showDays ?? true}
/>
