<script lang="ts">
	import CaretBlink from './CaretBlink.svelte';
	import type {
		CaretBlinkHeight,
		CaretBlinkShape,
		CaretBlinkSpeed,
		CaretBlinkThickness,
		CaretBlinkTone
	} from './CaretBlink.svelte';

	let props = $props<{
		visible?: boolean;
		height?: CaretBlinkHeight;
		tone?: CaretBlinkTone;
		speed?: CaretBlinkSpeed;
		shape?: CaretBlinkShape;
		thickness?: CaretBlinkThickness;
		paused?: boolean;
		demo?: 'playground' | 'shapes' | 'speeds' | 'tones' | 'editor';
	}>();

	const demo = $derived(props.demo ?? 'playground');
	const tones: CaretBlinkTone[] = ['brand', 'primary', 'muted', 'success', 'warning', 'danger'];
	const speeds: CaretBlinkSpeed[] = ['slow', 'normal', 'fast'];
	const shapes: CaretBlinkShape[] = ['bar', 'block', 'underscore'];
</script>

{#if demo === 'playground'}
	<p class="inline-flex items-center gap-0.5 text-sm text-primary">
		<span>Typing</span>
		<CaretBlink
			visible={props.visible ?? true}
			height={props.height ?? 'md'}
			tone={props.tone ?? 'brand'}
			speed={props.speed ?? 'normal'}
			shape={props.shape ?? 'bar'}
			thickness={props.thickness ?? 'md'}
			paused={props.paused ?? false}
		/>
	</p>
{:else if demo === 'shapes'}
	<div class="flex flex-col gap-4 text-sm text-primary">
		{#each shapes as shape (shape)}
			<p class="inline-flex items-end gap-1">
				<span class="w-24 capitalize text-muted">{shape}</span>
				<span class="font-mono">npm run dev</span>
				<CaretBlink {shape} height="lg" />
			</p>
		{/each}
	</div>
{:else if demo === 'speeds'}
	<div class="flex flex-col gap-3 text-sm text-primary">
		{#each speeds as speed (speed)}
			<p class="inline-flex items-center gap-2">
				<span class="w-16 capitalize text-muted">{speed}</span>
				<span>Waiting</span>
				<CaretBlink {speed} />
			</p>
		{/each}
		<p class="inline-flex items-center gap-2">
			<span class="w-16 text-muted">paused</span>
			<span>Frozen</span>
			<CaretBlink paused />
		</p>
	</div>
{:else if demo === 'tones'}
	<div class="flex flex-wrap items-center gap-4 text-sm">
		{#each tones as tone (tone)}
			<span class="inline-flex items-center gap-1 capitalize text-primary">
				{tone}
				<CaretBlink {tone} />
			</span>
		{/each}
	</div>
	<div class="mt-4 flex items-end gap-3 text-primary">
		<span class="inline-flex items-center gap-0.5 text-xs">sm <CaretBlink height="sm" /></span>
		<span class="inline-flex items-center gap-0.5 text-sm">md <CaretBlink height="md" /></span>
		<span class="inline-flex items-center gap-0.5 text-base">lg <CaretBlink height="lg" /></span>
		<span class="inline-flex items-center gap-0.5 text-lg">xl <CaretBlink height="xl" /></span>
	</div>
{:else}
	<div
		class="w-full max-w-lg rounded-xl border border-border bg-surface-elevated p-4 font-mono text-sm text-primary shadow-sm"
	>
		<div class="mb-3 flex items-center gap-2 text-xs text-muted">
			<span class="h-2.5 w-2.5 rounded-full bg-red-400"></span>
			<span class="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
			<span class="h-2.5 w-2.5 rounded-full bg-green-400"></span>
			<span class="ml-2">editor.tsx</span>
		</div>
		<div class="space-y-1 leading-relaxed">
			<p>
				<span class="mr-3 text-muted">1</span>
				<span class="text-brand-600 dark:text-brand-400">export function</span> greet() {'{'}
			</p>
			<p>
				<span class="mr-3 text-muted">2</span>
				<span class="pl-4 text-brand-600 dark:text-brand-400">return</span>
				<span class="text-green-600 dark:text-green-400"> 'Hello'</span>;
			</p>
			<p>
				<span class="mr-3 text-muted">3</span>
				{'}'}
			</p>
			<p class="inline-flex items-center">
				<span class="mr-3 text-muted">4</span>
				<CaretBlink shape="block" height="md" tone="brand" speed="fast" />
			</p>
		</div>
	</div>
{/if}
