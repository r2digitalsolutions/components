<script lang="ts">
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Heading from '$lib/components/atoms/Heading/Heading.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	export interface CalendarEvent {
		id: string;
		title: string;
		date: string; // YYYY-MM-DD
		time?: string;
		color?: 'brand' | 'success' | 'warning' | 'error' | 'info';
	}

	interface EventCalendarProps {
		events?: CalendarEvent[];
		month?: Date;
		class?: string;
		ondayclick?: (date: string) => void;
		oneventclick?: (event: CalendarEvent) => void;
	}

	let {
		events = [],
		month = $bindable(new Date()),
		class: className = '',
		ondayclick,
		oneventclick
	}: EventCalendarProps = $props();

	const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

	const year = $derived(month.getFullYear());
	const monthIndex = $derived(month.getMonth());
	const title = $derived(
		month.toLocaleDateString('en', { month: 'long', year: 'numeric' })
	);

	function toKey(y: number, m: number, d: number) {
		return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
	}

	const cells = $derived.by(() => {
		const first = new Date(year, monthIndex, 1);
		const startPad = (first.getDay() + 6) % 7; // Monday-first
		const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
		const out: Array<{ day: number | null; key: string | null }> = [];
		for (let i = 0; i < startPad; i++) out.push({ day: null, key: null });
		for (let d = 1; d <= daysInMonth; d++) {
			out.push({ day: d, key: toKey(year, monthIndex, d) });
		}
		while (out.length % 7 !== 0) out.push({ day: null, key: null });
		return out;
	});

	const byDate = $derived.by(() => {
		const map = new Map<string, CalendarEvent[]>();
		for (const e of events) {
			const list = map.get(e.date) ?? [];
			list.push(e);
			map.set(e.date, list);
		}
		return map;
	});

	const colorDot: Record<NonNullable<CalendarEvent['color']>, string> = {
		brand: 'bg-brand-500',
		success: 'bg-green-500',
		warning: 'bg-amber-500',
		error: 'bg-red-500',
		info: 'bg-sky-500'
	};

	function prev() {
		month = new Date(year, monthIndex - 1, 1);
	}
	function next() {
		month = new Date(year, monthIndex + 1, 1);
	}
</script>

<Card class={className} padding="md" chrome={false}>
	<div class="mb-3 flex items-center justify-between gap-2">
		<Heading level={3} size="md">{title}</Heading>
		<div class="flex items-center gap-1">
			<IconButton label="Previous month" size="sm" onclick={prev}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
			</IconButton>
			<IconButton label="Next month" size="sm" onclick={next}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
			</IconButton>
		</div>
	</div>

	<div class="grid grid-cols-7 gap-1">
		{#each weekdays as day}
			<div class="px-1 py-1 text-center text-[11px] font-medium uppercase tracking-wide text-muted">{day}</div>
		{/each}
		{#each cells as cell}
			{#if cell.day == null}
				<div class="min-h-20 rounded-lg bg-transparent"></div>
			{:else}
				{@const dayEvents = byDate.get(cell.key!) ?? []}
				<div
					class="min-h-20 rounded-lg border border-border bg-surface px-1.5 py-1 text-left transition hover:border-border-strong hover:bg-surface-overlay"
				>
					<button
						type="button"
						class="text-xs font-semibold text-primary hover:underline"
						onclick={() => ondayclick?.(cell.key!)}
					>
						{cell.day}
					</button>
					<div class="mt-1 space-y-0.5">
						{#each dayEvents.slice(0, 2) as ev (ev.id)}
							<button
								type="button"
								class="flex w-full items-center gap-1 truncate rounded px-1 py-0.5 text-[10px] text-secondary hover:bg-surface-elevated"
								onclick={() => oneventclick?.(ev)}
							>
								<span class={['h-1.5 w-1.5 shrink-0 rounded-full', colorDot[ev.color ?? 'brand']]}></span>
								<span class="truncate">{ev.title}</span>
							</button>
						{/each}
						{#if dayEvents.length > 2}
							<Badge size="sm" variant="secondary">+{dayEvents.length - 2}</Badge>
						{/if}
					</div>
				</div>
			{/if}
		{/each}
	</div>

	{#if events.length === 0}
		<Text size="xs" tone="muted" class="mt-3">No events this month.</Text>
	{/if}
</Card>
