<script lang="ts">
	import HitArea from './HitArea.svelte';
	import type { HitAreaElement } from './HitArea.svelte';

	let props = $props<{
		minSize?: number;
		as?: HitAreaElement;
		disabled?: boolean;
		label?: string;
	}>();
</script>

<div class="flex items-center gap-6">
	<HitArea
		minSize={props.minSize ?? 44}
		as={props.as ?? 'button'}
		disabled={props.disabled ?? false}
		label={props.label ?? 'Settings'}
	>
		<svg
			class="h-4 w-4 text-primary"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="3" />
			<path
				d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
			/>
		</svg>
	</HitArea>

	<div class="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted">
		44×44px min touch target
	</div>
</div>
