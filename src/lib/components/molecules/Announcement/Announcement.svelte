<script lang="ts">
	import type { Snippet } from 'svelte';

	type AnnouncementTone = 'brand' | 'neutral' | 'warning' | 'success';

	interface AnnouncementProps {
		message: string;
		/** Small pill before the message, e.g. "New" */
		badge?: string;
		href?: string;
		linkLabel?: string;
		dismissible?: boolean;
		tone?: AnnouncementTone;
		sticky?: boolean;
		class?: string;
		icon?: Snippet;
		action?: Snippet;
		ondismiss?: () => void;
	}

	let {
		message,
		badge,
		href,
		linkLabel = 'Learn more',
		dismissible = true,
		tone = 'brand',
		sticky = false,
		class: className = '',
		icon,
		action,
		ondismiss
	}: AnnouncementProps = $props();

	let visible = $state(true);

	const tones: Record<
		AnnouncementTone,
		{ bar: string; badge: string; link: string; dismiss: string; icon: string }
	> = {
		brand: {
			bar: 'border-brand-200/80 bg-brand-50 text-brand-950 dark:border-brand-900/50 dark:bg-brand-950/50 dark:text-brand-50',
			badge:
				'bg-brand-500 text-white dark:bg-brand-400 dark:text-brand-950',
			link: 'text-brand-700 hover:text-brand-900 dark:text-brand-300 dark:hover:text-brand-100',
			dismiss: 'text-brand-700/70 hover:bg-brand-500/10 hover:text-brand-900 dark:text-brand-300/70 dark:hover:bg-brand-400/10 dark:hover:text-brand-100',
			icon: 'text-brand-600 dark:text-brand-400'
		},
		neutral: {
			bar: 'border-border bg-surface-overlay text-primary',
			badge: 'bg-surface-elevated text-secondary border border-border',
			link: 'text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300',
			dismiss: 'text-muted hover:bg-surface-elevated hover:text-primary',
			icon: 'text-muted'
		},
		warning: {
			bar: 'border-amber-200/80 bg-amber-50 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-50',
			badge: 'bg-amber-500 text-amber-950',
			link: 'text-amber-800 hover:text-amber-950 dark:text-amber-300 dark:hover:text-amber-100',
			dismiss: 'text-amber-800/70 hover:bg-amber-500/15 hover:text-amber-950 dark:text-amber-300/70 dark:hover:bg-amber-400/10',
			icon: 'text-amber-600 dark:text-amber-400'
		},
		success: {
			bar: 'border-green-200/80 bg-green-50 text-green-950 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-50',
			badge: 'bg-green-600 text-white dark:bg-green-500 dark:text-green-950',
			link: 'text-green-800 hover:text-green-950 dark:text-green-300 dark:hover:text-green-100',
			dismiss: 'text-green-800/70 hover:bg-green-500/15 hover:text-green-950 dark:text-green-300/70 dark:hover:bg-green-400/10',
			icon: 'text-green-600 dark:text-green-400'
		}
	};

	function dismiss() {
		visible = false;
		ondismiss?.();
	}
</script>

{#if visible}
	<div
		class={[
			'announcement w-full border-b',
			tones[tone].bar,
			sticky && 'sticky top-0 z-40 backdrop-blur-md supports-[backdrop-filter]:bg-opacity-90',
			className
		]}
		role="status"
	>
		<div
			class="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6"
		>
			<div class="flex min-w-0 flex-1 items-center justify-center gap-2.5 sm:justify-start">
				{#if icon}
					<span class={['hidden shrink-0 sm:inline-flex', tones[tone].icon]}>
						{@render icon()}
					</span>
				{:else}
					<span class={['hidden shrink-0 sm:inline-flex', tones[tone].icon]} aria-hidden="true">
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
							/>
						</svg>
					</span>
				{/if}

				{#if badge}
					<span
						class={[
							'inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
							tones[tone].badge
						]}
					>
						{badge}
					</span>
				{/if}

				<p class="min-w-0 truncate text-sm font-medium leading-snug">
					{message}
				</p>

				{#if href}
					<a
						{href}
						class={[
							'hidden shrink-0 items-center gap-1 text-sm font-semibold underline-offset-2 hover:underline sm:inline-flex',
							tones[tone].link
						]}
					>
						{linkLabel}
						<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
						</svg>
					</a>
				{/if}

				{#if action}
					<div class="hidden shrink-0 sm:block">
						{@render action()}
					</div>
				{/if}
			</div>

			{#if dismissible}
				<button
					type="button"
					class={[
						'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40',
						tones[tone].dismiss
					]}
					aria-label="Dismiss announcement"
					onclick={dismiss}
				>
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			{/if}
		</div>

		{#if href}
			<!-- Mobile CTA under message -->
			<div class="flex justify-center border-t border-current/5 px-4 pb-2.5 sm:hidden">
				<a
					{href}
					class={['inline-flex items-center gap-1 text-xs font-semibold', tones[tone].link]}
				>
					{linkLabel}
					<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
					</svg>
				</a>
			</div>
		{/if}
	</div>
{/if}
