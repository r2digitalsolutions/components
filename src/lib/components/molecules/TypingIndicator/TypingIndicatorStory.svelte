<script lang="ts">
	import TypingIndicator from './TypingIndicator.svelte';

	let props = $props<{
		size?: 'sm' | 'md' | 'lg';
		variant?: 'bubble' | 'plain';
		showText?: boolean;
	}>();
</script>

<div class="flex flex-col gap-6">
	<div class="flex items-end gap-3">
		<div
			class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-900 dark:text-brand-300"
		>
			A
		</div>
		<TypingIndicator
			names={['Ana']}
			size={props.size ?? 'md'}
			variant={props.variant ?? 'bubble'}
			showText={props.showText ?? true}
		/>
	</div>

	<div class="flex flex-wrap items-center gap-4">
		<TypingIndicator names={['Ana', 'Luis']} size="sm" />
		<TypingIndicator label="Someone is typing" showText={false} />
		<TypingIndicator variant="plain" names={['Support']} />
	</div>
</div>
