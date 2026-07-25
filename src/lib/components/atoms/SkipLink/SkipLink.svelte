<script lang="ts">
	interface SkipLinkProps {
		href?: string;
		label?: string;
		class?: string;
	}

	let {
		href = '#main',
		label = 'Skip to main content',
		class: className = ''
	}: SkipLinkProps = $props();
</script>

<a {href} class={['skip-link', className]}>
	{label}
</a>

<style>
	.skip-link {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.skip-link:focus {
		position: fixed;
		left: 1rem;
		top: 1rem;
		z-index: 100;
		width: auto;
		height: auto;
		margin: 0;
		overflow: visible;
		clip: auto;
		white-space: normal;
		border-radius: 0.5rem;
		background: var(--color-brand-500, #3b82f6);
		padding: 0.625rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: white;
		box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
		outline: none;
	}

	.skip-link:focus-visible {
		box-shadow:
			0 0 0 2px var(--color-surface-elevated, #fff),
			0 0 0 4px var(--color-brand-500, #3b82f6);
	}
</style>
