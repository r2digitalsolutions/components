<script lang="ts">
	import type { Snippet } from 'svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';
	import FieldHint from '$lib/components/atoms/FieldHint/FieldHint.svelte';

	export type SettingsRowVariant = 'card' | 'flush' | 'plain';

	interface SettingsRowProps {
		title: string;
		description?: string;
		checked?: boolean;
		disabled?: boolean;
		hint?: string;
		/** card = bordered panel · flush = for stacked lists · plain = no chrome */
		variant?: SettingsRowVariant;
		class?: string;
		/** Custom control instead of Toggle */
		control?: Snippet;
		onchange?: (checked: boolean) => void;
	}

	let {
		title,
		description,
		checked = $bindable(false),
		disabled = false,
		hint,
		variant = 'card',
		class: className = '',
		control,
		onchange
	}: SettingsRowProps = $props();
</script>

<div
	class={[
		'flex items-start justify-between gap-4',
		variant === 'card' && 'rounded-xl border border-border bg-surface-elevated px-4 py-3',
		variant === 'flush' && 'px-4 py-3',
		variant === 'plain' && 'py-2',
		disabled && 'opacity-60',
		className
	]}
>
	<div class="min-w-0 space-y-0.5">
		<p class="text-sm font-medium leading-snug text-primary">{title}</p>
		{#if description}
			<p class="text-xs leading-snug text-muted">{description}</p>
		{/if}
		{#if hint}
			<FieldHint text={hint} tone="muted" />
		{/if}
	</div>

	<div class="shrink-0 pt-0.5">
		{#if control}
			{@render control()}
		{:else}
			<Toggle bind:checked {disabled} onchange={(v) => onchange?.(v)} />
		{/if}
	</div>
</div>
