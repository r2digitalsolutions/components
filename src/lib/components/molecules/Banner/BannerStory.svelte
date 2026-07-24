<script lang="ts">
	import Banner from './Banner.svelte';

	let props = $props<{
		variant?: 'info' | 'success' | 'warning' | 'error' | 'brand';
		dismissible?: boolean;
	}>();
</script>

<div class="w-[28rem] max-w-full space-y-3">
	<Banner
		title="New components available"
		description="Banner, Calendar, TagInput, CodeBlock and more were added to the library."
		variant={props.variant ?? 'brand'}
		dismissible={props.dismissible ?? true}
		actionLabel="View"
	/>
</div>
