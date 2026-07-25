<script lang="ts">
	import StatusDot from './StatusDot.svelte';

	let props = $props<{
		status?: 'online' | 'offline' | 'busy' | 'away' | 'neutral';
		size?: 'sm' | 'md' | 'lg';
		pulse?: boolean;
		showLabel?: boolean;
	}>();
</script>

<div class="flex flex-col gap-4">
	<StatusDot
		status={props.status ?? 'online'}
		size={props.size ?? 'md'}
		pulse={props.pulse ?? true}
		showLabel={props.showLabel ?? true}
	/>
	<div class="flex items-center gap-4">
		<StatusDot status="online" showLabel />
		<StatusDot status="away" showLabel />
		<StatusDot status="busy" showLabel />
		<StatusDot status="offline" showLabel />
	</div>
</div>
