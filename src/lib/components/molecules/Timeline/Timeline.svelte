<script lang="ts">
	export interface TimelineItem {
		id: string;
		title: string;
		description?: string;
		timestamp?: string;
		status?: 'default' | 'success' | 'warning' | 'error' | 'info';
	}

	interface TimelineProps {
		items?: TimelineItem[];
		size?: 'sm' | 'md' | 'lg';
		/** Connect dots with a continuous vertical line */
		showConnectors?: boolean;
		class?: string;
	}

	let {
		items = [],
		size = 'md',
		showConnectors = true,
		class: className = ''
	}: TimelineProps = $props();

	const statusDot: Record<NonNullable<TimelineItem['status']>, string> = {
		default: 'bg-brand-500',
		success: 'bg-green-500',
		warning: 'bg-amber-500',
		error: 'bg-red-500',
		info: 'bg-sky-500'
	};

	const sizeClasses = $derived(
		{
			sm: {
				dot: 'h-2 w-2',
				rail: 'w-2',
				title: 'text-xs',
				desc: 'text-xs',
				time: 'text-[11px]',
				gap: 'gap-2.5',
				pad: 'pb-5',
				dotTop: 'mt-1',
				// from current-dot center → next-dot center (extends into following item)
				lineTop: 'top-2',
				lineBottom: '-bottom-2'
			},
			md: {
				dot: 'h-2.5 w-2.5',
				rail: 'w-2.5',
				title: 'text-sm',
				desc: 'text-sm',
				time: 'text-xs',
				gap: 'gap-3',
				pad: 'pb-6',
				dotTop: 'mt-1.5',
				lineTop: 'top-[11px]',
				lineBottom: '-bottom-[11px]'
			},
			lg: {
				dot: 'h-3 w-3',
				rail: 'w-3',
				title: 'text-base',
				desc: 'text-sm',
				time: 'text-sm',
				gap: 'gap-3.5',
				pad: 'pb-8',
				dotTop: 'mt-1.5',
				lineTop: 'top-3',
				lineBottom: '-bottom-3'
			}
		}[size]
	);
</script>

<ol class={['relative flex flex-col overflow-visible', className]}>
	{#each items as item, index (item.id)}
		{@const isLast = index === items.length - 1}
		<li class={['relative flex overflow-visible', sizeClasses.gap]}>
			<!-- Rail stretches full row; connector extends into the next item to meet its dot -->
			<div
				class={[
					'relative flex shrink-0 flex-col items-center self-stretch overflow-visible',
					sizeClasses.rail
				]}
			>
				<span
					class={[
						'relative z-10 shrink-0 rounded-full ring-4 ring-surface',
						sizeClasses.dot,
						sizeClasses.dotTop,
						statusDot[item.status ?? 'default']
					]}
				></span>
				{#if showConnectors && !isLast}
					<span
						class={[
							'absolute left-1/2 z-0 w-0.5 -translate-x-1/2 bg-border',
							sizeClasses.lineTop,
							sizeClasses.lineBottom
						]}
						aria-hidden="true"
					></span>
				{/if}
			</div>

			<div class={['min-w-0 flex-1', !isLast && sizeClasses.pad]}>
				<div class="flex flex-wrap items-baseline justify-between gap-2">
					<p class={['font-medium text-primary', sizeClasses.title]}>{item.title}</p>
					{#if item.timestamp}
						<time class={['text-muted', sizeClasses.time]}>{item.timestamp}</time>
					{/if}
				</div>
				{#if item.description}
					<p class={['mt-0.5 text-secondary', sizeClasses.desc]}>{item.description}</p>
				{/if}
			</div>
		</li>
	{/each}
</ol>
