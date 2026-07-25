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
		position?: 'bottom-left' | 'bottom-right' | 'bottom-center';
		/**
		 * `fixed` — viewport (production).
		 * `absolute` — positioned parent.
		 * `static` — in document flow (Storybook / previews).
		 */
		placement?: 'fixed' | 'absolute' | 'static';
		class?: string;
		children?: Snippet;
		onaccept?: () => void;
		onreject?: () => void;
		oncustomize?: () => void;
	}

	let {
		title = 'Cookies & privacy',
		description = 'We use cookies to keep the product running and understand how it’s used. You can accept all, reject non-essential ones, or manage preferences.',
		acceptLabel = 'Accept all',
		rejectLabel = 'Reject non-essential',
		customizeLabel = 'Manage',
		policyLabel = 'Privacy policy',
		policyHref,
		showCustomize = true,
		variant = 'bar',
		position = 'bottom-center',
		placement = 'fixed',
		class: className = '',
		children,
		onaccept,
		onreject,
		oncustomize
	}: CookieConsentProps = $props();

	let open = $state(true);

	const cardPosition: Record<'bottom-left' | 'bottom-right' | 'bottom-center', string> = {
		'bottom-center': 'left-1/2 bottom-4 w-[min(100%-2rem,28rem)] -translate-x-1/2',
		'bottom-left': 'bottom-4 left-4 w-[min(100%-2rem,28rem)]',
		'bottom-right': 'bottom-4 right-4 w-[min(100%-2rem,28rem)]'
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
				'z-50 w-full border-t border-border bg-surface-elevated shadow-[0_-8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.35)]',
				placement === 'fixed' && 'fixed inset-x-0 bottom-0',
				placement === 'absolute' && 'absolute inset-x-0 bottom-0',
				placement === 'static' && 'relative',
				className
			]}
			role="dialog"
			aria-modal="false"
			aria-labelledby="cookie-consent-title"
			aria-describedby="cookie-consent-desc"
		>
			<div
				class="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:gap-8 md:px-6 md:py-5"
			>
				<div class="flex min-w-0 flex-1 items-start gap-3">
					<div
						class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400"
						aria-hidden="true"
					>
						<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<path
								d="M12 2a4 4 0 014 4 1 1 0 001 1 3 3 0 013 3c0 .35-.06.68-.16 1A4 4 0 0117 18a1 1 0 00-1 1 3 3 0 01-3 3H8a6 6 0 01-6-6V9a7 7 0 017-7h3zm-3.5 9a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm5 1a1 1 0 100 2 1 1 0 000-2zm-1 4a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z"
							/>
						</svg>
					</div>

					<div class="min-w-0 flex-1 space-y-1">
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
										class="whitespace-nowrap font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
									>
										{policyLabel}
									</a>
								{/if}
							</p>
						{/if}
					</div>
				</div>

				<div class="flex w-full shrink-0 flex-col-reverse gap-2 sm:w-auto sm:flex-row sm:items-center">
					{#if showCustomize}
						<Button size="sm" variant="ghost" class="w-full justify-center sm:w-auto" onclick={() => oncustomize?.()}>
							{customizeLabel}
						</Button>
					{/if}
					<Button size="sm" variant="secondary" class="w-full justify-center sm:w-auto" onclick={reject}>
						{rejectLabel}
					</Button>
					<Button size="sm" class="w-full justify-center sm:w-auto" onclick={accept}>{acceptLabel}</Button>
				</div>
			</div>
		</div>
	{:else}
		<div
			class={[
				'z-50 w-[min(100%,28rem)] overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-xl',
				placement === 'fixed' && ['fixed', cardPosition[position]],
				placement === 'absolute' && ['absolute', cardPosition[position]],
				placement === 'static' && 'relative mx-auto',
				className
			]}
			role="dialog"
			aria-modal="false"
			aria-labelledby="cookie-consent-title"
			aria-describedby="cookie-consent-desc"
		>
			<div class="flex items-start gap-3 border-b border-border px-5 py-4">
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400"
					aria-hidden="true"
				>
					<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path
							d="M12 2a4 4 0 014 4 1 1 0 001 1 3 3 0 013 3c0 .35-.06.68-.16 1A4 4 0 0117 18a1 1 0 00-1 1 3 3 0 01-3 3H8a6 6 0 01-6-6V9a7 7 0 017-7h3zm-3.5 9a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm5 1a1 1 0 100 2 1 1 0 000-2zm-1 4a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z"
						/>
					</svg>
				</div>
				<div class="min-w-0 flex-1 space-y-1">
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
									class="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
								>
									{policyLabel}
								</a>
							{/if}
						</p>
					{/if}
				</div>
			</div>

			<div class="flex flex-col-reverse gap-2 p-4 sm:flex-row sm:justify-end">
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
