<script lang="ts">
	import DesktopAppIcon from './DesktopAppIcon.svelte';
	import type { DesktopIconId, DesktopAppIconTone } from './DesktopAppIcon.svelte';

	const ids: { id: DesktopIconId; tone: DesktopAppIconTone; label: string }[] = [
		{ id: 'files', tone: 'amber', label: 'Files' },
		{ id: 'mail', tone: 'sky', label: 'Mail' },
		{ id: 'music', tone: 'violet', label: 'Music' },
		{ id: 'notes', tone: 'emerald', label: 'Notes' },
		{ id: 'settings', tone: 'neutral', label: 'Settings' },
		{ id: 'stats', tone: 'brand', label: 'Analytics' }
	];
</script>

<div class="flex flex-wrap gap-4 p-4">
	{#each ids as item (item.id)}
		<div class="flex w-20 flex-col items-center gap-1.5">
			<DesktopAppIcon icon={item.id} tone={item.tone} size="lg" />
			<span class="text-[11px] font-medium text-primary">{item.label}</span>
		</div>
	{/each}
</div>
