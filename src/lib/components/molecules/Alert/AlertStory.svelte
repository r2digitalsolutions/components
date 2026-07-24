<script lang="ts">
	import Alert, { type AlertItem } from './Alert.svelte';

	let props = $props<{
		variant?: 'info' | 'success' | 'warning' | 'error';
		title?: string;
		message?: string;
		items?: AlertItem[];
		dismissible?: boolean;
	}>();
</script>

<div class="w-96 max-w-full">
	<Alert
		variant={props.variant ?? 'info'}
		title={props.title ?? 'Update Available'}
		message={props.message ?? 'A new software version (v2.4.0) is ready to install.'}
		items={props.items}
		dismissible={props.dismissible ?? false}
	/>
</div>
