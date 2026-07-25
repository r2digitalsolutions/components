<script lang="ts">
	import Chip from '$lib/components/atoms/Chip/Chip.svelte';
	import Cluster from '$lib/components/atoms/Cluster/Cluster.svelte';
	import Label from '$lib/components/atoms/Label/Label.svelte';

	export interface ChipSelectOption {
		id: string;
		label: string;
		disabled?: boolean;
	}

	interface ChipSelectProps {
		options?: ChipSelectOption[];
		value?: string[];
		label?: string;
		multiple?: boolean;
		class?: string;
		onchange?: (value: string[]) => void;
	}

	let {
		options = [],
		value = $bindable<string[]>([]),
		label,
		multiple = true,
		class: className = '',
		onchange
	}: ChipSelectProps = $props();

	function toggle(id: string, disabled?: boolean) {
		if (disabled) return;
		if (multiple) {
			value = value.includes(id) ? value.filter((v) => v !== id) : [...value, id];
		} else {
			value = value.includes(id) ? [] : [id];
		}
		onchange?.(value);
	}
</script>

<div class={['w-full space-y-2', className]}>
	{#if label}
		<Label>{label}</Label>
	{/if}
	<Cluster gap="sm">
		{#each options as opt (opt.id)}
			<Chip
				selected={value.includes(opt.id)}
				disabled={opt.disabled}
				onclick={() => toggle(opt.id, opt.disabled)}
			>
				{opt.label}
			</Chip>
		{/each}
	</Cluster>
</div>
