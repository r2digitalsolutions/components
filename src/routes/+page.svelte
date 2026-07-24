<script lang="ts">
	import { themeStore } from '$lib/utils/theme.svelte.js';
	import { toast } from '$lib/components/molecules/Toast/toast.svelte.js';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Spinner from '$lib/components/atoms/Spinner/Spinner.svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';
	import Checkbox from '$lib/components/atoms/Checkbox/Checkbox.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';

	let loadingBtn = $state(false);
	let inputValue = $state('');
	let toggleValue = $state(false);
	let checkValue = $state(false);

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
				<Badge variant="primary" rounded>v0.1.0</Badge>
				<button
					id="theme-toggle"
					type="button"
					onclick={() => themeStore.toggle()}
					class="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-elevated text-secondary hover:text-primary hover:bg-surface-overlay transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
					aria-label="Toggle theme"
				>
					{#if themeStore.isDark}
						<!-- Sun icon -->
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
						<!-- Moon icon -->
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
				<!-- Variants -->
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

				<!-- Sizes -->
				<div>
					<p class="text-xs font-medium text-muted mb-3 uppercase tracking-wide">Sizes</p>
					<div class="flex flex-wrap items-center gap-3">
						<Button size="xs">XSmall</Button>
						<Button size="sm">Small</Button>
						<Button size="md">Medium</Button>
						<Button size="lg">Large</Button>
						<Button size="xl">XLarge</Button>
					</div>
				</div>

				<!-- States -->
				<div>
					<p class="text-xs font-medium text-muted mb-3 uppercase tracking-wide">States</p>
					<div class="flex flex-wrap gap-3">
						<Button loading={loadingBtn} onclick={simulateLoad}>
							{loadingBtn ? 'Loading...' : 'Simulate Load'}
						</Button>
						<Button disabled>Disabled</Button>
						<Button fullWidth variant="secondary">Full Width</Button>
					</div>
				</div>
			</div>
		</Card>

		<!-- Badges -->
		<Card>
			{#snippet header()}
				<div class="flex items-center justify-between">
					<h3 class="font-semibold text-primary">Badge</h3>
					<Badge variant="info" size="sm">atom</Badge>
				</div>
			{/snippet}

			<div class="space-y-4">
				<div>
					<p class="text-xs font-medium text-muted mb-3 uppercase tracking-wide">Variants</p>
					<div class="flex flex-wrap gap-2">
						<Badge>Default</Badge>
						<Badge variant="primary">Primary</Badge>
						<Badge variant="secondary">Secondary</Badge>
						<Badge variant="success" dot>Active</Badge>
						<Badge variant="warning" dot>Warning</Badge>
						<Badge variant="error" dot>Error</Badge>
						<Badge variant="info">Info</Badge>
					</div>
				</div>
				<div>
					<p class="text-xs font-medium text-muted mb-3 uppercase tracking-wide">Rounded (pill)</p>
					<div class="flex flex-wrap gap-2">
						<Badge variant="primary" rounded>42</Badge>
						<Badge variant="success" rounded dot>Online</Badge>
						<Badge variant="error" rounded>99+</Badge>
					</div>
				</div>
			</div>
		</Card>

		<!-- Avatars -->
		<Card>
			{#snippet header()}
				<div class="flex items-center justify-between">
					<h3 class="font-semibold text-primary">Avatar</h3>
					<Badge variant="info" size="sm">atom</Badge>
				</div>
			{/snippet}

			<div class="space-y-4">
				<div>
					<p class="text-xs font-medium text-muted mb-3 uppercase tracking-wide">Sizes & Initials</p>
					<div class="flex flex-wrap items-end gap-3">
						<Avatar name="Rafael González" size="xs" />
						<Avatar name="Ana M" size="sm" />
						<Avatar name="Carlos López" size="md" />
						<Avatar name="Elena R" size="lg" />
						<Avatar name="Pedro S" size="xl" />
						<Avatar name="Marta T" size="2xl" />
					</div>
				</div>
				<div>
					<p class="text-xs font-medium text-muted mb-3 uppercase tracking-wide">With status</p>
					<div class="flex flex-wrap items-center gap-4">
						<div class="flex items-center gap-2">
							<Avatar name="Online User" status="online" />
							<span class="text-sm text-secondary">Online</span>
						</div>
						<div class="flex items-center gap-2">
							<Avatar name="Busy User" status="busy" />
							<span class="text-sm text-secondary">Busy</span>
						</div>
						<div class="flex items-center gap-2">
							<Avatar name="Away User" status="away" />
							<span class="text-sm text-secondary">Away</span>
						</div>
						<div class="flex items-center gap-2">
							<Avatar name="Offline User" status="offline" />
							<span class="text-sm text-secondary">Offline</span>
						</div>
					</div>
				</div>
			</div>
		</Card>

		<!-- Spinners -->
		<Card>
			{#snippet header()}
				<div class="flex items-center justify-between">
					<h3 class="font-semibold text-primary">Spinner</h3>
					<Badge variant="info" size="sm">atom</Badge>
				</div>
			{/snippet}

			<div class="flex flex-wrap items-center gap-6">
				<div class="flex flex-col items-center gap-2">
					<Spinner size="xs" />
					<span class="text-xs text-muted">xs</span>
				</div>
				<div class="flex flex-col items-center gap-2">
					<Spinner size="sm" />
					<span class="text-xs text-muted">sm</span>
				</div>
				<div class="flex flex-col items-center gap-2">
					<Spinner size="md" />
					<span class="text-xs text-muted">md</span>
				</div>
				<div class="flex flex-col items-center gap-2">
					<Spinner size="lg" />
					<span class="text-xs text-muted">lg</span>
				</div>
				<div class="flex flex-col items-center gap-2">
					<Spinner size="xl" />
					<span class="text-xs text-muted">xl</span>
				</div>
				<div class="flex flex-col items-center gap-2 rounded-lg bg-brand-500 p-3">
					<Spinner size="md" variant="white" />
					<span class="text-xs text-white">white</span>
				</div>
			</div>
		</Card>

		<!-- Toggles & Checkboxes -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<Card>
				{#snippet header()}
					<div class="flex items-center justify-between">
						<h3 class="font-semibold text-primary">Toggle</h3>
						<Badge variant="info" size="sm">atom</Badge>
					</div>
				{/snippet}

				<div class="space-y-4">
					<Toggle label="Notifications" bind:checked={toggleValue} />
					<Toggle label="Dark mode" size="sm" />
					<Toggle label="Auto-save (large)" size="lg" />
					<Toggle label="Right label" labelPosition="right" checked />
					<Toggle label="Left label" labelPosition="left" checked />
					<Toggle label="Disabled" disabled />
				</div>
			</Card>

			<Card>
				{#snippet header()}
					<div class="flex items-center justify-between">
						<h3 class="font-semibold text-primary">Checkbox</h3>
						<Badge variant="info" size="sm">atom</Badge>
					</div>
				{/snippet}

				<div class="space-y-4">
					<Checkbox label="Accept terms" bind:checked={checkValue} />
					<Checkbox label="With helper" helperText="This option enables extra features" />
					<Checkbox label="Checked state" checked />
					<Checkbox label="Indeterminate" indeterminate />
					<Checkbox label="Small size" size="sm" />
					<Checkbox label="Large size" size="lg" />
					<Checkbox label="Disabled" disabled />
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

		<!-- Inputs & FormFields -->
		<Card>
			{#snippet header()}
				<div class="flex items-center justify-between">
					<h3 class="font-semibold text-primary">Input / FormField</h3>
					<Badge variant="warning" size="sm">molecule</Badge>
				</div>
			{/snippet}

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<FormField
					label="Email address"
					type="email"
					placeholder="hello@r2digi.com"
					helperText="We'll never share your email."
					bind:value={inputValue}
				/>
				<FormField
					label="Password"
					type="password"
					placeholder="••••••••"
					required
				/>
				<FormField
					label="Username"
					placeholder="@username"
					status="success"
					helperText="Username is available!"
				/>
				<FormField
					label="Promo code"
					placeholder="SAVE20"
					errorMessage="Invalid promo code. Please try again."
				/>
				<Input label="Clearable" placeholder="Type to clear..." clearable bind:value={inputValue} />
				<Input label="Disabled" placeholder="Cannot edit this" disabled />
			</div>
		</Card>

		<!-- Cards -->
		<div>
			<p class="text-xs font-semibold uppercase tracking-widest text-muted mb-4">Card variants</p>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card variant="default" padding="md">
					<p class="text-sm font-medium text-primary mb-1">Default</p>
					<p class="text-xs text-muted">Border + soft shadow</p>
				</Card>
				<Card variant="elevated" padding="md">
					<p class="text-sm font-medium text-primary mb-1">Elevated</p>
					<p class="text-xs text-muted">Stronger shadow</p>
				</Card>
				<Card variant="bordered" padding="md">
					<p class="text-sm font-medium text-primary mb-1">Bordered</p>
					<p class="text-xs text-muted">2px border, no fill</p>
				</Card>
				<Card variant="ghost" padding="md">
					<p class="text-sm font-medium text-primary mb-1">Ghost</p>
					<p class="text-xs text-muted">Subtle overlay</p>
				</Card>
			</div>
		</div>

		<!-- Toast demo -->
		<Card>
			{#snippet header()}
				<div class="flex items-center justify-between">
					<h3 class="font-semibold text-primary">Toast Notifications</h3>
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
