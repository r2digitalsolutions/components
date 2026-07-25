<script lang="ts">
	import EditorShell from './EditorShell.svelte';
	import PropertyGroup from '$lib/components/molecules/PropertyGroup/PropertyGroup.svelte';
	import PropertyField from '$lib/components/molecules/PropertyField/PropertyField.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';
	import Slider from '$lib/components/atoms/Slider/Slider.svelte';
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	let sidebarSize = $state(22);
	let inspectorSize = $state(30);
	let bottomSize = $state(26);

	let location = $state('120.0, 40.0, 0.0');
	let rotation = $state('0.0, 90.0, 0.0');
	let scale = $state('1.0, 1.0, 1.0');
	let visible = $state(true);
	let mobility = $state('static');
	let intensity = $state(3.5);

	const actors = ['BP_Player', 'SM_Floor', 'PointLight_Key', 'SkyAtmosphere'];
</script>

<div class="h-[480px] w-full overflow-hidden rounded border border-border">
	<EditorShell bind:sidebarSize bind:inspectorSize bind:bottomSize>
		{#snippet sidebar()}
			<ul class="space-y-0.5 text-xs text-secondary">
				{#each actors as actor}
					<li class="cursor-default rounded-sm px-1.5 py-1 hover:bg-surface-overlay hover:text-primary">
						{actor}
					</li>
				{/each}
			</ul>
		{/snippet}

		{#snippet workspace()}
			<div
				class="flex h-40 items-center justify-center rounded-sm border border-dashed border-border bg-surface-overlay/40"
			>
				<Text size="xs" tone="muted">Viewport</Text>
			</div>
		{/snippet}

		{#snippet bottom()}
			<Text size="xs" tone="secondary">Content Browser · meshes, materials, blueprints</Text>
		{/snippet}

		{#snippet inspector()}
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
				<PropertyField label="Mobility">
					<Select
						size="sm"
						bind:value={mobility}
						options={[
							{ value: 'static', label: 'Static' },
							{ value: 'stationary', label: 'Stationary' },
							{ value: 'movable', label: 'Movable' }
						]}
					/>
				</PropertyField>
				<PropertyField label="Intensity">
					<Slider bind:value={intensity} min={0} max={10} step={0.1} size="sm" showValue={false} />
				</PropertyField>
			</PropertyGroup>
		{/snippet}
	</EditorShell>
</div>
