<script lang="ts">
	import ErrorPage from './ErrorPage.svelte';

	let props = $props<{ code?: number; title?: string }>();
</script>

<ErrorPage
	code={props.code ?? 404}
	title={props.title ?? 'Page not found'}
	requestId="req_8f2a91c"
/>
