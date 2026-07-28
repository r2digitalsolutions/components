<script lang="ts">
	import type { Snippet } from 'svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Tooltip from '$lib/components/atoms/Tooltip/Tooltip.svelte';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';

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
		/**
		 * Unreal-style: value differs from default. Shows amber reset control.
		 * Pass with `onreset` to enable.
		 */
		modified?: boolean;
		/** Reset this property to its default (UE details panel). */
		onreset?: () => void;
	}

	const {
		label,
		labelWidth = '40%',
		disabled = false,
		class: className = '',
		children,
		exposed = null,
		onexpose,
		modified = false,
		onreset
	}: PropertyFieldProps = $props();

	const canReset = $derived(!!onreset && modified && !disabled);
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
		{#if canReset}
			<Tooltip content="Reset to default" side="top">
				<IconButton
					label="Reset to default"
					size="xs"
					class="text-amber-500 hover:bg-amber-500/10 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
					onclick={() => onreset?.()}
				>
					<RotateCcw class="h-3 w-3" strokeWidth={2.5} />
				</IconButton>
			</Tooltip>
		{:else if onreset}
			<span class="inline-flex h-7 w-7 shrink-0" aria-hidden="true"></span>
		{/if}
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
		<Text
			size="xs"
			tone={canReset ? 'primary' : 'secondary'}
			as="span"
			class={['truncate font-medium', canReset && 'text-amber-700 dark:text-amber-400']}
		>
			{label}
		</Text>
	</span>
	<div class="min-w-0">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
