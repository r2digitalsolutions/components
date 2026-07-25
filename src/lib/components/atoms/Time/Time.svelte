<script lang="ts">
	interface TimeProps {
		date: Date | string | number;
		locale?: string;
		/** Intl.DateTimeFormat options preset */
		format?: 'short' | 'medium' | 'long' | 'time' | 'datetime';
		class?: string;
	}

	const {
		date,
		locale = 'en',
		format = 'medium',
		class: className = ''
	}: TimeProps = $props();

	const value = $derived(
		typeof date === 'number' ? new Date(date) : typeof date === 'string' ? new Date(date) : date
	);

	const options: Record<NonNullable<TimeProps['format']>, Intl.DateTimeFormatOptions> = {
		short: { dateStyle: 'short' },
		medium: { dateStyle: 'medium' },
		long: { dateStyle: 'long' },
		time: { timeStyle: 'short' },
		datetime: { dateStyle: 'medium', timeStyle: 'short' }
	};

	const label = $derived(
		Number.isNaN(value.getTime())
			? 'Invalid date'
			: new Intl.DateTimeFormat(locale, options[format]).format(value)
	);
</script>

<time datetime={Number.isNaN(value.getTime()) ? undefined : value.toISOString()} class={['text-sm text-secondary tabular-nums', className]}>
	{label}
</time>
