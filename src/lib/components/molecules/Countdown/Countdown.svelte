<script lang="ts">
	interface CountdownProps {
		/** Target date/time as Date or ISO string */
		target: Date | string;
		/** Show days unit */
		showDays?: boolean;
		size?: 'sm' | 'md' | 'lg';
		label?: string;
		class?: string;
		oncomplete?: () => void;
	}

	let {
		target,
		showDays = true,
		size = 'md',
		label,
		class: className = '',
		oncomplete
	}: CountdownProps = $props();

	let now = $state(Date.now());
	let completed = $state(false);
	let interval: ReturnType<typeof setInterval> | undefined;

	const targetMs = $derived(typeof target === 'string' ? new Date(target).getTime() : target.getTime());

	const remaining = $derived(Math.max(0, targetMs - now));

	const parts = $derived.by(() => {
		const total = Math.floor(remaining / 1000);
		const days = Math.floor(total / 86400);
		const hours = Math.floor((total % 86400) / 3600);
		const minutes = Math.floor((total % 3600) / 60);
		const seconds = total % 60;
		return { days, hours, minutes, seconds };
	});

	const sizeClasses = {
		sm: { box: 'min-w-10 px-1.5 py-1 text-sm', label: 'text-[10px]' },
		md: { box: 'min-w-12 px-2 py-1.5 text-lg', label: 'text-xs' },
		lg: { box: 'min-w-14 px-2.5 py-2 text-2xl', label: 'text-xs' }
	};

	$effect(() => {
		now = Date.now();
		completed = false;
		interval = setInterval(() => {
			now = Date.now();
			if (!completed && targetMs - now <= 0) {
				completed = true;
				oncomplete?.();
			}
		}, 1000);
		return () => clearInterval(interval);
	});

	function pad(n: number) {
		return String(n).padStart(2, '0');
	}
</script>

<div class={['inline-flex flex-col gap-1.5', className]} role="timer" aria-live="polite">
	{#if label}
		<span class="text-xs font-medium text-muted">{label}</span>
	{/if}
	<div class="inline-flex items-center gap-1.5">
		{#if showDays}
			<div class="flex flex-col items-center gap-0.5">
				<span
					class={[
						'rounded-lg border border-border bg-surface-elevated text-center font-semibold tabular-nums text-primary',
						sizeClasses[size].box
					]}>{pad(parts.days)}</span
				>
				<span class={['text-muted', sizeClasses[size].label]}>Days</span>
			</div>
			<span class="pb-4 text-muted">:</span>
		{/if}
		<div class="flex flex-col items-center gap-0.5">
			<span
				class={[
					'rounded-lg border border-border bg-surface-elevated text-center font-semibold tabular-nums text-primary',
					sizeClasses[size].box
				]}>{pad(parts.hours)}</span
			>
			<span class={['text-muted', sizeClasses[size].label]}>Hrs</span>
		</div>
		<span class="pb-4 text-muted">:</span>
		<div class="flex flex-col items-center gap-0.5">
			<span
				class={[
					'rounded-lg border border-border bg-surface-elevated text-center font-semibold tabular-nums text-primary',
					sizeClasses[size].box
				]}>{pad(parts.minutes)}</span
			>
			<span class={['text-muted', sizeClasses[size].label]}>Min</span>
		</div>
		<span class="pb-4 text-muted">:</span>
		<div class="flex flex-col items-center gap-0.5">
			<span
				class={[
					'rounded-lg border border-border bg-surface-elevated text-center font-semibold tabular-nums text-primary',
					sizeClasses[size].box
				]}>{pad(parts.seconds)}</span
			>
			<span class={['text-muted', sizeClasses[size].label]}>Sec</span>
		</div>
	</div>
</div>
