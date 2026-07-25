<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	export interface ScheduleSlot {
		id: string;
		time: string;
		available?: boolean;
	}

	export interface ScheduleBooking {
		id: string;
		slotId: string;
		title: string;
		with?: string;
	}

	interface SchedulerProps {
		title?: string;
		description?: string;
		dateLabel?: string;
		slots?: ScheduleSlot[];
		bookings?: ScheduleBooking[];
		selectedSlotId?: string | null;
		class?: string;
		onselect?: (slotId: string) => void;
	}

	let {
		title = 'Schedule',
		description = 'Pick an available time.',
		dateLabel = 'Today',
		slots = [],
		bookings = [],
		selectedSlotId = $bindable(null as string | null),
		class: className = '',
		onselect
	}: SchedulerProps = $props();

	function bookingFor(slotId: string) {
		return bookings.find((b) => b.slotId === slotId);
	}

	function select(slot: ScheduleSlot) {
		if (slot.available === false || bookingFor(slot.id)) return;
		selectedSlotId = slot.id;
		onselect?.(slot.id);
	}
</script>

<div class={['w-full max-w-md space-y-4', className]}>
	<PageHeader {title} {description} />

	<div class="flex items-center justify-between">
		<p class="text-sm font-semibold text-primary">{dateLabel}</p>
		<Badge size="sm" variant="secondary">
			{slots.filter((s) => s.available !== false && !bookingFor(s.id)).length} open
		</Badge>
	</div>

	<ul class="space-y-1.5">
		{#each slots as slot (slot.id)}
			{@const booking = bookingFor(slot.id)}
			{@const taken = !!booking || slot.available === false}
			{@const selected = selectedSlotId === slot.id}
			<li>
				<button
					type="button"
					disabled={taken}
					class={[
						'flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors',
						selected && 'border-brand-500/50 bg-brand-500/10',
						!selected && !taken && 'border-border bg-surface-elevated hover:border-brand-500/30 hover:bg-surface-overlay',
						taken && 'cursor-not-allowed border-border/60 bg-surface opacity-60'
					]}
					onclick={() => select(slot)}
				>
					<span class="font-mono text-xs font-medium text-primary">{slot.time}</span>
					{#if booking}
						<span class="min-w-0 truncate text-xs text-secondary">
							{booking.title}{#if booking.with} · {booking.with}{/if}
						</span>
					{:else if taken}
						<Text size="xs" tone="muted" as="span">Unavailable</Text>
					{:else if selected}
						<span class="text-xs font-medium text-brand-700 dark:text-brand-300">Selected</span>
					{:else}
						<span class="text-xs text-muted">Available</span>
					{/if}
				</button>
			</li>
		{/each}
	</ul>
</div>
