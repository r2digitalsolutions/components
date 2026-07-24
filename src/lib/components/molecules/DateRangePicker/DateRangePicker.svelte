<script lang="ts">
	import DatePicker, { type DatePickerPlacement } from '../DatePicker/DatePicker.svelte';
	import type { CalendarDot } from '../Calendar/Calendar.svelte';

	interface DateRangePickerProps {
		start?: string;
		end?: string;
		months?: 1 | 2;
		min?: string;
		max?: string;
		disabledDates?: string[];
		enabledDates?: string[];
		dots?: CalendarDot[];
		open?: boolean;
		disabled?: boolean;
		label?: string;
		placeholder?: string;
		startLabel?: string;
		endLabel?: string;
		startPlaceholder?: string;
		endPlaceholder?: string;
		/** `field` = one trigger; `split` = start / end fields. */
		variant?: 'field' | 'split';
		closeOnSelect?: boolean;
		placement?: DatePickerPlacement;
		class?: string;
		onchange?: (detail: { start: string; end: string }) => void;
	}

	let {
		start = $bindable(''),
		end = $bindable(''),
		months = 2,
		min,
		max,
		disabledDates = [],
		enabledDates,
		dots = [],
		open = $bindable(false),
		disabled = false,
		label = '',
		placeholder = 'Select dates',
		startLabel = 'Start',
		endLabel = 'End',
		startPlaceholder = 'Add date',
		endPlaceholder = 'Add date',
		variant = 'split',
		closeOnSelect = true,
		placement = 'auto',
		class: className = '',
		onchange
	}: DateRangePickerProps = $props();
</script>

<DatePicker
	mode="range"
	{months}
	bind:start
	bind:end
	{min}
	{max}
	{disabledDates}
	{enabledDates}
	{dots}
	bind:open
	{disabled}
	{label}
	{placeholder}
	{startLabel}
	{endLabel}
	{startPlaceholder}
	{endPlaceholder}
	{variant}
	{closeOnSelect}
	{placement}
	class={className}
	onchange={(detail) => onchange?.({ start: detail.start, end: detail.end })}
/>
