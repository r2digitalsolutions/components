<script lang="ts">
	interface TypingIndicatorProps {
		/** Visible + accessible text. If omitted and `names` is set, text is generated. */
		label?: string;
		/** People currently typing — used to build the label when `label` is not set. */
		names?: string[];
		/** Show the label next to the dots. Default: true when there is text. */
		showText?: boolean;
		size?: 'sm' | 'md' | 'lg';
		/** `bubble` looks like a chat message; `plain` is just dots (+ optional text). */
		variant?: 'bubble' | 'plain';
		class?: string;
	}

	let {
		label,
		names = [],
		showText,
		size = 'md',
		variant = 'bubble',
		class: className = ''
	}: TypingIndicatorProps = $props();

	const resolvedLabel = $derived.by(() => {
		if (label) return label;
		if (names.length === 1) return `${names[0]} is typing`;
		if (names.length === 2) return `${names[0]} and ${names[1]} are typing`;
		if (names.length > 2) return `${names.length} people are typing`;
		return 'Typing';
	});

	const shouldShowText = $derived(showText ?? (Boolean(label) || names.length > 0));

	const sizes = {
		sm: {
			wrap: 'gap-2 px-2.5 py-1.5',
			dot: 'h-1.5 w-1.5',
			text: 'text-xs',
			dotsGap: 'gap-1'
		},
		md: {
			wrap: 'gap-2.5 px-3.5 py-2.5',
			dot: 'h-2 w-2',
			text: 'text-sm',
			dotsGap: 'gap-1.5'
		},
		lg: {
			wrap: 'gap-3 px-4 py-3',
			dot: 'h-2.5 w-2.5',
			text: 'text-base',
			dotsGap: 'gap-1.5'
		}
	};
</script>

<div
	class={[
		'inline-flex max-w-full items-center',
		sizes[size].wrap,
		variant === 'bubble' &&
			'rounded-2xl rounded-bl-sm border border-border bg-surface-overlay text-secondary shadow-sm',
		variant === 'plain' && 'text-muted',
		className
	]}
	role="status"
	aria-live="polite"
	aria-label={resolvedLabel}
>
	<span class={['inline-flex items-center', sizes[size].dotsGap]} aria-hidden="true">
		<span class={['typing-dot rounded-full bg-current opacity-50', sizes[size].dot]}></span>
		<span class={['typing-dot rounded-full bg-current opacity-50', sizes[size].dot]}></span>
		<span class={['typing-dot rounded-full bg-current opacity-50', sizes[size].dot]}></span>
	</span>

	{#if shouldShowText}
		<span class={['truncate font-medium', sizes[size].text]}>{resolvedLabel}…</span>
	{:else}
		<span class="sr-only">{resolvedLabel}</span>
	{/if}
</div>

<style>
	.typing-dot {
		animation: typing-pulse 1.2s ease-in-out infinite;
	}

	.typing-dot:nth-child(2) {
		animation-delay: 0.15s;
	}

	.typing-dot:nth-child(3) {
		animation-delay: 0.3s;
	}

	@keyframes typing-pulse {
		0%,
		60%,
		100% {
			opacity: 0.35;
			transform: translateY(0);
		}
		30% {
			opacity: 1;
			transform: translateY(-2px);
		}
	}
</style>
