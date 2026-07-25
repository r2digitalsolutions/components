<script module lang="ts">
	export type NewsletterVariant = 'card' | 'inline' | 'stacked' | 'minimal' | 'banner';
	export type NewsletterSize = 'sm' | 'md' | 'lg';
</script>

<script lang="ts">
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	interface NewsletterSignupProps {
		title?: string;
		description?: string;
		placeholder?: string;
		buttonLabel?: string;
		showName?: boolean;
		namePlaceholder?: string;
		name?: string;
		email?: string;
		variant?: NewsletterVariant;
		size?: NewsletterSize;
		loading?: boolean;
		success?: boolean;
		error?: string;
		successTitle?: string;
		successMessage?: string;
		privacyNote?: string;
		requireConsent?: boolean;
		consentLabel?: string;
		consent?: boolean;
		socialProof?: string;
		disabled?: boolean;
		class?: string;
		onsubmit?: (payload: { email: string; name?: string; consent: boolean }) => void;
	}

	let {
		title = 'Stay in the loop',
		description = 'Product updates, no spam.',
		placeholder = 'you@company.com',
		buttonLabel = 'Subscribe',
		showName = false,
		namePlaceholder = 'Your name',
		name = $bindable(''),
		email = $bindable(''),
		variant = 'card',
		size = 'md',
		loading = false,
		success = false,
		error = '',
		successTitle = "You're subscribed",
		successMessage = 'Check your inbox to confirm.',
		privacyNote = 'Unsubscribe anytime. No spam.',
		requireConsent = false,
		consentLabel = 'I agree to receive email updates',
		consent = $bindable(false),
		socialProof,
		disabled = false,
		class: className = '',
		onsubmit
	}: NewsletterSignupProps = $props();

	const emailOk = $derived(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()));
	const canSubmit = $derived(
		emailOk &&
			!loading &&
			!disabled &&
			(!requireConsent || consent) &&
			(!showName || name.trim().length > 0)
	);

	const pad = $derived(
		variant === 'minimal'
			? 'p-0'
			: variant === 'banner'
				? size === 'sm'
					? 'px-4 py-3'
					: 'px-5 py-4'
				: size === 'sm'
					? 'p-4'
					: size === 'lg'
						? 'p-6'
						: 'p-5'
	);

	const shell = $derived(
		variant === 'minimal'
			? ''
			: variant === 'banner'
				? 'rounded-2xl border border-border bg-gradient-to-br from-brand-500/10 via-surface-elevated to-surface-elevated'
				: 'rounded-xl border border-border bg-surface-elevated'
	);

	const titleClass = $derived(size === 'lg' ? 'text-lg' : 'text-sm');
	const btnSize = $derived(size === 'lg' ? 'md' : 'sm');

	function submit(e: Event) {
		e.preventDefault();
		if (!canSubmit) return;
		onsubmit?.({
			email: email.trim(),
			name: showName ? name.trim() : undefined,
			consent: requireConsent ? consent : true
		});
	}
</script>

{#snippet consentField()}
	{#if requireConsent}
		<label class="flex items-start gap-2 text-xs text-secondary">
			<input
				type="checkbox"
				class="mt-0.5 rounded border-border accent-brand-500"
				bind:checked={consent}
				disabled={disabled || loading}
			/>
			<span>{consentLabel}</span>
		</label>
	{/if}
{/snippet}

<div class={[shell, pad, className]}>
	{#if success}
		<div class="space-y-1">
			<p class={['font-semibold text-primary', titleClass]}>{successTitle}</p>
			<Text size="xs" tone="muted">{successMessage}</Text>
		</div>
	{:else if variant === 'inline'}
		<form class="flex flex-col gap-3 sm:flex-row sm:items-end" onsubmit={submit}>
			<div class="min-w-0 sm:w-44 sm:shrink-0">
				<p class={['font-semibold text-primary', titleClass]}>{title}</p>
				{#if description}
					<Text size="xs" tone="muted" class="mt-1">{description}</Text>
				{/if}
				{#if socialProof}
					<p class="mt-1 text-[11px] font-medium text-brand-600 dark:text-brand-400">
						{socialProof}
					</p>
				{/if}
			</div>
			<div class="min-w-0 flex-1 space-y-2">
				{#if showName}
					<Input
						size={btnSize}
						bind:value={name}
						placeholder={namePlaceholder}
						disabled={disabled || loading}
					/>
				{/if}
				<Input
					type="email"
					size={btnSize}
					bind:value={email}
					{placeholder}
					required
					disabled={disabled || loading}
					status={error ? 'error' : 'default'}
					helperText={error || undefined}
				/>
				{@render consentField()}
			</div>
			<Button type="submit" size={btnSize} {loading} disabled={!canSubmit} class="sm:shrink-0">
				{buttonLabel}
			</Button>
		</form>
		{#if privacyNote}
			<p class="mt-2 text-[11px] text-muted">{privacyNote}</p>
		{/if}
	{:else}
		{#if variant !== 'minimal'}
			<div class="mb-1">
				<p class={['font-semibold text-primary', titleClass]}>{title}</p>
				{#if description}
					<Text size="xs" tone="muted" class="mt-1">{description}</Text>
				{/if}
				{#if socialProof}
					<p class="mt-1.5 text-[11px] font-medium text-brand-600 dark:text-brand-400">
						{socialProof}
					</p>
				{/if}
			</div>
		{/if}

		<form class="mt-3 space-y-2" onsubmit={submit}>
			{#if showName}
				<Input
					size={btnSize}
					bind:value={name}
					placeholder={namePlaceholder}
					disabled={disabled || loading}
					label={variant === 'minimal' ? undefined : 'Name'}
				/>
			{/if}

			<div
				class={[
					'flex flex-col gap-2',
					variant !== 'stacked' && 'sm:flex-row'
				]}
			>
				<Input
					type="email"
					size={btnSize}
					bind:value={email}
					{placeholder}
					required
					disabled={disabled || loading}
					class="flex-1"
					status={error ? 'error' : 'default'}
					helperText={error || undefined}
				/>
				<Button type="submit" size={btnSize} {loading} disabled={!canSubmit}>
					{buttonLabel}
				</Button>
			</div>

			{@render consentField()}

			{#if privacyNote && variant !== 'minimal'}
				<p class="text-[11px] text-muted">{privacyNote}</p>
			{/if}
		</form>
	{/if}
</div>
