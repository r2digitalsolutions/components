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
		/** Fixed label column width (CSS). Use rem for UE-style alignment across the panel. */
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
		/** Align control in the value column. Defaults to stretch/fill. */
		valueAlign?: 'start' | 'end' | 'stretch';
		/** Skip reset gutter — for dense 2-col rows (X/Y/W/H). */
		compact?: boolean;
	}

	const {
		label,
		labelWidth = '7rem',
		disabled = false,
		class: className = '',
		children,
		exposed = null,
		onexpose,
		modified = false,
		onreset,
		valueAlign = 'stretch',
		compact = false
	}: PropertyFieldProps = $props();

	const canReset = $derived(!!onreset && modified && !disabled);
	const columns = $derived(
		compact ? `${labelWidth} minmax(0, 1fr)` : `1.25rem ${labelWidth} minmax(0, 1fr)`
	);
</script>

<div
	class={[
		'grid min-h-7 items-center gap-x-2 px-1 py-0.5',
		'rounded-sm hover:bg-surface-overlay/70',
		disabled && 'pointer-events-none opacity-50',
		className
	]}
	style:grid-template-columns={columns}
>
	{#if !compact}
		<!-- Reset gutter: always reserved so every row shares the same label/value columns -->
		<span class="flex h-7 w-5 items-center justify-center">
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
			{/if}
		</span>
	{/if}

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
		<Text
			size="xs"
			tone={canReset ? 'primary' : 'secondary'}
			as="span"
			class={['truncate font-medium', canReset && 'text-amber-700 dark:text-amber-400']}
		>
			{label}
		</Text>
	</span>

	<div
		class={[
			'flex min-h-7 min-w-0 items-center',
			valueAlign === 'end' && 'justify-end',
			valueAlign === 'start' && 'justify-start',
			valueAlign === 'stretch' && '[&>*]:min-w-0 [&>*]:w-full'
		]}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
