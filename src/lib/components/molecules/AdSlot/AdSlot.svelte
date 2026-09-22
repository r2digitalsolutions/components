<script lang="ts">
	import type { Snippet } from 'svelte'

	interface AdSlotProps {
		class?: string
		children?: Snippet
	}

	let { class: className = '', children }: AdSlotProps = $props()
</script>

{#if children}
	<div class={['min-w-0', className]}>
		{@render children()}
	</div>
{/if}
