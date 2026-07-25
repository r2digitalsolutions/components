<script lang="ts">
	import Changelog from './Changelog.svelte';
</script>

<Changelog
	entries={[
		{
			id: '1',
			version: 'v2.4.0',
			date: 'Jul 20, 2026',
			title: 'Editor dock panels',
			body: 'Added SplitPane, Panel, PropertyField and EditorShell for IDE-style layouts.',
			tags: ['Feature']
		},
		{
			id: '2',
			version: 'v2.3.1',
			date: 'Jul 12, 2026',
			title: 'Diff viewer polish',
			body: 'Improved split view scrolling and keyboard navigation.',
			tags: ['Fix']
		},
		{
			id: '3',
			version: 'v2.3.0',
			date: 'Jul 1, 2026',
			title: 'Analytics page',
			body: 'New organism for KPI dashboards with sparkline metrics.',
			tags: ['Feature']
		}
	]}
/>
