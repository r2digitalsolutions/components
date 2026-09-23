<script lang="ts">
	interface VerifiedBadgeProps {
		/** Icon size. `sm` for inline text, `md` next to titles, `lg` for hero headers. */
		size?: 'sm' | 'md' | 'lg';
		/** When set, renders a pill with the seal and this text instead of the bare seal. */
		label?: string;
		/** Accessible name for the bare seal. */
		title?: string;
		class?: string;
	}

	let {
		size = 'md',
		label,
		title = 'Verified',
		class: className = ''
	}: VerifiedBadgeProps = $props();

	const sizeClass = $derived(
		{
			sm: 'h-4 w-4',
			md: 'h-5 w-5',
			lg: 'h-7 w-7'
		}[size]
	);
</script>

{#snippet seal(extra: string)}
	<svg
		class={['drop-shadow-sm shrink-0', extra]}
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden="true"
	>
		<defs>
			<linearGradient id="r2-verified-gradient" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0" stop-color="#38bdf8" />
				<stop offset="1" stop-color="#0284c7" />
			</linearGradient>
		</defs>
		<!-- Scalloped seal: 12 lobes -->
		<path
			fill="url(#r2-verified-gradient)"
			d="M12 1.6l2.05 1.7 2.6-.55.98 2.48 2.48.98-.55 2.6L21.26 11l-1.7 2.05.55 2.6-2.48.98-.98 2.48-2.6-.55L12 20.26l-2.05-1.7-2.6.55-.98-2.48-2.48-.98.55-2.6L2.74 11l1.7-2.05-.55-2.6 2.48-.98.98-2.48 2.6.55z"
			transform="translate(0 1)"
		/>
		<path
			d="M8.2 12.2l2.4 2.4 5.2-5.4"
			stroke="#fff"
			stroke-width="2.4"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#if label}
	<span
		class={[
			'gap-1.5 bg-sky-50 py-0.5 pr-2.5 pl-1.5 text-xs font-medium text-sky-700 dark:bg-sky-500/15 dark:text-sky-300 inline-flex items-center rounded-full',
			className
		]}
	>
		{@render seal('h-4 w-4')}
		{label}
	</span>
{:else}
	<span
		class={['inline-flex items-center align-middle', className]}
		{title}
		role="img"
		aria-label={title}
	>
		{@render seal(sizeClass)}
	</span>
{/if}
