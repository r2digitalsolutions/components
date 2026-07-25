<script lang="ts">
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import PinInput from '$lib/components/molecules/PinInput/PinInput.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	interface OtpVerifyProps {
		title?: string;
		subtitle?: string;
		length?: number;
		loading?: boolean;
		resendSeconds?: number;
		class?: string;
		onverify?: (code: string) => void;
		onresend?: () => void;
	}

	let {
		title = 'Enter verification code',
		subtitle = 'We sent a 6-digit code to your email.',
		length = 6,
		loading = false,
		resendSeconds = 30,
		class: className = '',
		onverify,
		onresend
	}: OtpVerifyProps = $props();

	let code = $state('');
	let cooldown = $state(0);

	$effect(() => {
		cooldown = resendSeconds;
	});

	$effect(() => {
		if (cooldown <= 0) return;
		const id = setInterval(() => {
			cooldown = Math.max(0, cooldown - 1);
		}, 1000);
		return () => clearInterval(id);
	});

	function verify(e: Event) {
		e.preventDefault();
		onverify?.(code);
	}

	function resend() {
		if (cooldown > 0) return;
		cooldown = resendSeconds;
		onresend?.();
	}
</script>

<Card class={`w-full max-w-md ${className}`} padding="lg">
	<div class="mb-6 space-y-1 text-center">
		<h1 class="text-xl font-semibold text-primary">{title}</h1>
		<p class="text-sm text-secondary">{subtitle}</p>
	</div>

	<form class="space-y-4" onsubmit={verify}>
		<PinInput bind:value={code} {length} label="Code" oncomplete={(v) => onverify?.(v)} />
		<Button type="submit" fullWidth {loading} disabled={code.length < length}>Verify</Button>
	</form>

	<p class="mt-4 text-center text-xs text-muted">
		Didn't get a code?
		<button
			type="button"
			class="font-medium text-brand-600 hover:underline disabled:opacity-40"
			disabled={cooldown > 0}
			onclick={resend}
		>
			{cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend'}
		</button>
	</p>
</Card>
