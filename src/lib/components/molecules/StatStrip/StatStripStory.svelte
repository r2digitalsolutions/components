<script lang="ts">
	import StatStrip from './StatStrip.svelte';
</script>

<StatStrip
	items={[
		{ id: '1', label: 'Revenue', value: '€24.8k', hint: '+12% MoM' },
		{ id: '2', label: 'Orders', value: 1284, hint: '+48 today' },
		{ id: '3', label: 'Conversion', value: '3.2%', hint: 'Stable' },
		{ id: '4', label: 'AOV', value: '€62', hint: '+€4' }
	]}
/>
