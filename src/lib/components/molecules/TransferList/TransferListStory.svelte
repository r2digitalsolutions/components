<script lang="ts">
	import TransferList from './TransferList.svelte';
	import type { TransferOption } from './TransferList.svelte';

	let props = $props<{
		leftTitle?: string;
		rightTitle?: string;
		searchable?: boolean;
		disabled?: boolean;
	}>();

	const options: TransferOption[] = [
		{ value: 'react', label: 'React' },
		{ value: 'svelte', label: 'Svelte' },
		{ value: 'vue', label: 'Vue' },
		{ value: 'angular', label: 'Angular' },
		{ value: 'solid', label: 'SolidJS' },
		{ value: 'qwik', label: 'Qwik' },
		{ value: 'astro', label: 'Astro' },
		{ value: 'remix', label: 'Remix', disabled: true }
	];

	let value = $state<string[]>(['svelte', 'astro']);
</script>

<div class="w-full max-w-2xl p-6 flex flex-col gap-4">
	<TransferList
		{options}
		leftTitle={props.leftTitle ?? 'Available'}
		rightTitle={props.rightTitle ?? 'Selected'}
		searchable={props.searchable ?? false}
		disabled={props.disabled ?? false}
		bind:value
	/>
	<p class="text-xs text-muted font-mono">Selected: [{value.join(', ')}]</p>
</div>
