<script lang="ts">
	import type { Snippet } from 'svelte';

	type AlertVariant = 'info' | 'success' | 'warning' | 'error';

	/** Extensible list entry for structured alert details */
	export interface AlertItem {
		text: string;
		id?: string;
	}

	interface AlertProps {
		variant?: AlertVariant;
		title?: string;
		message?: string;
		items?: AlertItem[];
		dismissible?: boolean;
		class?: string;
		children?: Snippet;
		ondismiss?: () => void;
	}

	let {
		variant = 'info',
		title,
		message,
		items = [],
		dismissible = false,
		class: className = '',
		children,
		ondismiss
	}: AlertProps = $props();

	let dismissed = $state(false);

	const hasItems = $derived(items.length > 0);

	const icons: Record<AlertVariant, string> = {
		info: `<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>`,
		success: `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>`,
		warning: `<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>`,
		error: `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>`
	};

	function handleDismiss() {
		dismissed = true;
		ondismiss?.();
	}
</script>

{#if !dismissed}
	<div class={['alert', `alert--${variant}`, className]} role="alert">
		<span class="alert-accent" aria-hidden="true"></span>

		<svg class="alert-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
			{@html icons[variant]}
		</svg>

		<div class="alert-content">
			{#if title}
				<h4 class="alert-title">{title}</h4>
			{/if}
			{#if message}
				<p class="alert-message">{message}</p>
			{/if}
			{#if hasItems}
				<ul class={['alert-list', message || title ? 'alert-list--spaced' : '']}>
					{#each items as item, index (item.id ?? index)}
						<li>{item.text}</li>
					{/each}
				</ul>
			{/if}
			{@render children?.()}
		</div>

		{#if dismissible}
			<button type="button" onclick={handleDismiss} class="alert-dismiss" aria-label="Dismiss alert">
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		{/if}
	</div>
{/if}

<style>
	.alert {
		position: relative;
		display: flex;
		width: 100%;
		align-items: flex-start;
		gap: 0.75rem;
		overflow: hidden;
		border-radius: 0.75rem;
		border: 1px solid var(--alert-border);
		background: var(--alert-bg);
		color: var(--alert-fg);
		padding: 0.875rem 1rem;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease;
	}

	.alert--info {
		--alert-bg: var(--alert-info-bg);
		--alert-border: var(--alert-info-border);
		--alert-fg: var(--alert-info-fg);
		--alert-muted: var(--alert-info-muted);
		--alert-icon: var(--alert-info-icon);
		--alert-accent: var(--alert-info-accent);
	}

	.alert--success {
		--alert-bg: var(--alert-success-bg);
		--alert-border: var(--alert-success-border);
		--alert-fg: var(--alert-success-fg);
		--alert-muted: var(--alert-success-muted);
		--alert-icon: var(--alert-success-icon);
		--alert-accent: var(--alert-success-accent);
	}

	.alert--warning {
		--alert-bg: var(--alert-warning-bg);
		--alert-border: var(--alert-warning-border);
		--alert-fg: var(--alert-warning-fg);
		--alert-muted: var(--alert-warning-muted);
		--alert-icon: var(--alert-warning-icon);
		--alert-accent: var(--alert-warning-accent);
	}

	.alert--error {
		--alert-bg: var(--alert-error-bg);
		--alert-border: var(--alert-error-border);
		--alert-fg: var(--alert-error-fg);
		--alert-muted: var(--alert-error-muted);
		--alert-icon: var(--alert-error-icon);
		--alert-accent: var(--alert-error-accent);
	}

	.alert-accent {
		position: absolute;
		inset: 0 auto 0 0;
		width: 3px;
		background: var(--alert-accent);
	}

	.alert-icon {
		margin-top: 0.125rem;
		height: 1.25rem;
		width: 1.25rem;
		flex-shrink: 0;
		color: var(--alert-icon);
	}

	.alert-content {
		min-width: 0;
		flex: 1;
	}

	.alert-title {
		margin: 0;
		font-size: 0.875rem;
		font-weight: 600;
		line-height: 1.35;
		color: var(--alert-fg);
	}

	.alert-message {
		margin: 0.125rem 0 0;
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--alert-muted);
	}

	.alert-list {
		margin: 0;
		list-style: disc;
		padding-left: 1.1rem;
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--alert-muted);
	}

	.alert-list--spaced {
		margin-top: 0.5rem;
	}

	.alert-list li + li {
		margin-top: 0.25rem;
	}

	.alert-dismiss {
		margin: -0.125rem -0.25rem 0 0;
		flex-shrink: 0;
		border-radius: 0.375rem;
		padding: 0.25rem;
		color: var(--alert-muted);
		transition:
			background-color 0.15s ease,
			color 0.15s ease;
	}

	.alert-dismiss:hover {
		background: color-mix(in oklab, var(--alert-fg) 8%, transparent);
		color: var(--alert-fg);
	}

	.alert-dismiss:focus-visible {
		outline: 2px solid var(--alert-accent);
		outline-offset: 2px;
	}
</style>
