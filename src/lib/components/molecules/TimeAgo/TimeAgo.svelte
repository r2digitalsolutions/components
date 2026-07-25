<script lang="ts">
	interface TimeAgoProps {
		date: Date | string | number;
		/** Refresh interval in ms. Default 60s. */
		refreshMs?: number;
		locale?: string;
		class?: string;
	}

	let {
		date,
		refreshMs = 60_000,
		locale = 'en',
		class: className = ''
	}: TimeAgoProps = $props();

	let now = $state(Date.now());

	const target = $derived(
		typeof date === 'number' ? date : typeof date === 'string' ? new Date(date).getTime() : date.getTime()
	);

	const absolute = $derived(new Date(target).toLocaleString(locale));

	const relative = $derived.by(() => {
		const diff = Math.round((target - now) / 1000);
		const abs = Math.abs(diff);
		const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

		if (abs < 60) return rtf.format(Math.trunc(diff), 'second');
		if (abs < 3600) return rtf.format(Math.trunc(diff / 60), 'minute');
		if (abs < 86400) return rtf.format(Math.trunc(diff / 3600), 'hour');
		if (abs < 604800) return rtf.format(Math.trunc(diff / 86400), 'day');
		if (abs < 2629800) return rtf.format(Math.trunc(diff / 604800), 'week');
		if (abs < 31557600) return rtf.format(Math.trunc(diff / 2629800), 'month');
		return rtf.format(Math.trunc(diff / 31557600), 'year');
	});

	$effect(() => {
		now = Date.now();
		const id = setInterval(() => (now = Date.now()), refreshMs);
		return () => clearInterval(id);
	});
</script>

<time class={['text-sm text-muted', className]} datetime={new Date(target).toISOString()} title={absolute}>
	{relative}
</time>
