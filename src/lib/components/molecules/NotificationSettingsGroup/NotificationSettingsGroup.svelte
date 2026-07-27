<script lang="ts">
	import SettingsRow from '$lib/components/molecules/SettingsRow/SettingsRow.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';

	export interface NotificationSettingItem {
		id: string;
		title: string;
		description?: string;
		checked: boolean;
	}

	interface NotificationSettingsGroupProps {
		title: string;
		description?: string;
		items: NotificationSettingItem[];
		class?: string;
		onchange?: (id: string, checked: boolean) => void;
	}

	let {
		title,
		description,
		items,
		class: className = '',
		onchange
	}: NotificationSettingsGroupProps = $props();
</script>

<section class={['w-full space-y-3', className]}>
	<header class="space-y-1 px-1">
		<h3 class="text-sm font-semibold text-primary">{title}</h3>
		{#if description}
			<p class="text-xs leading-relaxed text-muted">{description}</p>
		{/if}
	</header>

	<Stack gap="none" class="divide-y divide-border rounded-xl border border-border bg-surface-elevated">
		{#each items as item (item.id)}
			<SettingsRow
				title={item.title}
				description={item.description}
				checked={item.checked}
				variant="flush"
				onchange={(checked) => onchange?.(item.id, checked)}
			/>
		{/each}
	</Stack>
</section>
