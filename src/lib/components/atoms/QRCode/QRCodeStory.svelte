<script lang="ts">
	import QRCode from './QRCode.svelte';

	let props = $props<{
		value?: string;
		size?: number;
		fgColor?: string;
		bgColor?: string;
		rounded?: boolean;
		bordered?: boolean;
		showLogo?: boolean;
		logoSize?: number;
	}>();

	const value = $derived(props.value ?? 'https://r2digisolutions.com');
	const size = $derived(props.size ?? 200);
	const showLogo = $derived(props.showLogo ?? true);
	const fg = $derived(props.fgColor || '#18181b');
	const bg = $derived(props.bgColor || '#ffffff');
</script>

<div class="flex flex-wrap items-end gap-8">
	<div class="space-y-2">
		<p class="text-xs font-medium text-muted">Interactive</p>
		{#if showLogo}
			<QRCode
				{value}
				{size}
				fgColor={fg}
				bgColor={bg}
				rounded={props.rounded ?? true}
				bordered={props.bordered ?? true}
				logoSize={props.logoSize ?? 22}
			>
				{#snippet logo()}
					<span
						class="flex h-full w-full items-center justify-center rounded-md bg-brand-500 text-[10px] font-bold tracking-tight text-white"
					>
						R2
					</span>
				{/snippet}
			</QRCode>
		{:else}
			<QRCode
				{value}
				{size}
				fgColor={fg}
				bgColor={bg}
				rounded={props.rounded ?? true}
				bordered={props.bordered ?? true}
			/>
		{/if}
	</div>

	<div class="space-y-2">
		<p class="text-xs font-medium text-muted">Simple</p>
		<QRCode {value} size={140} bordered={false} rounded={false} />
	</div>

	<div class="space-y-2">
		<p class="text-xs font-medium text-muted">Brand colors</p>
		<QRCode value={value} size={140} fgColor="#4f46e5" bgColor="#eef2ff" logoSize={24}>
			{#snippet logo()}
				<span
					class="flex h-full w-full items-center justify-center rounded-md bg-indigo-600 text-[9px] font-bold text-white"
				>
					R2
				</span>
			{/snippet}
		</QRCode>
	</div>

	<div class="space-y-2">
		<p class="text-xs font-medium text-muted">Dark</p>
		<QRCode value={value} size={140} fgColor="#fafafa" bgColor="#18181b" logoSize={24}>
			{#snippet logo()}
				<span
					class="flex h-full w-full items-center justify-center rounded-md bg-zinc-800 text-[9px] font-bold text-white ring-1 ring-zinc-600"
				>
					R2
				</span>
			{/snippet}
		</QRCode>
	</div>
</div>
