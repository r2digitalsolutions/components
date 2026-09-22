<script lang="ts">
	import SearchResultRow from './SearchResultRow.svelte'
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte'

	interface Props {
		example?: 'basic' | 'with-favicon' | 'no-href' | 'leading-slot'
	}

	let { example = 'basic' }: Props = $props()
</script>

<div class="mx-auto w-full max-w-2xl space-y-1 p-4">
	{#if example === 'basic'}
		<p class="mb-3 text-[11px] font-medium uppercase tracking-wide text-muted">Basic SERP rows</p>
		<div class="divide-y divide-border">
			<SearchResultRow
				title="SvelteKit — The fastest way to build Svelte apps"
				href="https://kit.svelte.dev"
				urlLabel="kit.svelte.dev"
				snippet="SvelteKit is the official application framework for Svelte. It provides everything you need to build fast, secure, and reliable web applications."
			/>
			<SearchResultRow
				title="Svelte • Cybernetically enhanced web apps"
				href="https://svelte.dev"
				urlLabel="svelte.dev"
				snippet="Svelte is a radical new approach to building user interfaces. Whereas traditional frameworks like React and Vue do the bulk of their work in the browser, Svelte shifts that work into a compile step."
			/>
			<SearchResultRow
				title="Vite — Next Generation Frontend Tooling"
				href="https://vitejs.dev"
				urlLabel="vitejs.dev › guide"
				snippet="Vite (French word for 'quick', pronounced /vit/) is a build tool that aims to provide a faster and leaner development experience for modern web projects."
			/>
		</div>
	{:else if example === 'with-favicon'}
		<p class="mb-3 text-[11px] font-medium uppercase tracking-wide text-muted">With favicons</p>
		<div class="divide-y divide-border">
			<SearchResultRow
				title="Evoteg — Plataforma de gestión empresarial"
				href="https://evoteg.com"
				urlLabel="evoteg.com"
				snippet="Software CRM, gestión de gimnasios y herramientas de marketing para empresas modernas."
				favicon="https://evoteg.com/favicon.ico"
			/>
			<SearchResultRow
				title="EvoFact CRM — Facturación y clientes"
				href="https://crm.evoteg.com"
				urlLabel="crm.evoteg.com › dashboard"
				snippet="Gestiona tus clientes, facturas y oportunidades de negocio desde una única plataforma."
				favicon="https://evoteg.com/favicon.ico"
			/>
		</div>
	{:else if example === 'no-href'}
		<p class="mb-3 text-[11px] font-medium uppercase tracking-wide text-muted">No link (static)</p>
		<SearchResultRow
			title="Resultado sin enlace"
			urlLabel="ejemplo.com › ruta"
			snippet="Este resultado no tiene href y muestra el título como span en lugar de enlace."
		/>
	{:else}
		<p class="mb-3 text-[11px] font-medium uppercase tracking-wide text-muted">Custom leading slot</p>
		<div class="divide-y divide-border">
			<SearchResultRow
				title="Rafael González"
				href="#"
				urlLabel="linkedin.com › in › rafael-gonzalez"
				snippet="Founder & Developer en R2 Digisolutions. Especializado en plataformas SaaS B2B."
			>
				{#snippet leading()}
					<Avatar name="Rafael González" size="xs" ringed={false} />
				{/snippet}
			</SearchResultRow>
			<SearchResultRow
				title="María López"
				href="#"
				urlLabel="linkedin.com › in › maria-lopez"
				snippet="Product Designer en Evoteg. Diseño de experiencias digitales para productos SaaS."
			>
				{#snippet leading()}
					<Avatar name="María López" size="xs" ringed={false} />
				{/snippet}
			</SearchResultRow>
		</div>
	{/if}
</div>
