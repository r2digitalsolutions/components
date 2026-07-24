<script lang="ts">
	import { themeStore } from '$lib/utils/theme.svelte.js';
	import { toast } from '$lib/components/molecules/Toast/toast.svelte.js';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Textarea from '$lib/components/atoms/Textarea/Textarea.svelte';
	import RadioGroup from '$lib/components/molecules/RadioGroup/RadioGroup.svelte';
	import Slider from '$lib/components/atoms/Slider/Slider.svelte';
	import Skeleton from '$lib/components/atoms/Skeleton/Skeleton.svelte';
	import ProgressBar from '$lib/components/atoms/ProgressBar/ProgressBar.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Spinner from '$lib/components/atoms/Spinner/Spinner.svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';
	import Checkbox from '$lib/components/atoms/Checkbox/Checkbox.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import PinInput from '$lib/components/molecules/PinInput/PinInput.svelte';
	import FileUploader from '$lib/components/molecules/FileUploader/FileUploader.svelte';
	import Alert from '$lib/components/molecules/Alert/Alert.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';

	let loadingBtn = $state(false);
	let inputValue = $state('');
	let textareaValue = $state('');
	let toggleValue = $state(false);
	let checkValue = $state(false);
	let selectedPlan = $state('pro');
	let sliderVal = $state(75);
	let selectedCountry = $state('es');
	let pinVal = $state('');

	function simulateLoad() {
		loadingBtn = true;
		setTimeout(() => {
			loadingBtn = false;
			toast.success('Action completed!', 'Success');
		}, 2000);
	}
</script>

<svelte:head>
	<title>R2DigiSolutions — Component Library</title>
	<meta name="description" content="R2DigiSolutions Svelte 5 component library showcase with light/dark mode support" />
</svelte:head>

<!-- Sticky header -->
<header class="sticky top-0 z-40 border-b border-border bg-surface-elevated/80 backdrop-blur-md">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<div class="flex items-center gap-3">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 shadow-sm">
					<svg class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
					</svg>
				</div>
				<div>
					<span class="font-semibold text-primary text-sm">R2DigiSolutions</span>
					<span class="ml-2 text-xs text-muted">Component Library</span>
				</div>
			</div>

			<div class="flex items-center gap-3">
				<Badge variant="primary" rounded>v0.2.0</Badge>
				<button
					id="theme-toggle"
					type="button"
					onclick={() => themeStore.toggle()}
					class="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-elevated text-secondary hover:text-primary hover:bg-surface-overlay transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
					aria-label="Toggle theme"
				>
					{#if themeStore.isDark}
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="5"/>
							<line x1="12" y1="1" x2="12" y2="3"/>
							<line x1="12" y1="21" x2="12" y2="23"/>
							<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
							<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
							<line x1="1" y1="12" x2="3" y2="12"/>
							<line x1="21" y1="12" x2="23" y2="12"/>
							<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
							<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
						</svg>
					{:else}
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
						</svg>
					{/if}
				</button>
			</div>
		</div>
	</div>
</header>

<main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">

	<!-- Hero -->
	<section class="text-center space-y-4 py-8">
		<div class="inline-flex items-center gap-2 rounded-full border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950 px-3 py-1 text-xs font-medium text-brand-600 dark:text-brand-400">
			<span class="relative flex h-2 w-2">
				<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
				<span class="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
			</span>
			Atomic Design · Svelte 5 · Tailwind 4
		</div>
		<h1 class="text-4xl sm:text-5xl font-bold text-primary tracking-tight">
			Component Library
		</h1>
		<p class="text-lg text-secondary max-w-xl mx-auto leading-relaxed">
			Una librería de componentes reutilizables con soporte completo para <strong class="text-primary">Light & Dark mode</strong>, diseñada para aplicaciones web y móvil.
		</p>
	</section>

	<!-- ── Alerts Section ────────────────────────────────────────────────── -->
	<section class="space-y-4">
		<h3 class="text-xs font-semibold uppercase tracking-widest text-muted">Alert Banners</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<Alert variant="info" title="System Maintenance" message="Scheduled update tonight at 02:00 UTC." dismissible />
			<Alert variant="success" title="Success" message="Your subscription has been updated to Pro." dismissible />
			<Alert variant="warning" title="Warning" message="Storage usage reached 85%." dismissible />
			<Alert variant="error" title="Action Failed" message="Could not connect to service." dismissible />
		</div>
	</section>

	<!-- ── Atoms ─────────────────────────────────────────────────────────── -->
	<section id="atoms" class="space-y-8">
		<div class="flex items-center gap-3">
			<div class="h-px flex-1 bg-border"></div>
			<h2 class="text-xs font-semibold uppercase tracking-widest text-muted">Atoms</h2>
			<div class="h-px flex-1 bg-border"></div>
		</div>

		<!-- Buttons -->
		<Card>
			{#snippet header()}
				<div class="flex items-center justify-between">
					<h3 class="font-semibold text-primary">Button</h3>
					<Badge variant="info" size="sm">atom</Badge>
				</div>
			{/snippet}

			<div class="space-y-6">
				<div>
					<p class="text-xs font-medium text-muted mb-3 uppercase tracking-wide">Variants</p>
					<div class="flex flex-wrap gap-3">
						<Button variant="primary">Primary</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="ghost">Ghost</Button>
						<Button variant="outline">Outline</Button>
						<Button variant="destructive">Destructive</Button>
					</div>
				</div>
				<div>
					<p class="text-xs font-medium text-muted mb-3 uppercase tracking-wide">States</p>
					<div class="flex flex-wrap gap-3">
						<Button loading={loadingBtn} onclick={simulateLoad}>
							{loadingBtn ? 'Loading...' : 'Simulate Load'}
						</Button>
						<Button disabled>Disabled</Button>
					</div>
				</div>
			</div>
		</Card>

		<!-- Slider & ProgressBar -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<Card>
				{#snippet header()}
					<div class="flex items-center justify-between">
						<h3 class="font-semibold text-primary">Slider</h3>
						<Badge variant="info" size="sm">atom</Badge>
					</div>
				{/snippet}
				<div class="space-y-4">
					<Slider label="Volume" bind:value={sliderVal} unit="%" />
					<Slider label="Price Limit" min={10} max={500} value={250} unit="€" />
				</div>
			</Card>

			<Card>
				{#snippet header()}
					<div class="flex items-center justify-between">
						<h3 class="font-semibold text-primary">ProgressBar</h3>
						<Badge variant="info" size="sm">atom</Badge>
					</div>
				{/snippet}
				<div class="space-y-4">
					<ProgressBar label="Storage Used" value={65} showValue />
					<ProgressBar label="Uploading File" variant="success" value={100} showValue />
					<ProgressBar label="Processing Data" indeterminate />
				</div>
			</Card>
		</div>

		<!-- Skeleton Loader -->
		<Card>
			{#snippet header()}
				<div class="flex items-center justify-between">
					<h3 class="font-semibold text-primary">Skeleton Loader</h3>
					<Badge variant="info" size="sm">atom</Badge>
				</div>
			{/snippet}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="space-y-3">
					<p class="text-xs font-medium text-muted uppercase">Pulse Animation</p>
					<div class="flex items-center gap-3">
						<Skeleton variant="circular" width="40px" height="40px" />
						<div class="flex-1 space-y-2">
							<Skeleton variant="text" width="70%" />
							<Skeleton variant="text" width="40%" />
						</div>
					</div>
				</div>
				<div class="space-y-3">
					<p class="text-xs font-medium text-muted uppercase">Shimmer Animation</p>
					<Skeleton variant="rounded" height="80px" animation="shimmer" />
				</div>
			</div>
		</Card>

		<!-- Badges, Avatars, Spinners -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<Card>
				{#snippet header()}
					<div class="flex items-center justify-between">
						<h3 class="font-semibold text-primary">Badge</h3>
						<Badge variant="info" size="sm">atom</Badge>
					</div>
				{/snippet}
				<div class="flex flex-wrap gap-2">
					<Badge variant="primary">Primary</Badge>
					<Badge variant="success" dot>Active</Badge>
					<Badge variant="warning" dot>Pending</Badge>
					<Badge variant="error" dot>Failed</Badge>
				</div>
			</Card>

			<Card>
				{#snippet header()}
					<div class="flex items-center justify-between">
						<h3 class="font-semibold text-primary">Avatar</h3>
						<Badge variant="info" size="sm">atom</Badge>
					</div>
				{/snippet}
				<div class="flex items-center gap-3">
					<Avatar name="Rafael González" status="online" size="md" />
					<Avatar name="Ana Martínez" status="busy" size="md" />
					<Avatar name="Carlos López" status="away" size="md" />
				</div>
			</Card>

			<Card>
				{#snippet header()}
					<div class="flex items-center justify-between">
						<h3 class="font-semibold text-primary">Toggle & Checkbox</h3>
						<Badge variant="info" size="sm">atom</Badge>
					</div>
				{/snippet}
				<div class="space-y-3">
					<Toggle label="Enable Notifications" bind:checked={toggleValue} />
					<Checkbox label="Accept terms & conditions" bind:checked={checkValue} />
				</div>
			</Card>
		</div>
	</section>

	<!-- ── Molecules ──────────────────────────────────────────────────────── -->
	<section id="molecules" class="space-y-8">
		<div class="flex items-center gap-3">
			<div class="h-px flex-1 bg-border"></div>
			<h2 class="text-xs font-semibold uppercase tracking-widest text-muted">Molecules</h2>
			<div class="h-px flex-1 bg-border"></div>
		</div>

		<!-- Inputs, Textarea, Select, PinInput -->
		<Card>
			{#snippet header()}
				<div class="flex items-center justify-between">
					<h3 class="font-semibold text-primary">Form Controls</h3>
					<Badge variant="warning" size="sm">molecule</Badge>
				</div>
			{/snippet}

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<FormField
					label="Email address"
					type="email"
					placeholder="hello@r2digi.com"
					helperText="We'll never share your email."
					bind:value={inputValue}
				/>

				<Select
					label="Country"
					searchable
					bind:value={selectedCountry}
					options={[
						{ value: 'es', label: 'Spain 🇪🇸' },
						{ value: 'us', label: 'United States 🇺🇸' },
						{ value: 'mx', label: 'Mexico 🇲🇽' },
						{ value: 'ar', label: 'Argentina 🇦🇷' }
					]}
				/>

				<Textarea
					label="Bio / Notes"
					placeholder="Tell us about yourself..."
					maxLength={160}
					showCount
					bind:value={textareaValue}
				/>

				<PinInput
					label="2FA Security Code"
					length={4}
					helperText="Enter 4-digit code"
					bind:value={pinVal}
				/>
			</div>
		</Card>

		<!-- RadioGroup & FileUploader -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<Card>
				{#snippet header()}
					<div class="flex items-center justify-between">
						<h3 class="font-semibold text-primary">RadioGroup</h3>
						<Badge variant="warning" size="sm">molecule</Badge>
					</div>
				{/snippet}
				<RadioGroup
					label="Subscription Plan"
					bind:value={selectedPlan}
					options={[
						{ value: 'free', label: 'Free Plan', helperText: '$0/month' },
						{ value: 'pro', label: 'Pro Plan', helperText: '$19/month' },
						{ value: 'enterprise', label: 'Enterprise', helperText: 'Custom pricing' }
					]}
				/>
			</Card>

			<Card>
				{#snippet header()}
					<div class="flex items-center justify-between">
						<h3 class="font-semibold text-primary">FileUploader</h3>
						<Badge variant="warning" size="sm">molecule</Badge>
					</div>
				{/snippet}
				<FileUploader label="Attachments" helperText="PNG, JPG, PDF (max 10MB)" />
			</Card>
		</div>

		<!-- EmptyState -->
		<Card>
			{#snippet header()}
				<div class="flex items-center justify-between">
					<h3 class="font-semibold text-primary">EmptyState</h3>
					<Badge variant="warning" size="sm">molecule</Badge>
				</div>
			{/snippet}
			<EmptyState
				title="No invoices created yet"
				description="Start by creating your first invoice for your clients."
			>
				{#snippet action()}
					<Button variant="primary" size="sm">Create Invoice</Button>
				{/snippet}
			</EmptyState>
		</Card>

		<!-- Toast Notifications -->
		<Card>
			{#snippet header()}
				<div class="flex items-center justify-between">
					<h3 class="font-semibold text-primary">Toast System</h3>
					<Badge variant="warning" size="sm">molecule</Badge>
				</div>
			{/snippet}

			<div class="flex flex-wrap gap-3">
				<Button variant="ghost" onclick={() => toast.show('Hello! This is a default toast.')}>
					Default
				</Button>
				<Button variant="ghost" onclick={() => toast.success('Your changes have been saved!', 'Saved')}>
					Success
				</Button>
				<Button variant="ghost" onclick={() => toast.error('Something went wrong. Please try again.', 'Error')}>
					Error
				</Button>
				<Button variant="ghost" onclick={() => toast.warning('Your session expires in 5 minutes.', 'Warning')}>
					Warning
				</Button>
				<Button variant="ghost" onclick={() => toast.info('New version available. Refresh to update.', 'Info')}>
					Info
				</Button>
			</div>
		</Card>
	</section>

	<!-- Footer -->
	<footer class="border-t border-border pt-8 pb-12 text-center text-sm text-muted">
		<p>R2DigiSolutions Component Library · Built with Svelte 5 + Tailwind 4</p>
	</footer>

</main>
