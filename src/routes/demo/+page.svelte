<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Demos</title>
</svelte:head>

<main class="mx-auto max-w-lg space-y-4 px-4 py-10">
	<h1 class="text-lg font-semibold text-primary">Demos</h1>
	<ul class="space-y-2 text-sm">
		<li>
			<a class="text-brand-600 hover:underline" href={resolve('/demo/datagrid')}>DataGrid SSR</a>
			<span class="text-muted"> — hidratación / row actions / accessors</span>
		</li>
		<li>
			<a class="text-brand-600 hover:underline" href={resolve('/demo/playwright')}>Playwright</a>
		</li>
	</ul>
</main>
