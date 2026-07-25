<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Snackbar from './Snackbar.svelte';
	import type { SnackbarPosition, SnackbarVariant } from './Snackbar.svelte';

	let open = $state(false);
	let variant = $state<SnackbarVariant>('default');
	let position = $state<SnackbarPosition>('bottom');

	function show(v: SnackbarVariant, p: SnackbarPosition = 'bottom') {
		variant = v;
		position = p;
		open = true;
	}
</script>

<div class="space-y-4">
	<div class="flex flex-wrap gap-2">
		<Button size="sm" onclick={() => show('default')}>Default</Button>
		<Button size="sm" variant="secondary" onclick={() => show('success')}>Success</Button>
		<Button size="sm" variant="secondary" onclick={() => show('error')}>Error</Button>
		<Button size="sm" variant="secondary" onclick={() => show('warning')}>Warning</Button>
		<Button size="sm" variant="secondary" onclick={() => show('info')}>Info</Button>
		<Button size="sm" variant="outline" onclick={() => show('default', 'bottom-right')}>
			Bottom right
		</Button>
	</div>

	<Snackbar
		bind:open
		{variant}
		{position}
		title={variant === 'default' ? undefined : variant[0].toUpperCase() + variant.slice(1)}
		message="Message archived from your inbox"
		actionLabel="Undo"
	/>
</div>
