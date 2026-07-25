<script lang="ts">
	import WifiOff from '@lucide/svelte/icons/wifi-off';
	import Wifi from '@lucide/svelte/icons/wifi';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';

	interface OfflineBannerProps {
		/** Force online/offline; when null, uses navigator.onLine */
		forced?: boolean | null;
		title?: string;
		description?: string;
		/** Show a brief “Back online” toast when connection returns */
		showReconnected?: boolean;
		reconnectedTitle?: string;
		reconnectedDescription?: string;
		sticky?: boolean;
		retryLabel?: string;
		class?: string;
		onretry?: () => void;
	}

	let {
		forced = null,
		title = "You're offline",
		description = 'Changes may not sync until your connection is back.',
		showReconnected = true,
		reconnectedTitle = "You're back online",
		reconnectedDescription = "Connection restored. You're good to go.",
		sticky = true,
		retryLabel = 'Retry',
		class: className = '',
		onretry
	}: OfflineBannerProps = $props();

	let online = $state(typeof navigator !== 'undefined' ? navigator.onLine : true);
	let reconnectedFlash = $state(false);
	let wasOffline = $state(false);
	let flashTimer: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		if (typeof window === 'undefined') return;
		const sync = () => (online = navigator.onLine);
		window.addEventListener('online', sync);
		window.addEventListener('offline', sync);
		return () => {
			window.removeEventListener('online', sync);
			window.removeEventListener('offline', sync);
			if (flashTimer) clearTimeout(flashTimer);
		};
	});

	const isOnline = $derived(forced === null ? online : !!forced);

	$effect(() => {
		if (!isOnline) {
			wasOffline = true;
			reconnectedFlash = false;
			return;
		}
		if (wasOffline && showReconnected) {
			reconnectedFlash = true;
			if (flashTimer) clearTimeout(flashTimer);
			flashTimer = setTimeout(() => {
				reconnectedFlash = false;
				wasOffline = false;
			}, 3200);
		}
	});
</script>

{#if !isOnline}
	<div
		class={[
			'w-full border-b border-amber-200/80 bg-amber-50 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/50 dark:text-amber-50',
			sticky && 'sticky top-0 z-50 backdrop-blur-md',
			className
		]}
		role="alert"
		aria-live="assertive"
	>
		<div
			class="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6"
		>
			<div class="flex min-w-0 items-center gap-3">
				<span
					class="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
				>
					<span
						class="absolute inset-0 animate-ping rounded-lg bg-amber-400/25 dark:bg-amber-400/15"
						aria-hidden="true"
					></span>
					<WifiOff class="relative h-4 w-4" strokeWidth={2} />
				</span>
				<div class="min-w-0">
					<p class="truncate text-sm font-semibold tracking-tight">{title}</p>
					<p class="truncate text-xs text-amber-900/70 dark:text-amber-100/65">{description}</p>
				</div>
			</div>

			{#if onretry}
				<button
					type="button"
					class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-amber-300/70 bg-white/70 px-2.5 py-1.5 text-xs font-medium text-amber-950 transition hover:bg-white dark:border-amber-700/60 dark:bg-amber-900/40 dark:text-amber-50 dark:hover:bg-amber-900/70"
					onclick={() => onretry?.()}
				>
					<RefreshCw class="h-3.5 w-3.5" strokeWidth={2} />
					{retryLabel}
				</button>
			{/if}
		</div>
	</div>
{:else if reconnectedFlash}
	<div
		class={[
			'w-full border-b border-emerald-200/80 bg-emerald-50 text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-50',
			sticky && 'sticky top-0 z-50 backdrop-blur-md',
			className
		]}
		role="status"
		aria-live="polite"
	>
		<div class="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-2.5 sm:px-6">
			<span
				class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
			>
				<Wifi class="h-4 w-4" strokeWidth={2} />
			</span>
			<div class="min-w-0">
				<p class="truncate text-sm font-semibold tracking-tight">{reconnectedTitle}</p>
				<p class="truncate text-xs text-emerald-900/70 dark:text-emerald-100/65">
					{reconnectedDescription}
				</p>
			</div>
		</div>
	</div>
{/if}
