<script lang="ts">
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import Textarea from '$lib/components/atoms/Textarea/Textarea.svelte';
	import Label from '$lib/components/atoms/Label/Label.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Chip from '$lib/components/atoms/Chip/Chip.svelte';
	import Check from '@lucide/svelte/icons/check';

	export interface ContactTopic {
		id: string;
		label: string;
	}

	export interface ContactFormPayload {
		name: string;
		email: string;
		topic: string;
		message: string;
	}

	interface ContactFormProps {
		title?: string;
		subtitle?: string;
		topics?: ContactTopic[];
		/** Pre-selected topic id */
		defaultTopic?: string;
		submitLabel?: string;
		loading?: boolean;
		/** Controlled success banner (or use after submit) */
		success?: boolean;
		successTitle?: string;
		successMessage?: string;
		class?: string;
		onsubmit?: (payload: ContactFormPayload) => void | Promise<void>;
		onreset?: () => void;
	}

	const DEFAULT_TOPICS: ContactTopic[] = [
		{ id: 'sales', label: 'Sales' },
		{ id: 'support', label: 'Support' },
		{ id: 'partnership', label: 'Partnership' },
		{ id: 'other', label: 'Other' }
	];

	let {
		title = 'Contact us',
		subtitle = 'Tell us how we can help — we usually reply within one business day.',
		topics = DEFAULT_TOPICS,
		defaultTopic = 'sales',
		submitLabel = 'Send message',
		loading = false,
		success = $bindable(false),
		successTitle = 'Message sent',
		successMessage = 'Thanks — we’ll get back to you within one business day.',
		class: className = '',
		onsubmit,
		onreset
	}: ContactFormProps = $props();

	let name = $state('');
	let email = $state('');
	let topic = $state(defaultTopic);
	let message = $state('');
	let submitted = $state(false);
	let busy = $state(false);

	let nameError = $state('');
	let emailError = $state('');
	let topicError = $state('');
	let messageError = $state('');

	const isBusy = $derived(loading || busy);

	function validateEmail(value: string) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
	}

	function validate() {
		nameError = name.trim() ? '' : 'Name is required';
		emailError = !email.trim()
			? 'Email is required'
			: validateEmail(email.trim())
				? ''
				: 'Enter a valid email';
		topicError = topic ? '' : 'Pick a topic';
		messageError = message.trim() ? '' : 'Message is required';
		return !nameError && !emailError && !topicError && !messageError;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		submitted = true;
		if (!validate() || isBusy) return;

		const payload: ContactFormPayload = {
			name: name.trim(),
			email: email.trim(),
			topic,
			message: message.trim()
		};

		busy = true;
		try {
			await onsubmit?.(payload);
			success = true;
		} finally {
			busy = false;
		}
	}

	function resetForm() {
		name = '';
		email = '';
		topic = defaultTopic;
		message = '';
		submitted = false;
		nameError = '';
		emailError = '';
		topicError = '';
		messageError = '';
		success = false;
		onreset?.();
	}

	$effect(() => {
		if (!submitted) return;
		if (name.trim()) nameError = '';
	});
	$effect(() => {
		if (!submitted) return;
		if (email.trim() && validateEmail(email.trim())) emailError = '';
	});
	$effect(() => {
		if (!submitted) return;
		if (topic) topicError = '';
	});
	$effect(() => {
		if (!submitted) return;
		if (message.trim()) messageError = '';
	});
</script>

<div
	class={[
		'w-full max-w-lg overflow-hidden rounded-3xl border border-brand-500/20 bg-surface-elevated shadow-sm',
		'dark:border-border',
		className
	]}
>
	{#if success}
		<div class="flex flex-col items-center gap-3 px-6 py-10 text-center sm:px-8">
			<span
				class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
			>
				<Check class="h-6 w-6" strokeWidth={2.5} />
			</span>
			<div class="space-y-1">
				<h2 class="text-xl font-semibold tracking-tight text-primary">{successTitle}</h2>
				<p class="text-sm leading-relaxed text-muted">{successMessage}</p>
			</div>
			<Button variant="secondary" size="sm" onclick={resetForm}>Send another message</Button>
		</div>
	{:else}
		<form class="space-y-5 p-6 sm:p-7" onsubmit={handleSubmit} novalidate>
			<header class="space-y-1.5">
				<h2 class="text-xl font-semibold tracking-tight text-primary">{title}</h2>
				{#if subtitle}
					<p class="text-sm leading-relaxed text-muted">{subtitle}</p>
				{/if}
			</header>

			<div class="space-y-4">
				<div class="space-y-3">
					<p class="text-xs font-semibold text-primary">Your details</p>
					<div class="grid gap-3 sm:grid-cols-2">
						<FormField
							label="Name"
							bind:value={name}
							required
							placeholder="Alex Rivera"
							errorMessage={nameError}
							disabled={isBusy}
						/>
						<FormField
							label="Email"
							type="email"
							bind:value={email}
							required
							placeholder="you@company.com"
							errorMessage={emailError}
							disabled={isBusy}
						/>
					</div>
				</div>

				<div class="space-y-2">
					<Label>Topic</Label>
					<div class="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Topic">
						{#each topics as opt (opt.id)}
							<Chip
								size="md"
								selected={topic === opt.id}
								disabled={isBusy}
								onclick={() => (topic = opt.id)}
							>
								{opt.label}
							</Chip>
						{/each}
					</div>
					{#if topicError}
						<p class="text-xs text-red-600 dark:text-red-400">{topicError}</p>
					{/if}
				</div>

				<div class="space-y-1.5">
					<Label required>Message</Label>
					<Textarea
						bind:value={message}
						rows={5}
						placeholder="How can we help?"
						required
						disabled={isBusy}
						status={messageError ? 'error' : 'default'}
						helperText={messageError || undefined}
					/>
				</div>
			</div>

			<div class="flex justify-end pt-1">
				<Button type="submit" variant="primary" size="md" loading={isBusy} disabled={isBusy}>
					{submitLabel}
				</Button>
			</div>
		</form>
	{/if}
</div>
