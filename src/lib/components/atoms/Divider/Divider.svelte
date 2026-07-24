<script lang="ts">
	type DividerOrientation = 'horizontal' | 'vertical';

	interface DividerProps {
		orientation?: DividerOrientation;
		label?: string;
		class?: string;
	}

	let {
		orientation = 'horizontal',
		label,
		class: className = ''
	}: DividerProps = $props();
</script>

{#if orientation === 'vertical'}
	<div
		role="separator"
		aria-orientation="vertical"
		class={['w-px self-stretch bg-border', className]}
	></div>
{:else if label}
	<div class={['flex items-center gap-3', className]} role="separator" aria-orientation="horizontal">
		<div class="h-px flex-1 bg-border"></div>
		<span class="shrink-0 text-xs font-medium text-secondary">{label}</span>
		<div class="h-px flex-1 bg-border"></div>
	</div>
{:else}
	<hr class={['border-0 border-t border-border w-full', className]} />
{/if}
