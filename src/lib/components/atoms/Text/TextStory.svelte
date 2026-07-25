<script lang="ts">
	import Text from './Text.svelte';

	let props = $props<{ size?: 'xs' | 'sm' | 'md' | 'lg'; tone?: 'primary' | 'secondary' | 'muted' }>();
</script>

<div class="max-w-md space-y-2">
	<Text size={props.size ?? 'sm'} tone={props.tone ?? 'secondary'}>
		Body copy for descriptions, helpers, and supporting content across the design system.
	</Text>
	<Text size="xs" tone="muted">Muted caption text for metadata.</Text>
</div>
