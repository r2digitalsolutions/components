<script lang="ts">
	type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	type SpinnerVariant = 'primary' | 'secondary' | 'white' | 'current';

	interface SpinnerProps {
		size?: SpinnerSize;
		variant?: SpinnerVariant;
		label?: string;
		class?: string;
	}

	const {
		size = 'md',
		variant = 'primary',
		label = 'Loading...',
		class: className = ''
	}: SpinnerProps = $props();

	const sizeClasses: Record<SpinnerSize, string> = {
		xs: 'h-3 w-3',
		sm: 'h-4 w-4',
		md: 'h-6 w-6',
		lg: 'h-8 w-8',
		xl: 'h-10 w-10'
	};

	const variantClasses: Record<SpinnerVariant, string> = {
		primary: 'text-brand-500',
		secondary: 'text-secondary',
		white: 'text-white',
		current: 'text-current'
	};
</script>

<svg
	class={['animate-spin', sizeClasses[size], variantClasses[variant], className]}
	xmlns="http://www.w3.org/2000/svg"
	fill="none"
	viewBox="0 0 24 24"
	role="status"
	aria-label={label}
>
	<circle
		class="opacity-25"
		cx="12"
		cy="12"
		r="10"
		stroke="currentColor"
		stroke-width="4"
	></circle>
	<path
		class="opacity-75"
		fill="currentColor"
		d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
	></path>
</svg>
