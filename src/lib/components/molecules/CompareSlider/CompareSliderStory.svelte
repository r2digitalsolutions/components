<script lang="ts">
	import CompareSlider from './CompareSlider.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	interface Props {
		variant?: 'default' | 'images' | 'vertical' | 'custom';
	}

	let { variant = 'default' }: Props = $props();

	let value = $state(52);
	let imageValue = $state(45);
	let verticalValue = $state(40);
	let customValue = $state(55);
</script>

{#if variant === 'default'}
	<div class="w-full space-y-3">
		<Text size="sm" tone="muted">
			Arrastra el handle o usa las flechas del teclado. Sin imágenes externas: siempre visible.
		</Text>
		<CompareSlider
			bind:value
			beforeLabel="Original"
			afterLabel="Retocado"
			class="aspect-[21/9] min-h-[28rem] w-full"
		/>
		<Text size="xs" tone="muted">Posición: {Math.round(value)}%</Text>
	</div>
{:else if variant === 'images'}
	<div class="w-full space-y-3">
		<Text size="sm" tone="muted">Comparación con fotos (Picsum, seeds fijos).</Text>
		<CompareSlider
			bind:value={imageValue}
			beforeSrc="https://picsum.photos/seed/compare-before/1600/900"
			afterSrc="https://picsum.photos/seed/compare-after/1600/900"
			beforeLabel="Antes"
			afterLabel="Después"
			class="aspect-[21/9] min-h-[28rem] w-full"
		/>
	</div>
{:else if variant === 'vertical'}
	<div class="mx-auto w-full max-w-3xl space-y-3">
		<Text size="sm" tone="muted">Orientación vertical.</Text>
		<CompareSlider
			bind:value={verticalValue}
			orientation="vertical"
			beforeLabel="Draft"
			afterLabel="Final"
			class="aspect-[3/4] min-h-[36rem] w-full"
		/>
	</div>
{:else}
	<div class="w-full space-y-3">
		<Text size="sm" tone="muted">Contenido custom vía snippets.</Text>
		<CompareSlider
			bind:value={customValue}
			beforeLabel="Wire"
			afterLabel="UI"
			class="aspect-[21/9] min-h-[28rem] w-full"
		>
			{#snippet before()}
				<div
					class="flex h-full w-full flex-col justify-between bg-[#1a1a1a] p-8 text-white sm:p-10"
					style="background-image: linear-gradient(#2a2a2a 1px, transparent 1px), linear-gradient(90deg, #2a2a2a 1px, transparent 1px); background-size: 24px 24px;"
				>
					<div class="h-10 w-40 rounded bg-white/20"></div>
					<div class="space-y-3">
						<div class="h-4 w-3/4 rounded bg-white/15"></div>
						<div class="h-4 w-1/2 rounded bg-white/10"></div>
						<div class="mt-6 h-36 w-full rounded-lg border border-dashed border-white/25"></div>
					</div>
					<div class="flex gap-3">
						<div class="h-10 w-28 rounded bg-white/20"></div>
						<div class="h-10 w-28 rounded border border-white/20"></div>
					</div>
				</div>
			{/snippet}
			{#snippet after()}
				<div
					class="flex h-full w-full flex-col justify-between bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white sm:p-10"
				>
					<div class="text-2xl font-semibold tracking-tight">Product dashboard</div>
					<div class="space-y-3">
						<p class="max-w-md text-base text-white/80">
							Ship faster with a clear hierarchy and one primary action.
						</p>
						<div class="mt-4 grid max-w-lg grid-cols-3 gap-3">
							{#each ['12k', '98%', '4.8'] as stat}
								<div class="rounded-lg bg-white/15 px-4 py-3 text-center backdrop-blur-sm">
									<div class="text-lg font-bold">{stat}</div>
								</div>
							{/each}
						</div>
					</div>
					<button
						type="button"
						class="w-fit rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-700"
					>
						Get started
					</button>
				</div>
			{/snippet}
		</CompareSlider>
	</div>
{/if}
