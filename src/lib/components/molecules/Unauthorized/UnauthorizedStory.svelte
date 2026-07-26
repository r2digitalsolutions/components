<script lang="ts">
	import Unauthorized from './Unauthorized.svelte';
</script>

<div class="max-w-md">
	<Unauthorized onaction={() => alert('sign in')} />
</div>
