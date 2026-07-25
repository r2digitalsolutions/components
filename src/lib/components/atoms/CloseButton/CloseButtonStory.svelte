<script lang="ts">
	import CloseButton from './CloseButton.svelte';

	let props = $props<{
		variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		rounded?: boolean;
	}>();
</script>

<div class="flex items-center gap-3">
	<CloseButton
		variant={props.variant ?? 'ghost'}
		size={props.size ?? 'sm'}
		rounded={props.rounded ?? false}
	/>
</div>
