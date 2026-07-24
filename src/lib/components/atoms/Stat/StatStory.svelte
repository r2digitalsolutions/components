<script lang="ts">
	import Stat from './Stat.svelte';

	let props = $props<{
		label?: string;
		value?: string;
		delta?: string;
		trend?: 'up' | 'down' | 'neutral';
		description?: string;
	}>();
</script>

<div class="grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
	<Stat
		label={props.label ?? 'Revenue'}
		value={props.value ?? '$48.2k'}
		delta={props.delta ?? '+12.4%'}
		trend={props.trend ?? 'up'}
		description={props.description ?? 'vs last month'}
	/>
	<Stat label="Active users" value="2,847" delta="-3.1%" trend="down" description="vs last week" />
	<Stat label="Conversion" value="4.6%" delta="0.0%" trend="neutral" description="stable" />
</div>
