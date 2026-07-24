<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	type DialogSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
	type DialogTone = 'default' | 'info' | 'success' | 'warning' | 'danger';
	type FooterAlign = 'start' | 'center' | 'end' | 'between';
	type DialogPosition = 'center' | 'top';

	interface DialogProps {
		id?: string;
		open?: boolean;
		title?: string;
		description?: string;
		size?: DialogSize;
		tone?: DialogTone;
		position?: DialogPosition;
		closeOnBackdrop?: boolean;
		closeOnEscape?: boolean;
		closeOnConfirm?: boolean;
		showClose?: boolean;
		showCancel?: boolean;
		showConfirm?: boolean;
		cancelLabel?: string;
		confirmLabel?: string;
		confirmVariant?: 'primary' | 'secondary' | 'destructive';
		confirmLoading?: boolean;
		confirmDisabled?: boolean;
		hideFooter?: boolean;
		footerAlign?: FooterAlign;
		scrollable?: boolean;
		blurBackdrop?: boolean;
		class?: string;
		children?: Snippet;
		header?: Snippet;
		footer?: Snippet;
		onclose?: () => void;
		onconfirm?: () => void;
		oncancel?: () => void;
	}

	let {
		id = `dialog-${Math.random().toString(36).slice(2, 9)}`,
		open = $bindable(false),
		title,
		description,
		size = 'md',
		tone = 'default',
		position = 'center',
		closeOnBackdrop = true,
		closeOnEscape = true,
		closeOnConfirm = true,
		showClose = true,
		showCancel = true,
		showConfirm = true,
		cancelLabel = 'Cancel',
		confirmLabel = 'Confirm',
		confirmVariant = 'primary',
		confirmLoading = false,
		confirmDisabled = false,
		hideFooter = false,
		footerAlign = 'end',
		scrollable = true,
		blurBackdrop = true,
		class: className = '',
		children,
		header,
		footer,
		onclose,
		onconfirm,
		oncancel
	}: DialogProps = $props();

	let dialogEl = $state<HTMLDialogElement | null>(null);
	const titleId = $derived(`${id}-title`);
	const descriptionId = $derived(`${id}-description`);

	const sizeClasses: Record<DialogSize, string> = {
		xs: 'max-w-xs',
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-2xl',
		full: 'max-w-[min(96rem,calc(100%-2rem))]'
	};

	const footerAlignClasses: Record<FooterAlign, string> = {
		start: 'justify-start',
		center: 'justify-center',
		end: 'justify-end',
		between: 'justify-between'
	};

	const toneIcon: Record<Exclude<DialogTone, 'default'>, { className: string; path: string }> = {
		info: {
			className: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
			path: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
		},
		success: {
			className: 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300',
			path: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
		},
		warning: {
			className: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
			path: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
		},
		danger: {
			className: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300',
			path: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z'
		}
	};

	const resolvedConfirmVariant = $derived(
		confirmVariant === 'primary' && tone === 'danger' ? 'destructive' : confirmVariant
	);

	$effect(() => {
		if (!dialogEl) return;

		if (open && !dialogEl.open) {
			dialogEl.showModal();
		} else if (!open && dialogEl.open) {
			dialogEl.close();
		}
	});

	function close(reason: 'close' | 'cancel' | 'confirm' | 'backdrop' | 'escape' = 'close') {
		if (!open) return;
		open = false;
		if (reason === 'cancel') oncancel?.();
		onclose?.();
	}

	function handleConfirm() {
		if (confirmLoading || confirmDisabled) return;
		onconfirm?.();
		if (closeOnConfirm) close('confirm');
	}

	function handleCancelClick() {
		close('cancel');
	}

	function handleDialogClose() {
		if (open) {
			open = false;
			onclose?.();
		}
	}

	function handleCancelEvent(event: Event) {
		if (!closeOnEscape) {
			event.preventDefault();
			return;
		}
		oncancel?.();
	}

	function handleBackdropClick(event: MouseEvent) {
		if (!dialogEl) return;
		const rect = dialogEl.getBoundingClientRect();
		const clickedInDialog =
			event.clientX >= rect.left &&
			event.clientX <= rect.right &&
			event.clientY >= rect.top &&
			event.clientY <= rect.bottom;

		if (clickedInDialog) return;
		if (!closeOnBackdrop || confirmLoading) return;
		close('backdrop');
	}
</script>

<dialog
	bind:this={dialogEl}
	{id}
	class={[
		'dialog-root',
		sizeClasses[size],
		position === 'top' && 'dialog-top',
		!blurBackdrop && 'dialog-no-blur',
		className
	]}
	aria-labelledby={title ? titleId : undefined}
	aria-describedby={description ? descriptionId : undefined}
	aria-busy={confirmLoading || undefined}
	onclose={handleDialogClose}
	oncancel={handleCancelEvent}
	onclick={handleBackdropClick}
>
	<div class="dialog-panel">
		{#if header}
			<div class="px-5 pt-5 pb-3">
				{@render header()}
			</div>
		{:else if title || showClose || tone !== 'default'}
			<header class="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
				<div class="flex min-w-0 flex-1 items-start gap-3">
					{#if tone !== 'default'}
						<span
							class={[
								'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
								toneIcon[tone].className
							]}
							aria-hidden="true"
						>
							<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
								<path stroke-linecap="round" stroke-linejoin="round" d={toneIcon[tone].path} />
							</svg>
						</span>
					{/if}

					<div class="min-w-0 flex-1">
						{#if title}
							<h2 id={titleId} class="text-base font-semibold text-primary">{title}</h2>
						{/if}
						{#if description}
							<p id={descriptionId} class="mt-1 text-xs leading-relaxed text-secondary">
								{description}
							</p>
						{/if}
					</div>
				</div>

				{#if showClose}
					<button
						type="button"
						onclick={() => close('close')}
						disabled={confirmLoading}
						class="shrink-0 rounded-lg p-1.5 text-secondary transition-colors hover:bg-surface-overlay hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 disabled:opacity-50"
						aria-label="Close dialog"
					>
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				{/if}
			</header>
		{:else if description}
			<p id={descriptionId} class="px-5 pt-5 text-xs leading-relaxed text-secondary">{description}</p>
		{/if}

		{#if children}
			<div
				class={[
					'px-5 py-2 text-sm text-primary',
					scrollable && 'max-h-[min(60vh,28rem)] overflow-y-auto'
				]}
			>
				{@render children()}
			</div>
		{/if}

		{#if !hideFooter}
			<footer class={['flex items-center gap-2 px-5 pt-3 pb-5', footerAlignClasses[footerAlign]]}>
				{#if footer}
					{@render footer()}
				{:else}
					{#if showCancel}
						<Button variant="secondary" size="sm" disabled={confirmLoading} onclick={handleCancelClick}>
							{cancelLabel}
						</Button>
					{/if}
					{#if showConfirm}
						<Button
							variant={resolvedConfirmVariant}
							size="sm"
							loading={confirmLoading}
							disabled={confirmDisabled || confirmLoading}
							onclick={handleConfirm}
						>
							{confirmLabel}
						</Button>
					{/if}
				{/if}
			</footer>
		{/if}
	</div>
</dialog>

<style>
	.dialog-root {
		margin: auto;
		padding: 0;
		border: none;
		border-radius: 0.75rem;
		background: transparent;
		color: inherit;
		width: calc(100% - 2rem);
		max-height: calc(100% - 2rem);
		overflow: visible;
	}

	.dialog-root.dialog-top {
		margin-top: 8vh;
		margin-bottom: auto;
	}

	.dialog-root::backdrop {
		background: oklch(15% 0.02 265 / 0.45);
		backdrop-filter: blur(2px);
	}

	.dialog-root.dialog-no-blur::backdrop {
		backdrop-filter: none;
	}

	:global(.dark) .dialog-root::backdrop {
		background: oklch(0% 0 0 / 0.65);
	}

	.dialog-panel {
		display: flex;
		flex-direction: column;
		border-radius: 0.75rem;
		border: 1px solid var(--border);
		background: var(--surface-elevated);
		box-shadow: var(--shadow-xl);
		overflow: hidden;
		max-height: calc(100vh - 2rem);
	}

	.dialog-root[open] {
		animation: dialog-in 140ms ease-out;
	}

	.dialog-root[open]::backdrop {
		animation: backdrop-in 140ms ease-out;
	}

	@keyframes dialog-in {
		from {
			opacity: 0;
			transform: translateY(6px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes backdrop-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
