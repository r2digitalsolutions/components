<script lang="ts">
	import Truncate from './Truncate.svelte';

	let {
		lines = 1
	}: {
		lines?: 1 | 2 | 3 | 4;
	} = $props();

	const long =
		'Reusable atoms and molecules compose into full product surfaces without reinventing patterns every sprint.';
	const longer =
		'Reusable atoms and molecules compose into full product surfaces without reinventing patterns every sprint. Ship accessible, themeable UI faster with a shared catalog.';
	const title =
		'Quarterly planning notes for the design system rollout across marketing and product.';
</script>

<div class="w-full max-w-md space-y-5">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">Truncate</p>
		<p class="text-xs text-secondary">
			Ellipsis en 1–4 líneas. Tooltip solo si el texto realmente desborda.
		</p>
	</div>

	<div class="space-y-4 rounded-2xl border border-border bg-surface-elevated p-4 shadow-sm">
		<div class="space-y-1.5">
			<p class="text-[10px] font-semibold uppercase tracking-wide text-muted">
				{lines} line{lines === 1 ? '' : 's'} (control)
			</p>
			<div class="max-w-[16rem] rounded-xl border border-border bg-surface px-3 py-2">
				<Truncate {lines} title={long}>{long}</Truncate>
			</div>
		</div>

		<div class="space-y-1.5">
			<p class="text-[10px] font-semibold uppercase tracking-wide text-muted">2 lines</p>
			<div class="max-w-[16rem] rounded-xl border border-border bg-surface px-3 py-2">
				<Truncate lines={2} title={longer}>{longer}</Truncate>
			</div>
		</div>

		<div class="space-y-1.5">
			<p class="text-[10px] font-semibold uppercase tracking-wide text-muted">3 lines</p>
			<div class="max-w-[16rem] rounded-xl border border-border bg-surface px-3 py-2">
				<Truncate lines={3} title={longer}>{longer}</Truncate>
			</div>
		</div>
	</div>

	<div class="rounded-2xl border border-border bg-surface-elevated p-4 shadow-sm">
		<p class="text-[10px] font-semibold uppercase tracking-wide text-muted">In a list row</p>
		<ul class="mt-2 divide-y divide-border">
			{#each [title, long, 'Short label'] as row}
				<li class="flex items-center gap-3 py-2.5">
					<span class="h-8 w-8 shrink-0 rounded-lg bg-brand-500/15"></span>
					<div class="min-w-0 flex-1">
						<Truncate lines={1} title={row}>{row}</Truncate>
						<p class="text-[11px] text-muted">Hover if truncated</p>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>
