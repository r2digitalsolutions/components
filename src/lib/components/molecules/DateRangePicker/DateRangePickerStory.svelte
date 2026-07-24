<script lang="ts">
	import DateRangePicker from './DateRangePicker.svelte';

	let {
		months = 2,
		variant = 'split',
		label = ''
	}: {
		months?: 1 | 2;
		variant?: 'field' | 'split';
		label?: string;
	} = $props();

	const today = new Date();
	const iso = (day: number) => {
		const d = new Date(today.getFullYear(), today.getMonth(), day);
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
	};

	let start = $state(iso(5));
	let end = $state(iso(12));
	let open = $state(false);
</script>

<div class={['flex min-h-96 flex-col gap-3', months === 2 ? 'w-[36rem]' : 'w-[20rem]']}>
	<DateRangePicker
		{months}
		{variant}
		{label}
		bind:start
		bind:end
		bind:open
		startLabel="Check-in"
		endLabel="Check-out"
	/>
	<p class="text-xs text-muted">
		Range: <span class="text-primary">{start || '—'} → {end || '—'}</span>
	</p>
</div>
