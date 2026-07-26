<script lang="ts">
	import Forbidden from './Forbidden.svelte';
</script>

<div class="max-w-md">
	<Forbidden actionLabel="Go back" onaction={() => alert('back')} />
</div>
