<script lang="ts">
	import ShareButton from './ShareButton.svelte';

	let props = $props<{
		iconOnly?: boolean;
		variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
	}>();
</script>

<div class="flex items-center gap-3">
	<ShareButton
		url="https://r2digisolutions.com"
		title="R2DigiSolutions"
		variant={props.variant ?? 'secondary'}
		iconOnly={props.iconOnly ?? false}
	/>
	<ShareButton url="https://r2digisolutions.com" iconOnly variant="ghost" />
</div>
