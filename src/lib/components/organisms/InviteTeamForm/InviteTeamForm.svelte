<script lang="ts">
	import TagInput from '$lib/components/molecules/TagInput/TagInput.svelte';
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import AvatarGroup from '$lib/components/molecules/AvatarGroup/AvatarGroup.svelte';
	import type { AvatarGroupItem } from '$lib/components/molecules/AvatarGroup/AvatarGroup.svelte';
	import CopyButton from '$lib/components/molecules/CopyButton/CopyButton.svelte';
	import Textarea from '$lib/components/atoms/Textarea/Textarea.svelte';
	import Label from '$lib/components/atoms/Label/Label.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Check from '@lucide/svelte/icons/check';
	import Users from '@lucide/svelte/icons/users';
	import Link2 from '@lucide/svelte/icons/link-2';
	import Mail from '@lucide/svelte/icons/mail';

	export interface InviteRoleOption {
		value: string;
		label: string;
		description?: string;
	}

	export interface InviteTeamPayload {
		emails: string[];
		role: string;
		message?: string;
	}

	interface InviteTeamFormProps {
		title?: string;
		subtitle?: string;
		roles?: InviteRoleOption[];
		defaultRole?: string;
		/** Existing members preview */
		members?: AvatarGroupItem[];
		inviteLink?: string;
		/** Show optional personal note */
		showMessage?: boolean;
		loading?: boolean;
		success?: boolean;
		successTitle?: string;
		successMessage?: string;
		maxInvites?: number;
		class?: string;
		onsubmit?: (payload: InviteTeamPayload) => void | Promise<void>;
		onreset?: () => void;
	}

	const DEFAULT_ROLES: InviteRoleOption[] = [
		{ value: 'admin', label: 'Admin', description: 'Full access to settings and billing' },
		{ value: 'member', label: 'Member', description: 'Can create and edit workspace content' },
		{ value: 'viewer', label: 'Viewer', description: 'Read-only access' }
	];

	const DEFAULT_MEMBERS: AvatarGroupItem[] = [
		{ id: '1', name: 'Ada', src: 'https://i.pravatar.cc/40?img=5' },
		{ id: '2', name: 'Alan', src: 'https://i.pravatar.cc/40?img=12' },
		{ id: '3', name: 'Grace', src: 'https://i.pravatar.cc/40?img=32' },
		{ id: '4', name: 'Lin', src: 'https://i.pravatar.cc/40?img=48' }
	];

	let {
		title = 'Invite teammates',
		subtitle = 'Send invites by email. People can join as soon as they accept.',
		roles = DEFAULT_ROLES,
		defaultRole = 'member',
		members = DEFAULT_MEMBERS,
		inviteLink = 'https://app.example.com/invite/acme-7f3k',
		showMessage = true,
		loading = false,
		success = $bindable(false),
		successTitle = 'Invites sent',
		successMessage = 'We emailed everyone on the list. Pending invites expire in 7 days.',
		maxInvites = 20,
		class: className = '',
		onsubmit,
		onreset
	}: InviteTeamFormProps = $props();

	let emails = $state<string[]>([]);
	let role = $state(defaultRole);
	let message = $state('');
	let submitted = $state(false);
	let busy = $state(false);
	let emailsError = $state('');
	let lastSent = $state(0);

	const isBusy = $derived(loading || busy);
	const roleMeta = $derived(roles.find((r) => r.value === role));
	const validCount = $derived(emails.filter(isEmail).length);
	const invalidEmails = $derived(emails.filter((e) => !isEmail(e)));

	function isEmail(value: string) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
	}

	function normalizeEmails(list: string[]) {
		const seen = new Set<string>();
		const out: string[] = [];
		for (const raw of list) {
			const email = raw.trim().toLowerCase();
			if (!email || seen.has(email)) continue;
			seen.add(email);
			out.push(email);
		}
		return out;
	}

	function onEmailsChange(next: string[]) {
		emails = normalizeEmails(next);
		if (submitted) validateEmails();
	}

	function validateEmails() {
		if (!emails.length) {
			emailsError = 'Add at least one email';
			return false;
		}
		if (invalidEmails.length) {
			emailsError = `Invalid: ${invalidEmails.join(', ')}`;
			return false;
		}
		if (emails.length > maxInvites) {
			emailsError = `You can invite up to ${maxInvites} people at once`;
			return false;
		}
		emailsError = '';
		return true;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		submitted = true;
		if (!validateEmails() || isBusy) return;

		const payload: InviteTeamPayload = {
			emails: [...emails],
			role,
			message: message.trim() || undefined
		};

		busy = true;
		try {
			await onsubmit?.(payload);
			lastSent = emails.length;
			success = true;
		} finally {
			busy = false;
		}
	}

	function resetForm() {
		emails = [];
		role = defaultRole;
		message = '';
		submitted = false;
		emailsError = '';
		success = false;
		lastSent = 0;
		onreset?.();
	}
</script>

<div
	class={[
		'w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-surface-elevated shadow-sm',
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
				<p class="text-sm leading-relaxed text-muted">
					{successMessage}
					{#if lastSent}
						<span class="block pt-1 font-medium text-secondary"
							>{lastSent} invite{lastSent === 1 ? '' : 's'} sent as {roleMeta?.label ?? role}.</span
						>
					{/if}
				</p>
			</div>
			<Button variant="secondary" size="sm" onclick={resetForm}>Invite more people</Button>
		</div>
	{:else}
		<form class="space-y-5 p-6 sm:p-7" onsubmit={handleSubmit} novalidate>
			<header class="space-y-3">
				<div class="flex items-start gap-3">
					<span
						class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400"
					>
						<Users class="h-5 w-5" strokeWidth={2} />
					</span>
					<div class="min-w-0 space-y-1">
						<div class="flex flex-wrap items-center gap-2">
							<p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Team</p>
							<Badge size="sm" variant="secondary">Invite</Badge>
						</div>
						<h2 class="text-xl font-semibold tracking-tight text-primary">{title}</h2>
						{#if subtitle}
							<p class="text-sm leading-relaxed text-muted">{subtitle}</p>
						{/if}
					</div>
				</div>
			</header>

			<div class="space-y-4">
				<div class="space-y-1.5">
					<div class="flex items-center justify-between gap-2">
						<Label required>Email addresses</Label>
						{#if validCount}
							<span class="text-[11px] text-muted">{validCount} ready</span>
						{/if}
					</div>
					<TagInput
						bind:value={emails}
						placeholder="name@company.com"
						disabled={isBusy}
						max={maxInvites}
						onchange={onEmailsChange}
					/>
					<p class="text-[11px] text-muted">
						Press Enter or comma to add. You can paste several emails at once.
					</p>
					{#if emailsError}
						<p class="text-xs text-red-600 dark:text-red-400">{emailsError}</p>
					{/if}
				</div>

				<div class="space-y-1.5">
					<Select
						label="Role"
						bind:value={role}
						options={roles.map((r) => ({ value: r.value, label: r.label }))}
						disabled={isBusy}
					/>
					{#if roleMeta?.description}
						<p class="text-[11px] text-muted">{roleMeta.description}</p>
					{/if}
				</div>

				{#if showMessage}
					<div class="space-y-1.5">
						<Label optional>Personal message</Label>
						<Textarea
							bind:value={message}
							rows={3}
							placeholder="Hey — join us on the workspace…"
							disabled={isBusy}
						/>
					</div>
				{/if}

				{#if inviteLink}
					<div
						class="flex flex-col gap-2 rounded-xl border border-dashed border-border bg-surface/50 p-3 sm:flex-row sm:items-center"
					>
						<div class="flex min-w-0 flex-1 items-start gap-2">
							<span class="mt-0.5 text-muted">
								<Link2 class="h-4 w-4" strokeWidth={2} />
							</span>
							<div class="min-w-0">
								<p class="text-xs font-medium text-primary">Or share an invite link</p>
								<p class="truncate font-mono text-[11px] text-muted">{inviteLink}</p>
							</div>
						</div>
						<CopyButton value={inviteLink} label="Copy link" size="sm" variant="secondary" />
					</div>
				{/if}

				{#if members.length}
					<div
						class="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-overlay/40 px-3 py-2.5"
					>
						<div class="min-w-0">
							<p class="text-xs font-medium text-primary">Already on the workspace</p>
							<p class="text-[11px] text-muted">{members.length}+ teammates</p>
						</div>
						<AvatarGroup items={members} max={4} size="sm" />
					</div>
				{/if}
			</div>

			<div class="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
				<p class="flex items-center gap-1.5 text-[11px] text-muted">
					<Mail class="h-3.5 w-3.5" strokeWidth={2} />
					Invites expire in 7 days
				</p>
				<Button type="submit" variant="primary" loading={isBusy} disabled={isBusy}>
					{validCount > 1 ? `Send ${validCount} invites` : 'Send invites'}
				</Button>
			</div>
		</form>
	{/if}
</div>
