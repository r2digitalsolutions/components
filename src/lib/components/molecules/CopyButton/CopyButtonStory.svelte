<script lang="ts">
	import CopyButton from './CopyButton.svelte';

	let props = $props<{
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
	}>();
</script>

<div class="flex items-center gap-3">
	<code class="rounded-lg border border-border bg-surface-overlay px-3 py-1.5 text-sm text-primary">
		npm i @r2digisolutions/components
	</code>
	<CopyButton
		value="npm i @r2digisolutions/components"
		size={props.size ?? 'sm'}
		variant={props.variant ?? 'secondary'}
	/>
</div>
