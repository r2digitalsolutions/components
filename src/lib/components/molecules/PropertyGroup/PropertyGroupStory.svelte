<script lang="ts">
	import PropertyGroup from './PropertyGroup.svelte';
	import PropertyField from '$lib/components/molecules/PropertyField/PropertyField.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';
	import Slider from '$lib/components/atoms/Slider/Slider.svelte';
	import Panel from '$lib/components/molecules/Panel/Panel.svelte';
	import Box from '@lucide/svelte/icons/box';

	let location = $state('120.0, 0.0, -40.0');
	let rotation = $state('0.0, 90.0, 0.0');
	let scale = $state('1.0, 1.0, 1.0');
	let visible = $state(true);
	let castShadows = $state(true);
	let intensity = $state(1.4);
	let mobility = $state('Movable');
</script>

<div class="flex h-[min(70vh,36rem)] w-full overflow-hidden rounded-2xl border border-border shadow-sm">
	<div class="hidden w-56 shrink-0 border-r border-border bg-surface p-3 md:block">
		<p class="text-[11px] font-semibold uppercase tracking-wide text-muted">Scene</p>
		<ul class="mt-2 space-y-0.5 text-xs text-secondary">
			{#each ['DirectionalLight', 'Camera_Main', 'Character_Hero', 'Floor_01'] as item, i}
				<li
					class={[
						'rounded-md px-2 py-1.5',
						i === 2 ? 'bg-brand-50 text-brand-800 dark:bg-brand-950/40 dark:text-brand-200' : 'hover:bg-surface-overlay'
					]}
				>
					{item}
				</li>
			{/each}
		</ul>
	</div>

	<div class="min-w-0 flex-1">
		<Panel title="Details" description="Character_Hero" fill chrome={false}>
			{#snippet icon()}
				<Box class="h-3.5 w-3.5" strokeWidth={2} />
			{/snippet}

			<div class="overflow-hidden rounded-lg border border-border bg-surface-elevated">
				<PropertyGroup title="Transform" open>
					<PropertyField label="Location">
						<Input size="sm" bind:value={location} />
					</PropertyField>
					<PropertyField label="Rotation">
						<Input size="sm" bind:value={rotation} />
					</PropertyField>
					<PropertyField label="Scale">
						<Input size="sm" bind:value={scale} />
					</PropertyField>
				</PropertyGroup>

				<PropertyGroup title="Rendering" open>
					<PropertyField label="Visible">
						<Toggle bind:checked={visible} size="sm" />
					</PropertyField>
					<PropertyField label="Cast shadows">
						<Toggle bind:checked={castShadows} size="sm" />
					</PropertyField>
					<PropertyField label="Intensity">
						<Slider bind:value={intensity} min={0} max={5} step={0.1} />
					</PropertyField>
				</PropertyGroup>

				<PropertyGroup title="Actor">
					<PropertyField label="Mobility">
						<Input size="sm" bind:value={mobility} />
					</PropertyField>
				</PropertyGroup>
			</div>
		</Panel>
	</div>
</div>
