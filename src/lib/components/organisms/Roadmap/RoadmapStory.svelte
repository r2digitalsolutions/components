<script lang="ts">
	import Roadmap from './Roadmap.svelte';
</script>

<Roadmap
	items={[
		{
			id: '1',
			title: 'Permissions matrix',
			description: 'Role × resource editor for admins.',
			status: 'planned',
			quarter: 'Q3'
		},
		{
			id: '2',
			title: 'Bottom sheet',
			description: 'Mobile-first action sheet.',
			status: 'in-progress',
			quarter: 'Q3'
		},
		{
			id: '3',
			title: 'Editor shell',
			description: 'Unreal-style dock layout.',
			status: 'shipped',
			quarter: 'Q2'
		},
		{
			id: '4',
			title: 'Gantt chart',
			description: 'Project timeline organism.',
			status: 'planned',
			quarter: 'Q4'
		}
	]}
/>
