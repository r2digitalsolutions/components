<script lang="ts">
	export interface TocItem {
		id: string;
		label: string;
		depth?: number;
	}

	type TocVariant = 'rail' | 'soft' | 'plain';
	type TocSize = 'sm' | 'md';

	interface TableOfContentsProps {
		items?: TocItem[];
		activeId?: string;
		title?: string;
		variant?: TocVariant;
		size?: TocSize;
		/** Show 01, 02… for top-level items */
		numbered?: boolean;
		/** Keep the title pinned while the link list scrolls */
		stickyTitle?: boolean;
		/** Enable IntersectionObserver scroll-spy */
		scrollSpy?: boolean;
		/** CSS selector for scroll container (default: viewport) */
		scrollRoot?: string;
		class?: string;
		onchange?: (id: string) => void;
	}

	let {
		items = [],
		activeId = $bindable(''),
		title = 'On this page',
		variant = 'rail',
		size = 'md',
		numbered = false,
		stickyTitle = true,
		scrollSpy = true,
		scrollRoot,
		class: className = '',
		onchange
	}: TableOfContentsProps = $props();

	let listEl = $state<HTMLUListElement | null>(null);
	let indicator = $state({ top: 0, height: 0, visible: false });

	const activeIndex = $derived(items.findIndex((i) => i.id === activeId));

	function depthOf(item: TocItem) {
		return Math.max(1, item.depth ?? 1);
	}

	function topLevelNumber(index: number) {
		return items.slice(0, index + 1).filter((x) => depthOf(x) === 1).length;
	}

	function resolveRoot(): HTMLElement | null {
		if (!scrollRoot || typeof document === 'undefined') return null;
		const el = document.querySelector(scrollRoot);
		return el instanceof HTMLElement ? el : null;
	}

	function scrollTo(id: string) {
		activeId = id;
		onchange?.(id);
		const target = document.getElementById(id);
		if (!target) return;

		const root = resolveRoot();
		if (root) {
			const rootRect = root.getBoundingClientRect();
			const targetRect = target.getBoundingClientRect();
			root.scrollTo({
				top: root.scrollTop + (targetRect.top - rootRect.top) - 12,
				behavior: 'smooth'
			});
			return;
		}

		target.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function updateIndicator() {
		if (!listEl || activeIndex < 0 || variant === 'plain') {
			indicator = { top: 0, height: 0, visible: false };
			return;
		}
		const btn = listEl.querySelector<HTMLElement>(`[data-toc-id="${items[activeIndex].id}"]`);
		if (!btn) {
			indicator = { ...indicator, visible: false };
			return;
		}
		indicator = {
			top: btn.offsetTop,
			height: btn.offsetHeight,
			visible: true
		};
	}

	$effect(() => {
		activeId;
		items;
		variant;
		queueMicrotask(updateIndicator);
	});

	$effect(() => {
		if (!scrollSpy || typeof window === 'undefined' || !items.length) return;

		const elements = items
			.map((item) => document.getElementById(item.id))
			.filter((el): el is HTMLElement => !!el);

		if (!elements.length) return;

		const root = resolveRoot();

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
				const topMost = visible[0]?.target?.id;
				if (topMost) activeId = topMost;
			},
			{
				root,
				rootMargin: root ? '-8% 0px -60% 0px' : '-15% 0px -65% 0px',
				threshold: [0, 0.1, 0.25]
			}
		);

		for (const el of elements) observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<nav
	class={['flex w-full min-h-0 flex-col', className]}
	aria-label={title || 'Table of contents'}
>
	{#if title}
		<p
			class={[
				'shrink-0 pb-3 font-semibold tracking-wide text-muted',
				size === 'sm' ? 'text-[10px] uppercase' : 'text-xs uppercase',
				stickyTitle && 'sticky top-0 z-10 bg-surface/95 backdrop-blur-sm'
			]}
		>
			{title}
		</p>
	{/if}

	<div class="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
		{#if variant === 'rail'}
			<div class="absolute inset-y-0 left-0 w-px bg-border" aria-hidden="true"></div>
			{#if indicator.visible}
				<div
					class="absolute left-0 w-0.5 rounded-full bg-brand-500 transition-all duration-200 ease-out"
					style:top="{indicator.top}px"
					style:height="{indicator.height}px"
					aria-hidden="true"
				></div>
			{/if}
		{/if}

		<ul bind:this={listEl} class="relative flex flex-col gap-0.5 pb-1">
			{#each items as item, i (item.id)}
				{@const depth = depthOf(item)}
				{@const active = activeId === item.id}
				{@const isTop = depth === 1}
				<li>
					<button
						type="button"
						data-toc-id={item.id}
						onclick={() => scrollTo(item.id)}
						class={[
							'group flex w-full items-start gap-2 rounded-lg text-left transition-colors',
							'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
							size === 'sm' ? 'py-1 text-xs' : 'py-1.5 text-sm',
							variant === 'rail' && (depth > 1 ? 'pl-7 pr-2' : 'pl-3.5 pr-2'),
							variant === 'soft' && (depth > 1 ? 'px-3 pl-6' : 'px-3'),
							variant === 'plain' && (depth > 1 ? 'pl-4' : 'pl-0'),
							variant === 'soft' &&
								active &&
								'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300',
							variant === 'soft' && !active && 'text-secondary hover:bg-surface-overlay hover:text-primary',
							variant !== 'soft' && active && 'font-medium text-brand-600 dark:text-brand-400',
							variant !== 'soft' && !active && 'text-secondary hover:text-primary'
						]}
						aria-current={active ? 'location' : undefined}
					>
						{#if numbered && isTop}
							<span
								class={[
									'shrink-0 tabular-nums',
									size === 'sm' ? 'w-4 text-[10px]' : 'w-5 text-xs',
									active ? 'text-brand-500' : 'text-muted group-hover:text-secondary'
								]}
							>
								{String(topLevelNumber(i)).padStart(2, '0')}
							</span>
						{/if}
						<span class="min-w-0 leading-snug">{item.label}</span>
					</button>
				</li>
			{/each}
		</ul>
	</div>
</nav>
