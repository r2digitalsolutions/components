<script lang="ts">
	import LoadingOverlay from './LoadingOverlay.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let props = $props<{
		active?: boolean;
		label?: string;
		blur?: boolean;
	}>();

	let loading = $state(true);

	$effect(() => {
		loading = props.active ?? true;
	});
</script>

<div class="w-full max-w-md">
	<LoadingOverlay active={loading} label={props.label ?? 'Saving changes...'} blur={props.blur ?? true}>
		<Card>
			<div class="space-y-3">
				<h3 class="text-base font-semibold text-primary">Profile settings</h3>
				<p class="text-sm text-secondary">
					Update your display name and notification preferences. The overlay covers this card while
					saving.
				</p>
				<Button size="sm" variant="secondary" onclick={() => (loading = !loading)}>
					{loading ? 'Hide overlay' : 'Show overlay'}
				</Button>
			</div>
		</Card>
	</LoadingOverlay>
</div>
