<script lang="ts">
	import Card from './Card.svelte';

	let props = $props<{
		variant?: 'default' | 'elevated' | 'bordered' | 'ghost';
		padding?: 'none' | 'sm' | 'md' | 'lg';
		hoverable?: boolean;
		title?: string;
		content?: string;
		footerText?: string;
	}>();
</script>

<div class="w-96">
	<Card
		variant={props.variant ?? 'default'}
		padding={props.padding ?? 'md'}
		hoverable={props.hoverable ?? false}
	>
		{#snippet header()}
			<h3 class="font-semibold text-primary">{props.title ?? 'Card Title'}</h3>
		{/snippet}

		<p class="text-sm text-secondary">
			{props.content ?? 'This is the main card body content. You can place any components or text here.'}
		</p>

		{#snippet footer()}
			<p class="text-xs text-muted">{props.footerText ?? 'Card Footer'}</p>
		{/snippet}
	</Card>
</div>
