<script lang="ts">
	import Breadcrumb, { type BreadcrumbItem } from './Breadcrumb.svelte';

	const items: BreadcrumbItem[] = [
		{ id: 'home', label: 'Home', href: '#' },
		{ id: 'projects', label: 'Projects', href: '#' },
		{ id: 'alpha', label: 'Project Alpha' }
	];
</script>

<div class="w-96 max-w-full">
	<Breadcrumb {items} />
</div>
