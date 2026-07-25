<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	type CookieVariant = 'bar' | 'card';

	interface CookieConsentProps {
		title?: string;
		description?: string;
		acceptLabel?: string;
		rejectLabel?: string;
		customizeLabel?: string;
		policyLabel?: string;
		policyHref?: string;
		showCustomize?: boolean;
		/** `bar` = full-width bottom strip (default). `card` = floating panel. */
		variant?: CookieVariant;
		position?: 'bottom' | 'bottom-left' | 'bottom-right';
		/** `fixed` for viewport, `absolute` when nested in a positioned parent */
		placement?: 'fixed' | 'absolute';
		class?: string;
		children?: Snippet;
		onaccept?: () => void;
		onreject?: () => void;
		oncustomize?: () => void;
	}

	let {
		title = 'Cookies & privacy',
		description = 'We use cookies to keep the product working and understand how it’s used. You can accept all, reject non-essential ones, or manage preferences.',
		acceptLabel = 'Accept all',
		rejectLabel = 'Reject non-essential',
		customizeLabel = 'Manage',
		policyLabel = 'Privacy policy',
		policyHref,
		showCustomize = true,
		variant = 'bar',
		position = 'bottom',
		placement = 'fixed',
		class: className = '',
		children,
		onaccept,
		onreject,
		oncustomize
	}: CookieConsentProps = $props();

	let open = $state(true);

	const cardCorners = {
		bottom: 'inset-x-4 bottom-4 mx-auto w-auto max-w-lg',
		'bottom-left': 'bottom-4 left-4 w-[min(100%-2rem,22rem)]',
		'bottom-right': 'bottom-4 right-4 w-[min(100%-2rem,22rem)]'
	};

	function accept() {
		open = false;
		onaccept?.();
	}

	function reject() {
		open = false;
		onreject?.();
	}
</script>

{#if open}
	{#if variant === 'bar'}
		<div
			class={[
				'z-50 border-t border-border bg-surface-elevated/95 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md dark:shadow-[0_-8px_30px_rgba(0,0,0,0.35)]',
				placement,
				'inset-x-0 bottom-0',
				className
			]}
			role="dialog"
			aria-modal="false"
			aria-labelledby="cookie-consent-title"
			aria-describedby="cookie-consent-desc"
		>
			<div
				class="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-5"
			>
				<div class="flex min-w-0 flex-1 gap-3">
					<div
						class="mt-0.5 hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 sm:flex"
						aria-hidden="true"
					>
						<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 3a9 9 0 00-9 9 9.5 9.5 0 001.2 4.6c.3.5.2 1.2-.3 1.6A3 3 0 007 23a9 9 0 109.8-19.7A4 4 0 0012 3z"
							/>
							<circle cx="8.5" cy="10" r="1" fill="currentColor" stroke="none" />
							<circle cx="12.5" cy="14" r="1" fill="currentColor" stroke="none" />
							<circle cx="15.5" cy="9.5" r="1" fill="currentColor" stroke="none" />
						</svg>
					</div>

					<div class="min-w-0 space-y-1">
						<h2 id="cookie-consent-title" class="text-sm font-semibold text-primary">
							{title}
						</h2>
						{#if children}
							<div id="cookie-consent-desc" class="text-sm leading-relaxed text-muted">
								{@render children()}
							</div>
						{:else}
							<p id="cookie-consent-desc" class="text-sm leading-relaxed text-muted">
								{description}
								{#if policyHref}
									<a
										href={policyHref}
										class="ml-1 font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
									>
										{policyLabel}
									</a>
								{/if}
							</p>
						{/if}
					</div>
				</div>

				<div class="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
					{#if showCustomize}
						<Button size="sm" variant="ghost" class="justify-center" onclick={() => oncustomize?.()}>
							{customizeLabel}
						</Button>
					{/if}
					<Button size="sm" variant="secondary" class="justify-center" onclick={reject}>
						{rejectLabel}
					</Button>
					<Button size="sm" class="justify-center" onclick={accept}>{acceptLabel}</Button>
				</div>
			</div>
		</div>
	{:else}
		<div
			class={[
				'z-50 overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-xl',
				placement,
				cardCorners[position],
				className
			]}
			role="dialog"
			aria-modal="false"
			aria-labelledby="cookie-consent-title"
			aria-describedby="cookie-consent-desc"
		>
			<div class="border-b border-border bg-surface-overlay/60 px-5 py-4">
				<div class="flex items-start gap-3">
					<div
						class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400"
						aria-hidden="true"
					>
						<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 3a9 9 0 00-9 9 9.5 9.5 0 001.2 4.6c.3.5.2 1.2-.3 1.6A3 3 0 007 23a9 9 0 109.8-19.7A4 4 0 0012 3z"
							/>
							<circle cx="8.5" cy="10" r="1" fill="currentColor" stroke="none" />
							<circle cx="12.5" cy="14" r="1" fill="currentColor" stroke="none" />
							<circle cx="15.5" cy="9.5" r="1" fill="currentColor" stroke="none" />
						</svg>
					</div>
					<div class="min-w-0 space-y-1">
						<h2 id="cookie-consent-title" class="text-sm font-semibold text-primary">{title}</h2>
						{#if children}
							<div id="cookie-consent-desc" class="text-sm leading-relaxed text-muted">
								{@render children()}
							</div>
						{:else}
							<p id="cookie-consent-desc" class="text-sm leading-relaxed text-muted">
								{description}
								{#if policyHref}
									<a
										href={policyHref}
										class="ml-1 font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
									>
										{policyLabel}
									</a>
								{/if}
							</p>
						{/if}
					</div>
				</div>
			</div>

			<div class="flex flex-col gap-2 p-4 sm:flex-row sm:justify-end">
				{#if showCustomize}
					<Button size="sm" variant="ghost" class="justify-center" onclick={() => oncustomize?.()}>
						{customizeLabel}
					</Button>
				{/if}
				<Button size="sm" variant="secondary" class="justify-center" onclick={reject}>
					{rejectLabel}
				</Button>
				<Button size="sm" class="justify-center" onclick={accept}>{acceptLabel}</Button>
			</div>
		</div>
	{/if}
{/if}
