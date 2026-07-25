<script lang="ts">
	interface SlugInputProps {
		value?: string;
		label?: string;
		prefix?: string;
		placeholder?: string;
		helperText?: string;
		disabled?: boolean;
		size?: 'sm' | 'md' | 'lg';
		status?: 'default' | 'error' | 'success' | 'warning';
		class?: string;
		onchange?: (slug: string) => void;
	}

	let {
		value = $bindable(''),
		label = 'Slug',
		prefix = '/',
		placeholder = 'my-page',
		helperText,
		disabled = false,
		size = 'md',
		status = 'default',
		class: className = '',
		onchange
	}: SlugInputProps = $props();

	function slugify(raw: string) {
		return raw
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')
			.replace(/-{2,}/g, '-');
	}

	function oninput(e: Event) {
		const next = slugify((e.target as HTMLInputElement).value);
		value = next;
		onchange?.(next);
	}
</script>

<div class={['w-full', className]}>
	{#if label}
		<label class="mb-1.5 block text-sm font-medium text-primary" for="slug-input">{label}</label>
	{/if}
	<div class="flex items-stretch overflow-hidden rounded-lg border border-border bg-surface-elevated focus-within:ring-2 focus-within:ring-brand-500">
		{#if prefix}
			<span
				class={[
					'inline-flex shrink-0 items-center border-e border-border bg-surface-overlay px-3 font-mono text-sm text-muted',
					size === 'sm' && 'text-xs',
					size === 'lg' && 'text-base'
				]}
			>
				{prefix}
			</span>
		{/if}
		<input
			id="slug-input"
			type="text"
			class={[
				'min-w-0 flex-1 bg-transparent px-3 font-mono text-primary outline-none placeholder:text-muted',
				size === 'sm' && 'h-8 text-xs',
				size === 'md' && 'h-10 text-sm',
				size === 'lg' && 'h-12 text-base',
				status === 'error' && 'text-red-600',
				disabled && 'cursor-not-allowed opacity-50'
			]}
			{value}
			{placeholder}
			{disabled}
			spellcheck="false"
			autocomplete="off"
			{oninput}
		/>
	</div>
	{#if helperText}
		<p class="mt-1.5 text-xs text-secondary">{helperText}</p>
	{/if}
</div>
