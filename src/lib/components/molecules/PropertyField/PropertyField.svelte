<script lang="ts">
	import type { Snippet } from 'svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';

	interface PropertyFieldProps {
		label: string;
		/** Label column width (CSS), default 40% */
		labelWidth?: string;
		disabled?: boolean;
		class?: string;
		children?: Snippet;
		/** When set, shows eye toggle for exposing props on User Widgets. */
		exposed?: boolean | null;
		onexpose?: (exposed: boolean) => void;
	}

	const {
		label,
		labelWidth = '40%',
		disabled = false,
		class: className = '',
		children,
		exposed = null,
		onexpose
	}: PropertyFieldProps = $props();
</script>

<div
	class={[
		'grid min-h-7 items-center gap-2 px-1 py-0.5',
		'rounded-sm hover:bg-surface-overlay/70',
		disabled && 'pointer-events-none opacity-50',
		className
	]}
	style:grid-template-columns={`${labelWidth} minmax(0, 1fr)`}
>
	<span class="flex min-w-0 items-center gap-0.5 truncate" title={label}>
		{#if exposed !== null}
			<IconButton
				label={exposed ? 'Hide from instances' : 'Expose on instances'}
				size="xs"
				class={exposed ? 'text-brand-600' : 'text-muted'}
				onclick={() => onexpose?.(!exposed)}
			>
				{#if exposed}
					<Eye class="h-3 w-3" />
				{:else}
					<EyeOff class="h-3 w-3" />
				{/if}
			</IconButton>
		{/if}
		<Text size="xs" tone="secondary" as="span" class="truncate font-medium">
			{label}
		</Text>
	</span>
	<div class="min-w-0">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
