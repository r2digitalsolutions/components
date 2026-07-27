<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Textarea from '$lib/components/atoms/Textarea/Textarea.svelte';
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import JSONViewer from '$lib/components/molecules/JSONViewer/JSONViewer.svelte';
	import {
		NATIVE_BLOCK_TYPES,
		createBlock,
		createComponentBlock,
		emptyBlogDocument,
		listBlogComponents,
		type BlogBlock,
		type BlogBlockType,
		type BlogCalloutData,
		type BlogCodeData,
		type BlogComponentData,
		type BlogDocument,
		type BlogHeadingData,
		type BlogImageData,
		type BlogListData,
		type BlogMarkdownData,
		type BlogParagraphData,
		type BlogQuoteData
	} from '$lib/utils/blogDocument.js';

	export type { BlogDocument, BlogBlock, BlogBlockType };

	interface BlogEditorProps {
		value?: BlogDocument;
		showJson?: boolean;
		class?: string;
		onchange?: (doc: BlogDocument) => void;
	}

	let {
		value = $bindable(emptyBlogDocument()),
		showJson = true,
		class: className = '',
		onchange
	}: BlogEditorProps = $props();

	let addMenuOpen = $state(false);
	let componentMenuOpen = $state(false);

	const registered = $derived(listBlogComponents());

	function emit(next: BlogDocument) {
		value = next;
		onchange?.(next);
	}

	function updateTitle(title: string) {
		emit({ ...value, title });
	}

	function addNative(type: Exclude<BlogBlockType, 'component'>) {
		emit({ ...value, blocks: [...value.blocks, createBlock(type)] });
		addMenuOpen = false;
	}

	function addComponent(id: string) {
		emit({ ...value, blocks: [...value.blocks, createComponentBlock(id)] });
		componentMenuOpen = false;
	}

	function updateBlock(id: string, data: BlogBlock['data']) {
		emit({
			...value,
			blocks: value.blocks.map((b) => (b.id === id ? { ...b, data } : b))
		});
	}

	function removeBlock(id: string) {
		emit({ ...value, blocks: value.blocks.filter((b) => b.id !== id) });
	}

	function moveBlock(id: string, dir: -1 | 1) {
		const idx = value.blocks.findIndex((b) => b.id === id);
		if (idx < 0) return;
		const nextIdx = idx + dir;
		if (nextIdx < 0 || nextIdx >= value.blocks.length) return;
		const blocks = [...value.blocks];
		const [item] = blocks.splice(idx, 1);
		blocks.splice(nextIdx, 0, item);
		emit({ ...value, blocks });
	}
</script>

<div
	class={['flex flex-col gap-4 rounded-xl border border-border bg-surface-elevated p-4', className]}
	data-blog-editor
>
	<div class="flex flex-wrap items-center gap-2">
		<Input
			value={value.title ?? ''}
			placeholder="Post title"
			class="min-w-[12rem] flex-1"
			oninput={(e) => updateTitle((e.currentTarget as HTMLInputElement).value)}
		/>
		<div class="relative">
			<Button size="sm" variant="secondary" onclick={() => (addMenuOpen = !addMenuOpen)}>
				Add block
			</Button>
			{#if addMenuOpen}
				<div
					class="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-xl border border-border bg-surface-elevated py-1 shadow-lg"
				>
					{#each NATIVE_BLOCK_TYPES as item (item.type)}
						<button
							type="button"
							class="block w-full px-3 py-1.5 text-left text-sm text-primary hover:bg-surface-overlay"
							onclick={() => addNative(item.type)}
						>
							{item.label}
						</button>
					{/each}
				</div>
			{/if}
		</div>
		{#if registered.length}
			<div class="relative">
				<Button
					size="sm"
					variant="secondary"
					onclick={() => (componentMenuOpen = !componentMenuOpen)}
				>
					Add component
				</Button>
				{#if componentMenuOpen}
					<div
						class="absolute right-0 z-20 mt-1 w-52 overflow-hidden rounded-xl border border-border bg-surface-elevated py-1 shadow-lg"
					>
						{#each registered as item (item.id)}
							<button
								type="button"
								class="block w-full px-3 py-1.5 text-left text-sm text-primary hover:bg-surface-overlay"
								onclick={() => addComponent(item.id)}
							>
								{item.registration.label}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	{#if value.blocks.length === 0}
		<p class="rounded-lg border border-dashed border-border px-3 py-8 text-center text-sm text-muted">
			No blocks yet. Add a block or component to start.
		</p>
	{:else}
		<ul class="flex flex-col gap-3">
			{#each value.blocks as block, i (block.id)}
				<li class="rounded-xl border border-border bg-surface-overlay/40 p-3">
					<div class="mb-2 flex items-center justify-between gap-2">
						<span class="text-[11px] font-semibold uppercase tracking-wide text-muted">
							{block.type}
						</span>
						<div class="flex items-center gap-1">
							<Button size="sm" variant="ghost" disabled={i === 0} onclick={() => moveBlock(block.id, -1)}>
								↑
							</Button>
							<Button
								size="sm"
								variant="ghost"
								disabled={i === value.blocks.length - 1}
								onclick={() => moveBlock(block.id, 1)}
							>
								↓
							</Button>
							<Button size="sm" variant="ghost" onclick={() => removeBlock(block.id)}>Remove</Button>
						</div>
					</div>

					{#if block.type === 'heading'}
						{@const data = block.data as BlogHeadingData}
						<div class="flex gap-2">
							<Select
								value={String(data.level)}
								options={[
									{ value: '1', label: 'H1' },
									{ value: '2', label: 'H2' },
									{ value: '3', label: 'H3' },
									{ value: '4', label: 'H4' }
								]}
								onchange={(v) =>
									updateBlock(block.id, { ...data, level: Number(v) as BlogHeadingData['level'] })}
								class="w-24"
							/>
							<Input
								value={data.text}
								class="flex-1"
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										text: (e.currentTarget as HTMLInputElement).value
									})}
							/>
						</div>
					{:else if block.type === 'paragraph'}
						{@const data = block.data as BlogParagraphData}
						<Textarea
							value={data.text}
							rows={3}
							oninput={(e) =>
								updateBlock(block.id, {
									...data,
									text: (e.currentTarget as HTMLTextAreaElement).value
								})}
						/>
					{:else if block.type === 'image'}
						{@const data = block.data as BlogImageData}
						<div class="flex flex-col gap-2">
							<Input
								value={data.src}
								placeholder="Image URL"
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										src: (e.currentTarget as HTMLInputElement).value
									})}
							/>
							<Input
								value={data.alt ?? ''}
								placeholder="Alt text"
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										alt: (e.currentTarget as HTMLInputElement).value
									})}
							/>
						</div>
					{:else if block.type === 'code'}
						{@const data = block.data as BlogCodeData}
						<div class="flex flex-col gap-2">
							<Input
								value={data.language ?? ''}
								placeholder="Language"
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										language: (e.currentTarget as HTMLInputElement).value
									})}
							/>
							<Textarea
								value={data.code}
								rows={6}
								class="font-mono text-xs"
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										code: (e.currentTarget as HTMLTextAreaElement).value
									})}
							/>
						</div>
					{:else if block.type === 'callout'}
						{@const data = block.data as BlogCalloutData}
						<div class="flex flex-col gap-2">
							<Select
								value={data.tone ?? 'info'}
								options={[
									{ value: 'info', label: 'Info' },
									{ value: 'success', label: 'Success' },
									{ value: 'warning', label: 'Warning' },
									{ value: 'danger', label: 'Danger' }
								]}
								onchange={(v) =>
									updateBlock(block.id, {
										...data,
										tone: v as BlogCalloutData['tone']
									})}
							/>
							<Input
								value={data.title ?? ''}
								placeholder="Title"
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										title: (e.currentTarget as HTMLInputElement).value
									})}
							/>
							<Textarea
								value={data.text}
								rows={3}
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										text: (e.currentTarget as HTMLTextAreaElement).value
									})}
							/>
						</div>
					{:else if block.type === 'quote'}
						{@const data = block.data as BlogQuoteData}
						<div class="flex flex-col gap-2">
							<Textarea
								value={data.text}
								rows={3}
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										text: (e.currentTarget as HTMLTextAreaElement).value
									})}
							/>
							<Input
								value={data.cite ?? ''}
								placeholder="Citation"
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										cite: (e.currentTarget as HTMLInputElement).value
									})}
							/>
						</div>
					{:else if block.type === 'list'}
						{@const data = block.data as BlogListData}
						<div class="flex flex-col gap-2">
							<label class="flex items-center gap-2 text-xs text-muted">
								<input
									type="checkbox"
									checked={!!data.ordered}
									onchange={(e) =>
										updateBlock(block.id, {
											...data,
											ordered: (e.currentTarget as HTMLInputElement).checked
										})}
								/>
								Ordered list
							</label>
							<Textarea
								value={data.items.join('\n')}
								rows={4}
								placeholder="One item per line"
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										items: (e.currentTarget as HTMLTextAreaElement).value.split('\n')
									})}
							/>
						</div>
					{:else if block.type === 'markdown'}
						{@const data = block.data as BlogMarkdownData}
						<Textarea
							value={data.source}
							rows={6}
							class="font-mono text-xs"
							oninput={(e) =>
								updateBlock(block.id, {
									...data,
									source: (e.currentTarget as HTMLTextAreaElement).value
								})}
						/>
					{:else if block.type === 'divider'}
						<p class="text-xs text-muted">Horizontal rule</p>
					{:else if block.type === 'component'}
						{@const data = block.data as BlogComponentData}
						<div class="flex flex-col gap-2">
							<p class="text-xs text-muted">Component: <code>{data.componentId}</code></p>
							<Textarea
								value={JSON.stringify(data.props ?? {}, null, 2)}
								rows={4}
								class="font-mono text-xs"
								oninput={(e) => {
									try {
										const props = JSON.parse((e.currentTarget as HTMLTextAreaElement).value);
										updateBlock(block.id, { ...data, props });
									} catch {
										/* ignore invalid JSON while typing */
									}
								}}
							/>
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}

	{#if showJson}
		<div class="border-t border-border pt-3">
			<p class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">JSON</p>
			<JSONViewer data={value} />
		</div>
	{/if}
</div>
