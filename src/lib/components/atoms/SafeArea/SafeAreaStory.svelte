<script lang="ts">
	import SafeArea from './SafeArea.svelte';
</script>

<div class="mx-auto max-w-xs overflow-hidden rounded-[2rem] border border-border bg-surface-elevated shadow-lg">
	<div class="bg-brand-500 px-4 py-2 text-center text-xs font-medium text-white">Status bar</div>
	<SafeArea class="space-y-2 bg-surface px-4 py-6" offset="8px">
		<p class="text-sm font-medium text-primary">SafeArea content</p>
		<p class="text-xs text-secondary">
			Insets use <code class="font-mono">env(safe-area-inset-*)</code> so notches and home bars stay clear.
		</p>
	</SafeArea>
	<div class="flex justify-center bg-surface pb-2 pt-1">
		<span class="h-1 w-24 rounded-full bg-primary/20"></span>
	</div>
</div>
