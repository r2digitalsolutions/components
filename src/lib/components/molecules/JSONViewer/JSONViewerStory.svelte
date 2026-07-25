<script lang="ts">
	import JSONViewer from './JSONViewer.svelte';

	const data = {
		user: { id: 1, name: 'Alex', roles: ['admin', 'editor'] },
		meta: { version: '1.2.0', active: true },
		tags: ['svelte', 'ui']
	};
</script>

<JSONViewer {data} class="w-full max-w-md" />
