<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Download from '@lucide/svelte/icons/download';
	import Check from '@lucide/svelte/icons/check';
	import CircleAlert from '@lucide/svelte/icons/circle-alert';

	export type DownloadStatus = 'idle' | 'loading' | 'done' | 'error';
	export type DownloadResult = void | Blob | File | string | ArrayBuffer | Response;

	interface DownloadButtonProps {
		/** Direct URL (uses native `<a download>` when no async handler). */
		href?: string;
		/** Suggested filename for downloads. */
		filename?: string;
		label?: string;
		loadingLabel?: string;
		doneLabel?: string;
		errorLabel?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
		disabled?: boolean;
		/** Controlled loading (also set automatically in async mode). */
		loading?: boolean;
		/** Bindable status for external UI. */
		status?: DownloadStatus;
		fullWidth?: boolean;
		showIcon?: boolean;
		iconOnly?: boolean;
		/** How long to show the success state (ms). 0 = keep done. */
		doneDuration?: number;
		/** Optional MIME when downloading ArrayBuffer / constructing Blob. */
		mimeType?: string;
		/** Open `href` in a new tab instead of downloading. */
		openInNewTab?: boolean;
		class?: string;
		/**
		 * Async / programmatic download. May return:
		 * - `void` (you handle the download yourself)
		 * - `Blob` | `File` | `ArrayBuffer` | data URL / object URL string
		 * - `Response` (body is consumed as blob)
		 * - `Promise` of any of the above
		 */
		ondownload?: () => DownloadResult | Promise<DownloadResult>;
		/** Fired when a download finishes successfully. */
		onsuccess?: (filename?: string) => void;
		/** Fired when async download fails. */
		onerror?: (error: unknown) => void;
		/** Legacy click hook (still called for link mode). */
		onclick?: () => void;
	}

	let {
		href,
		filename = 'download',
		label = 'Download',
		loadingLabel = 'Downloading…',
		doneLabel = 'Downloaded',
		errorLabel = 'Failed',
		size = 'sm',
		variant = 'secondary',
		disabled = false,
		loading = false,
		status = $bindable<DownloadStatus>('idle'),
		fullWidth = false,
		showIcon = true,
		iconOnly = false,
		doneDuration = 1800,
		mimeType,
		openInNewTab = false,
		class: className = '',
		ondownload,
		onsuccess,
		onerror,
		onclick
	}: DownloadButtonProps = $props();

	let busy = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	const isLoading = $derived(loading || busy || status === 'loading');
	const isDisabled = $derived(disabled || isLoading);
	const currentLabel = $derived(
		status === 'loading' || isLoading
			? loadingLabel
			: status === 'done'
				? doneLabel
				: status === 'error'
					? errorLabel
					: label
	);

	const iconClass = $derived(
		size === 'xs' ? 'h-3 w-3' : size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' || size === 'xl' ? 'h-5 w-5' : 'h-4 w-4'
	);

	function setStatus(next: DownloadStatus) {
		status = next;
		clearTimeout(timer);
		if (next === 'done' && doneDuration > 0) {
			timer = setTimeout(() => {
				if (status === 'done') status = 'idle';
			}, doneDuration);
		}
		if (next === 'error' && doneDuration > 0) {
			timer = setTimeout(() => {
				if (status === 'error') status = 'idle';
			}, doneDuration);
		}
	}

	function triggerBlobDownload(data: Blob | File | ArrayBuffer | string, name: string) {
		let blob: Blob;
		let objectUrl: string | undefined;

		if (typeof data === 'string') {
			if (data.startsWith('blob:') || data.startsWith('data:')) {
				objectUrl = data;
			} else {
				blob = new Blob([data], { type: mimeType ?? 'text/plain;charset=utf-8' });
				objectUrl = URL.createObjectURL(blob);
			}
		} else if (data instanceof ArrayBuffer) {
			blob = new Blob([data], { type: mimeType ?? 'application/octet-stream' });
			objectUrl = URL.createObjectURL(blob);
		} else {
			blob = data;
			objectUrl = URL.createObjectURL(blob);
		}

		const a = document.createElement('a');
		a.href = objectUrl;
		a.download = name;
		a.rel = 'noopener';
		document.body.appendChild(a);
		a.click();
		a.remove();

		if (!(typeof data === 'string' && data.startsWith('data:'))) {
			// Revoke object URLs we created (keep caller-owned blob: URLs briefly).
			const url = objectUrl;
			setTimeout(() => URL.revokeObjectURL(url), 1500);
		}
	}

	async function resolveDownload(result: DownloadResult) {
		if (result == null) return;
		if (result instanceof Response) {
			if (!result.ok) throw new Error(`Download failed (${result.status})`);
			const blob = await result.blob();
			const headerName = result.headers.get('content-disposition')?.match(/filename="?([^"]+)"?/i)?.[1];
			triggerBlobDownload(blob, headerName ?? filename);
			return;
		}
		triggerBlobDownload(result, filename);
	}

	async function runAsync() {
		if (!ondownload || isDisabled) return;
		busy = true;
		setStatus('loading');
		try {
			const result = await ondownload();
			await resolveDownload(result);
			setStatus('done');
			onsuccess?.(filename);
		} catch (err) {
			setStatus('error');
			onerror?.(err);
		} finally {
			busy = false;
		}
	}

	function handleLinkClick(e: MouseEvent) {
		if (isDisabled) {
			e.preventDefault();
			return;
		}
		if (ondownload) {
			e.preventDefault();
			void runAsync();
			return;
		}
		onclick?.();
		setStatus('done');
		onsuccess?.(filename);
	}

	function handleButtonClick() {
		if (isDisabled) return;
		onclick?.();
		if (ondownload) {
			void runAsync();
			return;
		}
		setStatus('done');
		onsuccess?.(filename);
	}
</script>

{#if href && !ondownload}
	<a
		{href}
		download={openInNewTab ? undefined : filename}
		target={openInNewTab ? '_blank' : undefined}
		rel={openInNewTab ? 'noopener noreferrer' : undefined}
		class={['inline-flex no-underline', fullWidth && 'w-full']}
		aria-disabled={isDisabled}
		onclick={handleLinkClick}
	>
		<Button
			{variant}
			{size}
			disabled={isDisabled}
			loading={isLoading}
			{fullWidth}
			class={className}
			type="button"
			aria-label={iconOnly ? currentLabel : undefined}
		>
			{#if showIcon}
				{#if status === 'done'}
					<Check class={iconClass} aria-hidden="true" />
				{:else if status === 'error'}
					<CircleAlert class={iconClass} aria-hidden="true" />
				{:else if !isLoading}
					<Download class={iconClass} aria-hidden="true" />
				{/if}
			{/if}
			{#if !iconOnly}
				{currentLabel}
			{/if}
		</Button>
	</a>
{:else}
	<Button
		{variant}
		{size}
		disabled={isDisabled}
		loading={isLoading}
		{fullWidth}
		class={className}
		onclick={handleButtonClick}
		aria-label={iconOnly ? currentLabel : undefined}
	>
		{#if showIcon}
			{#if status === 'done'}
				<Check class={iconClass} aria-hidden="true" />
			{:else if status === 'error'}
				<CircleAlert class={iconClass} aria-hidden="true" />
			{:else if !isLoading}
				<Download class={iconClass} aria-hidden="true" />
			{/if}
		{/if}
		{#if !iconOnly}
			{currentLabel}
		{/if}
	</Button>
{/if}
