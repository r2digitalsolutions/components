<script lang="ts">
	import NewsletterSignup, {
		type NewsletterSize,
		type NewsletterVariant
	} from './NewsletterSignup.svelte';

	type Example = 'card' | 'inline' | 'stacked' | 'banner' | 'minimal' | 'consent' | 'error' | 'success';

	let props = $props<{
		example?: Example;
		title?: string;
		description?: string;
		variant?: NewsletterVariant;
		size?: NewsletterSize;
		showName?: boolean;
		requireConsent?: boolean;
		socialProof?: string;
		privacyNote?: string;
		buttonLabel?: string;
		loading?: boolean;
	}>();

	let email = $state('');
	let name = $state('');
	let consent = $state(false);
	let success = $state(false);
	let loading = $state(false);
	let error = $state('');
	let last = $state('—');

	const example = $derived(props.example ?? 'card');

	async function fakeSubmit(payload: { email: string; name?: string; consent: boolean }) {
		last = payload.email;
		error = '';
		loading = true;
		await new Promise((r) => setTimeout(r, 700));
		loading = false;
		if (example === 'error') {
			error = 'This email looks invalid or is already subscribed.';
			return;
		}
		success = true;
	}

	$effect(() => {
		if (example === 'success') success = true;
		else if (example !== 'error') {
			// reset when switching away from success demo via controls
		}
	});
</script>

<div class="w-full max-w-xl space-y-2">
	<p class="text-xs text-secondary">
		Last submit: <span class="font-medium text-primary">{last}</span>
	</p>

	{#if example === 'success'}
		<NewsletterSignup
			success
			successTitle="Welcome aboard"
			successMessage="We sent a confirmation link to your inbox."
			variant={props.variant ?? 'card'}
			size={props.size ?? 'md'}
		/>
	{:else if example === 'error'}
		<NewsletterSignup
			bind:email
			bind:name
			title={props.title ?? 'Join the newsletter'}
			description={props.description ?? 'Try submitting to see the error state.'}
			variant={props.variant ?? 'card'}
			size={props.size ?? 'md'}
			showName={props.showName ?? false}
			{error}
			loading={loading || (props.loading ?? false)}
			socialProof={props.socialProof}
			privacyNote={props.privacyNote ?? 'Unsubscribe anytime.'}
			buttonLabel={props.buttonLabel ?? 'Subscribe'}
			onsubmit={fakeSubmit}
		/>
	{:else if example === 'inline'}
		<NewsletterSignup
			bind:email
			title={props.title ?? 'Weekly digest'}
			description={props.description ?? 'One email, every Monday.'}
			variant="inline"
			size={props.size ?? 'md'}
			showName={props.showName ?? false}
			socialProof={props.socialProof ?? '12.4k subscribers'}
			privacyNote={props.privacyNote ?? 'No spam. Unsubscribe anytime.'}
			buttonLabel={props.buttonLabel ?? 'Join'}
			loading={loading || (props.loading ?? false)}
			{success}
			onsubmit={fakeSubmit}
		/>
	{:else if example === 'stacked'}
		<NewsletterSignup
			bind:email
			bind:name
			title={props.title ?? 'Developer updates'}
			description={props.description ?? 'Release notes and deep dives.'}
			variant="stacked"
			size={props.size ?? 'md'}
			showName={true}
			buttonLabel={props.buttonLabel ?? 'Subscribe'}
			privacyNote={props.privacyNote}
			loading={loading || (props.loading ?? false)}
			{success}
			onsubmit={fakeSubmit}
		/>
	{:else if example === 'banner'}
		<NewsletterSignup
			bind:email
			title={props.title ?? 'Ship faster with us'}
			description={props.description ?? 'Tips, templates, and early access.'}
			variant="banner"
			size={props.size ?? 'lg'}
			socialProof={props.socialProof ?? 'Loved by 8k teams'}
			buttonLabel={props.buttonLabel ?? 'Get updates'}
			privacyNote={props.privacyNote ?? 'We respect your inbox.'}
			loading={loading || (props.loading ?? false)}
			{success}
			onsubmit={fakeSubmit}
		/>
	{:else if example === 'minimal'}
		<NewsletterSignup
			bind:email
			variant="minimal"
			size={props.size ?? 'sm'}
			placeholder="Email address"
			buttonLabel={props.buttonLabel ?? 'Notify me'}
			loading={loading || (props.loading ?? false)}
			{success}
			onsubmit={fakeSubmit}
		/>
	{:else if example === 'consent'}
		<NewsletterSignup
			bind:email
			bind:consent
			title={props.title ?? 'Product newsletter'}
			description={props.description ?? 'Requires explicit consent.'}
			variant={props.variant ?? 'card'}
			size={props.size ?? 'md'}
			requireConsent={true}
			consentLabel="I agree to receive marketing emails"
			privacyNote={props.privacyNote ?? 'You can withdraw consent anytime.'}
			buttonLabel={props.buttonLabel ?? 'Subscribe'}
			loading={loading || (props.loading ?? false)}
			{success}
			onsubmit={fakeSubmit}
		/>
	{:else}
		<NewsletterSignup
			bind:email
			bind:name
			title={props.title ?? 'Stay in the loop'}
			description={props.description ?? 'Product updates, no spam.'}
			variant={props.variant ?? 'card'}
			size={props.size ?? 'md'}
			showName={props.showName ?? false}
			requireConsent={props.requireConsent ?? false}
			bind:consent
			socialProof={props.socialProof}
			privacyNote={props.privacyNote ?? 'Unsubscribe anytime. No spam.'}
			buttonLabel={props.buttonLabel ?? 'Subscribe'}
			loading={loading || (props.loading ?? false)}
			{success}
			onsubmit={fakeSubmit}
		/>
	{/if}
</div>
