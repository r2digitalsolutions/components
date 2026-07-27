<script lang="ts">
	import RailMark from './RailMark.svelte';
	import type {
		RailMarkInset,
		RailMarkLength,
		RailMarkSide,
		RailMarkThickness,
		RailMarkTone
	} from './RailMark.svelte';

	let props = $props<{
		active?: boolean;
		side?: RailMarkSide;
		thickness?: RailMarkThickness;
		tone?: RailMarkTone;
		inset?: RailMarkInset;
		length?: RailMarkLength;
		rounded?: boolean;
		demo?: 'playground' | 'tones' | 'sizes' | 'nav';
	}>();

	const demo = $derived(props.demo ?? 'playground');

	const tones: RailMarkTone[] = ['brand', 'primary', 'success', 'warning', 'danger', 'muted'];
	const thicknesses: RailMarkThickness[] = ['sm', 'md', 'lg'];
</script>

{#if demo === 'playground'}
	<div class="relative flex w-56 flex-col gap-1 rounded-xl border border-border bg-surface-elevated p-2">
		<div class="relative rounded-lg px-3 py-2 text-sm text-muted">Overview</div>
		<div class="relative rounded-lg bg-surface-overlay px-3 py-2 text-sm font-medium text-primary">
			<RailMark
				active={props.active ?? true}
				side={props.side ?? 'left'}
				thickness={props.thickness ?? 'md'}
				tone={props.tone ?? 'brand'}
				inset={props.inset ?? 'md'}
				length={props.length ?? 'auto'}
				rounded={props.rounded ?? true}
			/>
			Analytics
		</div>
		<div class="relative rounded-lg px-3 py-2 text-sm text-muted">Settings</div>
	</div>
{:else if demo === 'tones'}
	<div class="flex flex-col gap-2">
		{#each tones as tone (tone)}
			<div class="relative w-56 rounded-lg bg-surface-overlay px-3 py-2 text-sm font-medium capitalize text-primary">
				<RailMark {tone} />
				{tone}
			</div>
		{/each}
	</div>
{:else if demo === 'sizes'}
	<div class="flex flex-col gap-3">
		{#each thicknesses as thickness (thickness)}
			<div class="relative w-56 rounded-lg bg-surface-overlay px-3 py-2.5 text-sm font-medium text-primary">
				<RailMark {thickness} length="short" />
				thickness · {thickness}
			</div>
		{/each}
		<div class="relative w-56 rounded-lg bg-surface-overlay px-3 py-2.5 text-sm font-medium text-primary">
			<RailMark side="right" tone="success" length="full" rounded={false} />
			right · full · square
		</div>
		<div class="relative w-56 rounded-lg bg-surface-overlay px-3 py-2.5 text-sm font-medium text-primary">
			<RailMark tone="warning" inset="lg" />
			inset · lg
		</div>
	</div>
{:else}
	<div class="flex gap-4">
		<nav class="relative flex w-48 flex-col gap-0.5 rounded-xl border border-border bg-surface-elevated p-2">
			{#each ['Home', 'Projects', 'Billing', 'Team'] as item, i (item)}
				<div
					class={[
						'relative rounded-lg px-3 py-2 text-sm',
						i === 1 ? 'bg-surface-overlay font-medium text-primary' : 'text-muted'
					]}
				>
					{#if i === 1}
						<RailMark tone="brand" thickness="md" />
					{/if}
					{item}
				</div>
			{/each}
		</nav>
		<nav class="relative flex w-48 flex-col gap-0.5 rounded-xl border border-border bg-surface-elevated p-2">
			{#each [
				{ label: 'Inbox', tone: 'brand' as const },
				{ label: 'Done', tone: 'success' as const },
				{ label: 'Snoozed', tone: 'warning' as const },
				{ label: 'Spam', tone: 'danger' as const }
			] as item (item.label)}
				<div class="relative rounded-lg px-3 py-2 text-sm font-medium text-primary">
					<RailMark tone={item.tone} length="short" thickness="lg" />
					{item.label}
				</div>
			{/each}
		</nav>
	</div>
{/if}
