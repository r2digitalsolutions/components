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
		getBlogComponent,
		listBlogComponents,
		type BlogAlign,
		type BlogBlock,
		type BlogBlockType,
		type BlogCalloutData,
		type BlogCodeData,
		type BlogComponentData,
		type BlogCtaData,
		type BlogDividerData,
		type BlogDocument,
		type BlogEmbedData,
		type BlogGalleryData,
		type BlogHeadingData,
		type BlogHtmlData,
		type BlogImageData,
		type BlogListData,
		type BlogMarkdownData,
		type BlogParagraphData,
		type BlogQuoteData,
		type BlogSpacerData,
		type BlogTableData,
		type BlogVideoData,
		type BlogWidth
	} from '$lib/utils/blogDocument.js';

	export type { BlogDocument, BlogBlock, BlogBlockType };

	interface BlogEditorProps {
		value?: BlogDocument;
		showJson?: boolean;
		showMeta?: boolean;
		compact?: boolean;
		class?: string;
		onchange?: (doc: BlogDocument) => void;
	}

	let {
		value = $bindable(emptyBlogDocument()),
		showJson = true,
		showMeta = true,
		compact = false,
		class: className = '',
		onchange
	}: BlogEditorProps = $props();

	let addMenuOpen = $state(false);
	let componentMenuOpen = $state(false);
	let metaOpen = $state(true);

	const registered = $derived(listBlogComponents());
	const blockGroups = $derived(
		NATIVE_BLOCK_TYPES.reduce(
			(acc, item) => {
				(acc[item.group] ??= []).push(item);
				return acc;
			},
			{} as Record<string, typeof NATIVE_BLOCK_TYPES>
		)
	);

	const ALIGN_OPTS = [
		{ value: 'left', label: 'Left' },
		{ value: 'center', label: 'Center' },
		{ value: 'right', label: 'Right' }
	];
	const WIDTH_OPTS = [
		{ value: 'narrow', label: 'Narrow' },
		{ value: 'content', label: 'Content' },
		{ value: 'wide', label: 'Wide' },
		{ value: 'full', label: 'Full' }
	];

	function emit(next: BlogDocument) {
		value = next;
		onchange?.(next);
	}

	function patchMeta(patch: Partial<BlogDocument>) {
		emit({ ...value, ...patch });
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

	function duplicateBlock(id: string) {
		const idx = value.blocks.findIndex((b) => b.id === id);
		if (idx < 0) return;
		const copy = createBlock(value.blocks[idx].type, {
			...(value.blocks[idx].data as object)
		} as never);
		const blocks = [...value.blocks];
		blocks.splice(idx + 1, 0, copy);
		emit({ ...value, blocks });
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

	function blockLabel(type: string): string {
		return NATIVE_BLOCK_TYPES.find((t) => t.type === type)?.label ?? type;
	}

	function updateComponentProp(blockId: string, data: BlogComponentData, key: string, raw: unknown) {
		updateBlock(blockId, {
			...data,
			props: { ...(data.props ?? {}), [key]: raw }
		});
	}
</script>

<div
	class={[
		'flex flex-col gap-4 border border-border bg-surface-elevated',
		compact ? 'rounded-lg p-3' : 'rounded-xl p-4',
		className
	]}
	data-blog-editor
>
	<div class="flex flex-wrap items-center gap-2">
		<Input
			value={value.title ?? ''}
			placeholder="Post title"
			class="min-w-[12rem] flex-1"
			oninput={(e) => patchMeta({ title: (e.currentTarget as HTMLInputElement).value })}
		/>
		{#if showMeta}
			<Button size="sm" variant="ghost" onclick={() => (metaOpen = !metaOpen)}>
				{metaOpen ? 'Hide meta' : 'Meta'}
			</Button>
		{/if}
		<div class="relative">
			<Button size="sm" variant="secondary" onclick={() => (addMenuOpen = !addMenuOpen)}>
				Add block
			</Button>
			{#if addMenuOpen}
				<div
					class="absolute right-0 z-20 mt-1 max-h-80 w-56 overflow-auto rounded-xl border border-border bg-surface-elevated py-1 shadow-lg"
				>
					{#each Object.entries(blockGroups) as [group, items] (group)}
						<p class="px-3 pb-0.5 pt-2 text-[10px] font-semibold uppercase tracking-wide text-muted">
							{group}
						</p>
						{#each items as item (item.type)}
							<button
								type="button"
								class="block w-full px-3 py-1.5 text-left text-sm text-primary hover:bg-surface-overlay"
								onclick={() => addNative(item.type)}
							>
								{item.label}
							</button>
						{/each}
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
						class="absolute right-0 z-20 mt-1 w-60 overflow-hidden rounded-xl border border-border bg-surface-elevated py-1 shadow-lg"
					>
						{#each registered as item (item.id)}
							<button
								type="button"
								class="block w-full px-3 py-1.5 text-left hover:bg-surface-overlay"
								onclick={() => addComponent(item.id)}
							>
								<span class="block text-sm text-primary">{item.registration.label}</span>
								{#if item.registration.description}
									<span class="block text-[11px] text-muted">{item.registration.description}</span>
								{/if}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	{#if showMeta && metaOpen}
		<div class="grid gap-2 rounded-xl border border-border bg-surface-overlay/30 p-3 sm:grid-cols-2">
			<Input
				value={value.description ?? ''}
				placeholder="Description / deck"
				class="sm:col-span-2"
				oninput={(e) => patchMeta({ description: (e.currentTarget as HTMLInputElement).value })}
			/>
			<Input
				value={value.author ?? ''}
				placeholder="Author"
				oninput={(e) => patchMeta({ author: (e.currentTarget as HTMLInputElement).value })}
			/>
			<Input
				value={value.publishedAt ?? ''}
				placeholder="Published at (ISO or text)"
				oninput={(e) => patchMeta({ publishedAt: (e.currentTarget as HTMLInputElement).value })}
			/>
			<Input
				value={value.coverImage ?? ''}
				placeholder="Cover image URL"
				class="sm:col-span-2"
				oninput={(e) => patchMeta({ coverImage: (e.currentTarget as HTMLInputElement).value })}
			/>
			<Input
				value={(value.tags ?? []).join(', ')}
				placeholder="Tags (comma separated)"
				class="sm:col-span-2"
				oninput={(e) =>
					patchMeta({
						tags: (e.currentTarget as HTMLInputElement).value
							.split(',')
							.map((t) => t.trim())
							.filter(Boolean)
					})}
			/>
		</div>
	{/if}

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
							{blockLabel(block.type)}
						</span>
						<div class="flex items-center gap-1">
							<Button
								size="sm"
								variant="ghost"
								disabled={i === 0}
								onclick={() => moveBlock(block.id, -1)}
							>
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
							<Button size="sm" variant="ghost" onclick={() => duplicateBlock(block.id)}>
								Duplicate
							</Button>
							<Button size="sm" variant="ghost" onclick={() => removeBlock(block.id)}>
								Remove
							</Button>
						</div>
					</div>

					{#if block.type === 'heading'}
						{@const data = block.data as BlogHeadingData}
						<div class="flex flex-col gap-2">
							<div class="flex flex-wrap gap-2">
								<Select
									value={String(data.level)}
									options={[
										{ value: '1', label: 'H1' },
										{ value: '2', label: 'H2' },
										{ value: '3', label: 'H3' },
										{ value: '4', label: 'H4' }
									]}
									onchange={(v) =>
										updateBlock(block.id, {
											...data,
											level: Number(v) as BlogHeadingData['level']
										})}
									class="w-24"
								/>
								<Select
									value={data.align ?? 'left'}
									options={ALIGN_OPTS}
									onchange={(v) => updateBlock(block.id, { ...data, align: v as BlogAlign })}
									class="w-28"
								/>
								<Input
									value={data.anchor ?? ''}
									placeholder="Anchor id"
									class="w-36"
									oninput={(e) =>
										updateBlock(block.id, {
											...data,
											anchor: (e.currentTarget as HTMLInputElement).value
										})}
								/>
							</div>
							<Input
								value={data.text}
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										text: (e.currentTarget as HTMLInputElement).value
									})}
							/>
						</div>
					{:else if block.type === 'paragraph'}
						{@const data = block.data as BlogParagraphData}
						<div class="flex flex-col gap-2">
							<div class="flex flex-wrap items-center gap-3">
								<Select
									value={data.align ?? 'left'}
									options={ALIGN_OPTS}
									onchange={(v) => updateBlock(block.id, { ...data, align: v as BlogAlign })}
									class="w-28"
								/>
								<label class="flex items-center gap-1.5 text-xs text-muted">
									<input
										type="checkbox"
										checked={!!data.lead}
										onchange={(e) =>
											updateBlock(block.id, {
												...data,
												lead: (e.currentTarget as HTMLInputElement).checked
											})}
									/>
									Lead
								</label>
								<label class="flex items-center gap-1.5 text-xs text-muted">
									<input
										type="checkbox"
										checked={!!data.muted}
										onchange={(e) =>
											updateBlock(block.id, {
												...data,
												muted: (e.currentTarget as HTMLInputElement).checked
											})}
									/>
									Muted
								</label>
							</div>
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
					{:else if block.type === 'image'}
						{@const data = block.data as BlogImageData}
						<div class="grid gap-2 sm:grid-cols-2">
							<Input
								value={data.src}
								placeholder="Image URL"
								class="sm:col-span-2"
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
							<Input
								value={data.caption ?? ''}
								placeholder="Caption"
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										caption: (e.currentTarget as HTMLInputElement).value
									})}
							/>
							<Input
								value={data.href ?? ''}
								placeholder="Link URL (optional)"
								class="sm:col-span-2"
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										href: (e.currentTarget as HTMLInputElement).value
									})}
							/>
							<Select
								value={data.align ?? 'center'}
								options={ALIGN_OPTS}
								onchange={(v) => updateBlock(block.id, { ...data, align: v as BlogAlign })}
							/>
							<Select
								value={data.width ?? 'content'}
								options={WIDTH_OPTS}
								onchange={(v) => updateBlock(block.id, { ...data, width: v as BlogWidth })}
							/>
							<label class="flex items-center gap-1.5 text-xs text-muted">
								<input
									type="checkbox"
									checked={data.rounded !== false}
									onchange={(e) =>
										updateBlock(block.id, {
											...data,
											rounded: (e.currentTarget as HTMLInputElement).checked
										})}
								/>
								Rounded
							</label>
							<label class="flex items-center gap-1.5 text-xs text-muted">
								<input
									type="checkbox"
									checked={!!data.shadow}
									onchange={(e) =>
										updateBlock(block.id, {
											...data,
											shadow: (e.currentTarget as HTMLInputElement).checked
										})}
								/>
								Shadow
							</label>
						</div>
					{:else if block.type === 'code'}
						{@const data = block.data as BlogCodeData}
						<div class="flex flex-col gap-2">
							<div class="flex flex-wrap gap-2">
								<Input
									value={data.language ?? ''}
									placeholder="Language"
									class="w-36"
									oninput={(e) =>
										updateBlock(block.id, {
											...data,
											language: (e.currentTarget as HTMLInputElement).value
										})}
								/>
								<Input
									value={data.filename ?? ''}
									placeholder="Filename"
									class="flex-1"
									oninput={(e) =>
										updateBlock(block.id, {
											...data,
											filename: (e.currentTarget as HTMLInputElement).value
										})}
								/>
								<label class="flex items-center gap-1.5 text-xs text-muted">
									<input
										type="checkbox"
										checked={!!data.showLineNumbers}
										onchange={(e) =>
											updateBlock(block.id, {
												...data,
												showLineNumbers: (e.currentTarget as HTMLInputElement).checked
											})}
									/>
									Line numbers
								</label>
							</div>
							<Input
								value={data.highlightLines ?? ''}
								placeholder="Highlight lines (e.g. 1,3-5)"
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										highlightLines: (e.currentTarget as HTMLInputElement).value
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
							<div class="flex flex-wrap gap-2">
								<Select
									value={data.tone ?? 'info'}
									options={[
										{ value: 'info', label: 'Info' },
										{ value: 'success', label: 'Success' },
										{ value: 'warning', label: 'Warning' },
										{ value: 'danger', label: 'Danger' },
										{ value: 'neutral', label: 'Neutral' }
									]}
									onchange={(v) =>
										updateBlock(block.id, {
											...data,
											tone: v as BlogCalloutData['tone']
										})}
									class="w-36"
								/>
								<label class="flex items-center gap-1.5 text-xs text-muted">
									<input
										type="checkbox"
										checked={!!data.collapsible}
										onchange={(e) =>
											updateBlock(block.id, {
												...data,
												collapsible: (e.currentTarget as HTMLInputElement).checked
											})}
									/>
									Collapsible
								</label>
							</div>
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
							<Select
								value={data.align ?? 'left'}
								options={ALIGN_OPTS}
								onchange={(v) => updateBlock(block.id, { ...data, align: v as BlogAlign })}
								class="w-28"
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
							<div class="flex gap-2">
								<Input
									value={data.cite ?? ''}
									placeholder="Author"
									class="flex-1"
									oninput={(e) =>
										updateBlock(block.id, {
											...data,
											cite: (e.currentTarget as HTMLInputElement).value
										})}
								/>
								<Input
									value={data.role ?? ''}
									placeholder="Role"
									class="flex-1"
									oninput={(e) =>
										updateBlock(block.id, {
											...data,
											role: (e.currentTarget as HTMLInputElement).value
										})}
								/>
							</div>
						</div>
					{:else if block.type === 'list'}
						{@const data = block.data as BlogListData}
						<div class="flex flex-col gap-2">
							<div class="flex flex-wrap items-center gap-3">
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
									Ordered
								</label>
								<label class="flex items-center gap-2 text-xs text-muted">
									<input
										type="checkbox"
										checked={!!data.tight}
										onchange={(e) =>
											updateBlock(block.id, {
												...data,
												tight: (e.currentTarget as HTMLInputElement).checked
											})}
									/>
									Tight
								</label>
								{#if data.ordered}
									<Input
										type="number"
										value={String(data.start ?? 1)}
										placeholder="Start"
										class="w-24"
										oninput={(e) =>
											updateBlock(block.id, {
												...data,
												start: Number((e.currentTarget as HTMLInputElement).value) || 1
											})}
									/>
								{/if}
							</div>
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
						{@const data = block.data as BlogDividerData}
						<div class="flex flex-wrap gap-2">
							<Select
								value={data.style ?? 'solid'}
								options={[
									{ value: 'solid', label: 'Solid' },
									{ value: 'dashed', label: 'Dashed' },
									{ value: 'dotted', label: 'Dotted' }
								]}
								onchange={(v) =>
									updateBlock(block.id, {
										...data,
										style: v as BlogDividerData['style']
									})}
								class="w-32"
							/>
							<Select
								value={data.spacing ?? 'md'}
								options={[
									{ value: 'sm', label: 'Spacing S' },
									{ value: 'md', label: 'Spacing M' },
									{ value: 'lg', label: 'Spacing L' }
								]}
								onchange={(v) =>
									updateBlock(block.id, {
										...data,
										spacing: v as BlogDividerData['spacing']
									})}
								class="w-32"
							/>
							<Input
								value={data.label ?? ''}
								placeholder="Optional label"
								class="flex-1"
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										label: (e.currentTarget as HTMLInputElement).value
									})}
							/>
						</div>
					{:else if block.type === 'video'}
						{@const data = block.data as BlogVideoData}
						<div class="grid gap-2 sm:grid-cols-2">
							<Input
								value={data.src}
								placeholder="Video URL"
								class="sm:col-span-2"
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										src: (e.currentTarget as HTMLInputElement).value
									})}
							/>
							<Input
								value={data.poster ?? ''}
								placeholder="Poster image"
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										poster: (e.currentTarget as HTMLInputElement).value
									})}
							/>
							<Input
								value={data.caption ?? ''}
								placeholder="Caption"
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										caption: (e.currentTarget as HTMLInputElement).value
									})}
							/>
							<Select
								value={data.align ?? 'center'}
								options={ALIGN_OPTS}
								onchange={(v) => updateBlock(block.id, { ...data, align: v as BlogAlign })}
							/>
							<Select
								value={data.width ?? 'content'}
								options={WIDTH_OPTS}
								onchange={(v) => updateBlock(block.id, { ...data, width: v as BlogWidth })}
							/>
							<label class="flex items-center gap-1.5 text-xs text-muted">
								<input
									type="checkbox"
									checked={data.controls !== false}
									onchange={(e) =>
										updateBlock(block.id, {
											...data,
											controls: (e.currentTarget as HTMLInputElement).checked
										})}
								/>
								Controls
							</label>
							<label class="flex items-center gap-1.5 text-xs text-muted">
								<input
									type="checkbox"
									checked={!!data.autoplay}
									onchange={(e) =>
										updateBlock(block.id, {
											...data,
											autoplay: (e.currentTarget as HTMLInputElement).checked
										})}
								/>
								Autoplay
							</label>
							<label class="flex items-center gap-1.5 text-xs text-muted">
								<input
									type="checkbox"
									checked={!!data.loop}
									onchange={(e) =>
										updateBlock(block.id, {
											...data,
											loop: (e.currentTarget as HTMLInputElement).checked
										})}
								/>
								Loop
							</label>
							<label class="flex items-center gap-1.5 text-xs text-muted">
								<input
									type="checkbox"
									checked={!!data.muted}
									onchange={(e) =>
										updateBlock(block.id, {
											...data,
											muted: (e.currentTarget as HTMLInputElement).checked
										})}
								/>
								Muted
							</label>
						</div>
					{:else if block.type === 'embed'}
						{@const data = block.data as BlogEmbedData}
						<div class="grid gap-2 sm:grid-cols-2">
							<Input
								value={data.url}
								placeholder="YouTube / Vimeo / iframe URL"
								class="sm:col-span-2"
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										url: (e.currentTarget as HTMLInputElement).value
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
							<Select
								value={data.aspectRatio ?? '16:9'}
								options={[
									{ value: '16:9', label: '16:9' },
									{ value: '4:3', label: '4:3' },
									{ value: '1:1', label: '1:1' },
									{ value: '9:16', label: '9:16' }
								]}
								onchange={(v) =>
									updateBlock(block.id, {
										...data,
										aspectRatio: v as BlogEmbedData['aspectRatio']
									})}
							/>
							<Input
								value={data.caption ?? ''}
								placeholder="Caption"
								class="sm:col-span-2"
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										caption: (e.currentTarget as HTMLInputElement).value
									})}
							/>
						</div>
					{:else if block.type === 'gallery'}
						{@const data = block.data as BlogGalleryData}
						<div class="flex flex-col gap-2">
							<div class="flex flex-wrap gap-2">
								<Select
									value={String(data.columns ?? 3)}
									options={[
										{ value: '2', label: '2 cols' },
										{ value: '3', label: '3 cols' },
										{ value: '4', label: '4 cols' }
									]}
									onchange={(v) =>
										updateBlock(block.id, {
											...data,
											columns: Number(v) as BlogGalleryData['columns']
										})}
									class="w-28"
								/>
								<Select
									value={data.gap ?? 'md'}
									options={[
										{ value: 'sm', label: 'Gap S' },
										{ value: 'md', label: 'Gap M' },
										{ value: 'lg', label: 'Gap L' }
									]}
									onchange={(v) =>
										updateBlock(block.id, {
											...data,
											gap: v as BlogGalleryData['gap']
										})}
									class="w-28"
								/>
								<label class="flex items-center gap-1.5 text-xs text-muted">
									<input
										type="checkbox"
										checked={data.rounded !== false}
										onchange={(e) =>
											updateBlock(block.id, {
												...data,
												rounded: (e.currentTarget as HTMLInputElement).checked
											})}
									/>
									Rounded
								</label>
							</div>
							<Textarea
								value={data.images.map((img) => img.src).join('\n')}
								rows={4}
								placeholder="One image URL per line"
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										images: (e.currentTarget as HTMLTextAreaElement).value
											.split('\n')
											.map((src) => ({ src: src.trim(), alt: '' }))
											.filter((img) => img.src.length >= 0)
									})}
							/>
						</div>
					{:else if block.type === 'table'}
						{@const data = block.data as BlogTableData}
						<div class="flex flex-col gap-2">
							<div class="flex flex-wrap items-center gap-3">
								<label class="flex items-center gap-1.5 text-xs text-muted">
									<input
										type="checkbox"
										checked={data.striped !== false}
										onchange={(e) =>
											updateBlock(block.id, {
												...data,
												striped: (e.currentTarget as HTMLInputElement).checked
											})}
									/>
									Striped
								</label>
								<label class="flex items-center gap-1.5 text-xs text-muted">
									<input
										type="checkbox"
										checked={!!data.compact}
										onchange={(e) =>
											updateBlock(block.id, {
												...data,
												compact: (e.currentTarget as HTMLInputElement).checked
											})}
									/>
									Compact
								</label>
								<Input
									value={data.caption ?? ''}
									placeholder="Caption"
									class="flex-1"
									oninput={(e) =>
										updateBlock(block.id, {
											...data,
											caption: (e.currentTarget as HTMLInputElement).value
										})}
								/>
							</div>
							<Input
								value={data.headers.join(' | ')}
								placeholder="Headers separated by |"
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										headers: (e.currentTarget as HTMLInputElement).value
											.split('|')
											.map((h) => h.trim())
									})}
							/>
							<Textarea
								value={data.rows.map((r) => r.join(' | ')).join('\n')}
								rows={4}
								placeholder={'Rows: cell | cell\none row per line'}
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										rows: (e.currentTarget as HTMLTextAreaElement).value
											.split('\n')
											.map((line) => line.split('|').map((c) => c.trim()))
									})}
							/>
						</div>
					{:else if block.type === 'cta'}
						{@const data = block.data as BlogCtaData}
						<div class="grid gap-2 sm:grid-cols-2">
							<Input
								value={data.label}
								placeholder="Button label"
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										label: (e.currentTarget as HTMLInputElement).value
									})}
							/>
							<Input
								value={data.href ?? ''}
								placeholder="Href"
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										href: (e.currentTarget as HTMLInputElement).value
									})}
							/>
							<Select
								value={data.variant ?? 'primary'}
								options={[
									{ value: 'primary', label: 'Primary' },
									{ value: 'secondary', label: 'Secondary' },
									{ value: 'ghost', label: 'Ghost' },
									{ value: 'outline', label: 'Outline' }
								]}
								onchange={(v) =>
									updateBlock(block.id, {
										...data,
										variant: v as BlogCtaData['variant']
									})}
							/>
							<Select
								value={data.align ?? 'center'}
								options={ALIGN_OPTS}
								onchange={(v) => updateBlock(block.id, { ...data, align: v as BlogAlign })}
							/>
							<Input
								value={data.subtitle ?? ''}
								placeholder="Subtitle"
								class="sm:col-span-2"
								oninput={(e) =>
									updateBlock(block.id, {
										...data,
										subtitle: (e.currentTarget as HTMLInputElement).value
									})}
							/>
							<label class="flex items-center gap-1.5 text-xs text-muted">
								<input
									type="checkbox"
									checked={!!data.openInNewTab}
									onchange={(e) =>
										updateBlock(block.id, {
											...data,
											openInNewTab: (e.currentTarget as HTMLInputElement).checked
										})}
								/>
								Open in new tab
							</label>
						</div>
					{:else if block.type === 'spacer'}
						{@const data = block.data as BlogSpacerData}
						<Select
							value={data.size ?? 'md'}
							options={[
								{ value: 'xs', label: 'XS' },
								{ value: 'sm', label: 'S' },
								{ value: 'md', label: 'M' },
								{ value: 'lg', label: 'L' },
								{ value: 'xl', label: 'XL' }
							]}
							onchange={(v) =>
								updateBlock(block.id, {
									...data,
									size: v as BlogSpacerData['size']
								})}
							class="w-32"
						/>
					{:else if block.type === 'html'}
						{@const data = block.data as BlogHtmlData}
						<Textarea
							value={data.html}
							rows={5}
							class="font-mono text-xs"
							placeholder="<div>...</div>"
							oninput={(e) =>
								updateBlock(block.id, {
									...data,
									html: (e.currentTarget as HTMLTextAreaElement).value
								})}
						/>
					{:else if block.type === 'component'}
						{@const data = block.data as BlogComponentData}
						{@const reg = getBlogComponent(data.componentId)}
						<div class="flex flex-col gap-2">
							<p class="text-xs text-muted">
								Component: <code>{data.componentId}</code>
								{#if reg?.description}
									— {reg.description}
								{/if}
							</p>
							{#if reg?.propFields?.length}
								<div class="grid gap-2 sm:grid-cols-2">
									{#each reg.propFields as field (field.key)}
										{#if field.type === 'boolean'}
											<label class="flex items-center gap-1.5 text-xs text-muted sm:col-span-2">
												<input
													type="checkbox"
													checked={Boolean(data.props?.[field.key])}
													onchange={(e) =>
														updateComponentProp(
															block.id,
															data,
															field.key,
															(e.currentTarget as HTMLInputElement).checked
														)}
												/>
												{field.label}
											</label>
										{:else if field.type === 'select' && field.options}
											<div class="flex flex-col gap-1">
												<span class="text-[11px] text-muted">{field.label}</span>
												<Select
													value={String(data.props?.[field.key] ?? '')}
													options={field.options}
													onchange={(v) => updateComponentProp(block.id, data, field.key, v)}
												/>
											</div>
										{:else if field.type === 'textarea'}
											<div class="flex flex-col gap-1 sm:col-span-2">
												<span class="text-[11px] text-muted">{field.label}</span>
												<Textarea
													value={String(data.props?.[field.key] ?? '')}
													rows={3}
													placeholder={field.placeholder}
													oninput={(e) =>
														updateComponentProp(
															block.id,
															data,
															field.key,
															(e.currentTarget as HTMLTextAreaElement).value
														)}
												/>
											</div>
										{:else if field.type === 'number'}
											<div class="flex flex-col gap-1">
												<span class="text-[11px] text-muted">{field.label}</span>
												<Input
													type="number"
													value={String(data.props?.[field.key] ?? '')}
													placeholder={field.placeholder}
													oninput={(e) =>
														updateComponentProp(
															block.id,
															data,
															field.key,
															Number((e.currentTarget as HTMLInputElement).value)
														)}
												/>
											</div>
										{:else}
											<div class="flex flex-col gap-1">
												<span class="text-[11px] text-muted">{field.label}</span>
												{#if field.type === 'color'}
													<input
														type="color"
														class="h-9 w-full cursor-pointer rounded-md border border-border bg-surface"
														value={String(data.props?.[field.key] ?? '#0ea5e9')}
														oninput={(e) =>
															updateComponentProp(
																block.id,
																data,
																field.key,
																(e.currentTarget as HTMLInputElement).value
															)}
													/>
												{:else}
													<Input
														value={String(data.props?.[field.key] ?? '')}
														placeholder={field.placeholder}
														oninput={(e) =>
															updateComponentProp(
																block.id,
																data,
																field.key,
																(e.currentTarget as HTMLInputElement).value
															)}
													/>
												{/if}
											</div>
										{/if}
									{/each}
								</div>
							{:else}
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
							{/if}
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
