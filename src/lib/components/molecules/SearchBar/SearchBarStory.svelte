<script lang="ts">
	import SearchBar from './SearchBar.svelte';

	let {
		example = 'joined',
		variant = 'joined',
		size = 'md',
		loading = false,
		showButton = true,
		placeholder = 'Search components…',
		buttonLabel = 'Search',
		shortcut = ''
	}: {
		example?: 'joined' | 'soft' | 'plain' | 'filters' | 'sizes';
		variant?: 'joined' | 'soft' | 'plain';
		size?: 'sm' | 'md' | 'lg';
		loading?: boolean;
		showButton?: boolean;
		placeholder?: string;
		buttonLabel?: string;
		shortcut?: string;
	} = $props();

	let value = $state('');
	let softValue = $state('');
	let last = $state('');
	let filter = $state<'all' | 'atoms' | 'molecules'>('all');

	const chip =
		'rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors';
</script>

<div class="w-full max-w-xl space-y-3">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">Search bar</p>
		<p class="text-xs text-secondary">
			Barra unificada: icono, clear, atajo y botón integrado. Enter envía · Esc limpia.
		</p>
	</div>

	{#if example === 'sizes'}
		<div class="space-y-3">
			{#each ['sm', 'md', 'lg'] as s}
				<div class="space-y-1">
					<p class="text-[11px] font-medium uppercase tracking-wide text-muted">{s}</p>
					<SearchBar
						size={s as 'sm' | 'md' | 'lg'}
						placeholder={`Search (${s})…`}
						onsubmit={(q) => (last = q)}
					/>
				</div>
			{/each}
		</div>
	{:else if example === 'soft'}
		<div class="rounded-2xl border border-border bg-surface-elevated p-4 shadow-sm">
			<SearchBar
				variant="soft"
				bind:value={softValue}
				placeholder="Search docs, components…"
				shortcut={shortcut || '⌘K'}
				showButton={false}
				{size}
				{loading}
				onsubmit={(q) => (last = q)}
			/>
		</div>
	{:else if example === 'plain'}
		<div class="rounded-2xl border border-border bg-surface p-4">
			<SearchBar
				variant="plain"
				bind:value
				placeholder="Filter list…"
				showButton={false}
				{size}
				onsubmit={(q) => (last = q)}
			/>
		</div>
	{:else if example === 'filters'}
		<SearchBar
			variant="joined"
			bind:value
			placeholder="Search library…"
			{buttonLabel}
			{size}
			{loading}
			onsubmit={(q) => (last = `${q} · ${filter}`)}
		>
			{#snippet actions()}
				<button
					type="button"
					class={[
						chip,
						filter === 'all'
							? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
							: 'border-border text-secondary hover:bg-surface-overlay'
					]}
					onclick={() => (filter = 'all')}
				>
					All
				</button>
				<button
					type="button"
					class={[
						chip,
						filter === 'atoms'
							? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
							: 'border-border text-secondary hover:bg-surface-overlay'
					]}
					onclick={() => (filter = 'atoms')}
				>
					Atoms
				</button>
				<button
					type="button"
					class={[
						chip,
						filter === 'molecules'
							? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
							: 'border-border text-secondary hover:bg-surface-overlay'
					]}
					onclick={() => (filter = 'molecules')}
				>
					Molecules
				</button>
			{/snippet}
		</SearchBar>
	{:else}
		<SearchBar
			{variant}
			bind:value
			{placeholder}
			{buttonLabel}
			{showButton}
			{loading}
			{size}
			{shortcut}
			onsubmit={(q) => (last = q)}
		/>
	{/if}

	{#if last}
		<p class="text-[11px] text-muted">Submitted: <span class="text-primary">{last}</span></p>
	{/if}
</div>
