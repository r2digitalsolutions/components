<script lang="ts">
	import ComboboxItem from './ComboboxItem.svelte';

	let selected = $state('svelte');
	let highlighted = $state('svelte');

	const frameworks = [
		{ value: 'svelte', label: 'Svelte', hint: 'Compiler UI' },
		{ value: 'react', label: 'React', hint: 'Component model' },
		{ value: 'vue', label: 'Vue', hint: 'Progressive' },
		{ value: 'solid', label: 'Solid', hint: 'Fine-grained' },
		{ value: 'qwik', label: 'Qwik', hint: 'Resumable', disabled: true }
	];
</script>

<div class="max-w-sm space-y-3 w-full">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">ComboboxItem</p>
		<p class="text-xs text-secondary">
			Fila de opción para listas de Combobox. Funciona sola o anidada en
			<code class="text-primary">Combobox</code>.
		</p>
	</div>

	<div class="rounded-xl border-border bg-surface-elevated p-1.5 shadow-sm border">
		{#each frameworks as fw (fw.value)}
			<ComboboxItem
				value={fw.value}
				label={fw.label}
				disabled={fw.disabled}
				selected={selected === fw.value}
				highlighted={highlighted === fw.value}
				onclick={() => (selected = fw.value)}
				onhighlight={() => (highlighted = fw.value)}
			>
				<span class="min-w-0 flex flex-col">
					<span class="truncate">{fw.label}</span>
					<span
						class={[
							'truncate text-[11px]',
							selected === fw.value || highlighted === fw.value ? 'text-white/80' : 'text-muted'
						]}
					>
						{fw.hint}
					</span>
				</span>
			</ComboboxItem>
		{/each}
	</div>

	<p class="text-xs text-muted">
		Value: <span class="text-primary">{selected}</span>
	</p>
</div>
