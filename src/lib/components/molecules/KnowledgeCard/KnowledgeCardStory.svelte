<script lang="ts">
	import KnowledgeCard from './KnowledgeCard.svelte'
	import Button from '$lib/components/atoms/Button/Button.svelte'
	import Badge from '$lib/components/atoms/Badge/Badge.svelte'
	import Text from '$lib/components/atoms/Text/Text.svelte'

	interface Props {
		example?: 'basic' | 'with-cover' | 'with-actions' | 'minimal'
	}

	let { example = 'basic' }: Props = $props()
</script>

<div class="mx-auto w-full max-w-xs space-y-4 p-4">
	{#if example === 'basic'}
		<p class="text-[11px] font-medium uppercase tracking-wide text-muted">Basic entity card</p>
		<KnowledgeCard
			title="Rafael González"
			subtitle="Fundador · R2 Digisolutions"
			href="#"
		/>
	{:else if example === 'with-cover'}
		<p class="text-[11px] font-medium uppercase tracking-wide text-muted">With cover image</p>
		<KnowledgeCard
			title="Evoteg"
			subtitle="Plataforma SaaS para empresas"
			coverUrl="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80"
			avatarUrl="https://evoteg.com/favicon.ico"
			href="#"
		/>
	{:else if example === 'with-actions'}
		<p class="text-[11px] font-medium uppercase tracking-wide text-muted">With actions + children</p>
		<KnowledgeCard
			title="EvoFact CRM"
			subtitle="Software de gestión empresarial"
			coverUrl="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80"
		>
			{#snippet actions()}
				<div class="flex gap-2">
					<Button size="sm" variant="primary">Ver producto</Button>
					<Button size="sm" variant="secondary">Más info</Button>
				</div>
			{/snippet}
			{#snippet children()}
				<div class="flex flex-wrap gap-1">
					<Badge size="sm" variant="secondary" rounded>CRM</Badge>
					<Badge size="sm" variant="secondary" rounded>Facturación</Badge>
					<Badge size="sm" variant="secondary" rounded>VeriFactu</Badge>
				</div>
			{/snippet}
		</KnowledgeCard>
	{:else}
		<p class="text-[11px] font-medium uppercase tracking-wide text-muted">Minimal (no cover)</p>
		<KnowledgeCard title="Atom Gym" subtitle="Gestión de centros deportivos" />
	{/if}
</div>
