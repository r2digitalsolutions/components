<script lang="ts">
	import ScrollProgress from './ScrollProgress.svelte';

	let props = $props<{
		height?: number;
		color?: string;
		showTrack?: boolean;
	}>();

	let progressLabel = $state(0);
</script>

<div class="w-full max-w-lg space-y-2">
	<p class="text-xs text-muted">
		Scroll the panel — the bar at the top fills as you read.
		<span class="ml-1 font-mono text-secondary">{Math.round(progressLabel)}%</span>
	</p>

	<div
		class="relative h-72 w-full overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm"
	>
		<!-- Bar sits on the outer frame so it does not scroll away -->
		<ScrollProgress
			target="#scroll-progress-demo"
			placement="absolute"
			position="top"
			height={props.height ?? 4}
			color={props.color || undefined}
			showTrack={props.showTrack ?? true}
		/>

		<div
			id="scroll-progress-demo"
			class="h-full overflow-y-auto"
			onscroll={(e) => {
				const el = e.currentTarget;
				const max = el.scrollHeight - el.clientHeight;
				progressLabel = max > 0 ? (el.scrollTop / max) * 100 : 0;
			}}
		>
			<div class="space-y-4 p-5 pt-6 text-sm leading-relaxed text-secondary">
				<p class="text-base font-semibold text-primary">Reading demo</p>
				{#each Array.from({ length: 24 }, (_, i) => i + 1) as n}
					<p>
						Paragraph {n}. Keep scrolling to watch the progress indicator grow across the top edge of
						this panel. The track stays visible so the bar never disappears at 0%.
					</p>
				{/each}
			</div>
		</div>
	</div>
</div>
