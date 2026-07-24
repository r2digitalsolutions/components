<script lang="ts">
	import { themeStore, type Theme } from '$lib/utils/theme.svelte.js';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';

	interface ThemeToggleProps {
		mode?: 'toggle' | 'select';
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
		class?: string;
	}

	let {
		mode = 'toggle',
		size = 'md',
		variant = 'ghost',
		class: className = ''
	}: ThemeToggleProps = $props();

	const options: { value: Theme; label: string }[] = [
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' },
		{ value: 'system', label: 'System' }
	];
</script>

{#if mode === 'select'}
	<div
		class={['inline-flex rounded-lg border border-border bg-surface-elevated p-0.5', className]}
		role="group"
		aria-label="Theme"
	>
		{#each options as option (option.value)}
			<button
				type="button"
				class={[
					'rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
					themeStore.theme === option.value
						? 'bg-brand-500 text-white shadow-sm'
						: 'text-secondary hover:bg-surface-overlay hover:text-primary'
				]}
				aria-pressed={themeStore.theme === option.value}
				onclick={() => themeStore.set(option.value)}
			>
				{option.label}
			</button>
		{/each}
	</div>
{:else}
	<IconButton
		label={themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'}
		{size}
		{variant}
		class={className}
		onclick={() => themeStore.toggle()}
	>
		{#if themeStore.isDark}
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-full w-full">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
				/>
			</svg>
		{:else}
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-full w-full">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
				/>
			</svg>
		{/if}
	</IconButton>
{/if}
