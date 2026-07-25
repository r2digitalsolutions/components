<script lang="ts">
	interface PasswordStrengthProps {
		password?: string;
		showLabel?: boolean;
		class?: string;
	}

	let {
		password = '',
		showLabel = true,
		class: className = ''
	}: PasswordStrengthProps = $props();

	type Level = 0 | 1 | 2 | 3 | 4;

	const score = $derived.by((): Level => {
		if (!password) return 0;
		let s = 0;
		if (password.length >= 8) s++;
		if (password.length >= 12) s++;
		if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++;
		if (/\d/.test(password)) s++;
		if (/[^A-Za-z0-9]/.test(password)) s++;
		return Math.min(4, s) as Level;
	});

	const labels: Record<Level, string> = {
		0: 'Enter a password',
		1: 'Weak',
		2: 'Fair',
		3: 'Good',
		4: 'Strong'
	};

	const colors: Record<Level, string> = {
		0: 'bg-border',
		1: 'bg-red-500',
		2: 'bg-amber-500',
		3: 'bg-sky-500',
		4: 'bg-green-500'
	};

	const textColors: Record<Level, string> = {
		0: 'text-muted',
		1: 'text-red-600 dark:text-red-400',
		2: 'text-amber-600 dark:text-amber-400',
		3: 'text-sky-600 dark:text-sky-400',
		4: 'text-green-600 dark:text-green-400'
	};
</script>

<div class={['w-full space-y-1.5', className]} role="status" aria-label="Password strength: {labels[score]}">
	<div class="flex gap-1.5">
		{#each [1, 2, 3, 4] as step (step)}
			<div
				class={[
					'h-1.5 flex-1 rounded-full transition-colors duration-200',
					score >= step ? colors[score] : 'bg-surface-overlay'
				]}
			></div>
		{/each}
	</div>
	{#if showLabel}
		<p class={['text-xs font-medium', textColors[score]]}>{labels[score]}</p>
	{/if}
</div>
