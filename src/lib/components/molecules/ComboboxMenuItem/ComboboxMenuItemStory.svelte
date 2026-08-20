<script lang="ts">
	import ComboboxMenuItem from './ComboboxMenuItem.svelte';

	let selected = $state('svelte');
	let highlighted = $state('svelte');

	const frameworks = [
		{ value: 'svelte', label: 'Svelte' },
		{ value: 'react', label: 'React' },
		{ value: 'vue', label: 'Vue' },
		{ value: 'solid', label: 'Solid' },
		{ value: 'qwik', label: 'Qwik', disabled: true }
	];
</script>

<div class="max-w-sm space-y-3 w-full">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">ComboboxMenuItem</p>
		<p class="text-xs text-secondary">
			Fila compacta con check a la izquierda, como el combobox de selección. No pinta el fondo
			brand.
		</p>
	</div>

	<div class="rounded-xl border-border bg-surface-elevated p-1 shadow-sm border">
		{#each frameworks as fw (fw.value)}
			<ComboboxMenuItem
				value={fw.value}
				label={fw.label}
				disabled={fw.disabled}
				selected={selected === fw.value}
				highlighted={highlighted === fw.value}
				onclick={() => (selected = fw.value)}
				onhighlight={() => (highlighted = fw.value)}
			/>
		{/each}
	</div>

	<p class="text-xs text-muted">
		Value: <span class="text-primary">{selected}</span>
	</p>
</div>
