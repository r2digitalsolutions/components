<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';

	export type TerminalLineKind = 'input' | 'stdout' | 'stderr' | 'system';

	export interface TerminalLine {
		id: string;
		kind: TerminalLineKind;
		text: string;
	}

	interface TerminalProps {
		lines?: TerminalLine[];
		prompt?: string;
		disabled?: boolean;
		/** `adaptive` follows light/dark; `contrast` is always a dark console. */
		tone?: 'adaptive' | 'contrast';
		class?: string;
		oncommand?: (command: string) => void;
		onclear?: () => void;
	}

	let {
		lines = $bindable<TerminalLine[]>([]),
		prompt = '$',
		disabled = false,
		tone = 'adaptive',
		class: className = '',
		oncommand,
		onclear
	}: TerminalProps = $props();

	let draft = $state('');
	let scroller = $state<HTMLDivElement | null>(null);
	let hovered = $state(false);

	function uid() {
		return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
	}

	function scrollToBottom() {
		if (!scroller || hovered) return;
		scroller.scrollTop = scroller.scrollHeight;
	}

	$effect(() => {
		lines;
		queueMicrotask(scrollToBottom);
	});

	function submit() {
		const cmd = draft.trim();
		if (!cmd || disabled) return;
		lines = [...lines, { id: uid(), kind: 'input', text: cmd }];
		draft = '';
		oncommand?.(cmd);
	}

	function clear() {
		lines = [];
		onclear?.();
	}
</script>

<div
	class={[
		'terminal flex flex-col overflow-hidden rounded-xl border shadow-sm',
		tone === 'contrast' ? 'terminal--contrast' : 'terminal--adaptive',
		className
	]}
	data-terminal
>
	<div class="terminal-header flex items-center justify-between border-b px-3 py-1.5">
		<div class="flex items-center gap-2">
			<div class="flex items-center gap-1.5" aria-hidden="true">
				<span class="terminal-dot h-2.5 w-2.5 rounded-full"></span>
				<span class="terminal-dot h-2.5 w-2.5 rounded-full opacity-80"></span>
				<span class="terminal-dot h-2.5 w-2.5 rounded-full opacity-60"></span>
			</div>
			<span class="terminal-title text-[11px] font-semibold uppercase tracking-wide">Terminal</span>
		</div>
		<Button size="sm" variant="ghost" class="terminal-clear" onclick={clear}>Clear</Button>
	</div>

	<div
		bind:this={scroller}
		class="max-h-72 min-h-[180px] flex-1 overflow-auto px-3 py-2 font-mono text-xs leading-relaxed"
		onmouseenter={() => (hovered = true)}
		onmouseleave={() => {
			hovered = false;
			queueMicrotask(scrollToBottom);
		}}
	>
		{#each lines as line (line.id)}
			<div class={['terminal-line whitespace-pre-wrap break-all', `terminal-line--${line.kind}`]}>
				{#if line.kind === 'input'}
					<span class="terminal-prompt">{prompt}</span>
					{' '}{line.text}
				{:else}
					{line.text}
				{/if}
			</div>
		{/each}
	</div>

	<form
		class="terminal-footer flex items-center gap-2 border-t px-3 py-2 font-mono text-xs"
		onsubmit={(e) => {
			e.preventDefault();
			submit();
		}}
	>
		<span class="terminal-prompt">{prompt}</span>
		<input
			class="terminal-input min-w-0 flex-1 bg-transparent outline-none"
			bind:value={draft}
			{disabled}
			placeholder="Type a command…"
			autocomplete="off"
			spellcheck={false}
		/>
	</form>
</div>

<style>
	.terminal--adaptive {
		border-color: var(--border);
		background: var(--surface-elevated);
		color: var(--text-primary);
	}

	.terminal--adaptive .terminal-header,
	.terminal--adaptive .terminal-footer {
		border-color: var(--border);
		background: var(--surface-overlay);
	}

	.terminal--adaptive .terminal-title,
	.terminal--adaptive .terminal-prompt {
		color: var(--text-muted);
	}

	.terminal--adaptive :global(.terminal-clear) {
		color: var(--text-muted);
	}
	.terminal--adaptive :global(.terminal-clear:hover) {
		color: var(--text-primary);
	}

	.terminal--adaptive .terminal-dot:nth-child(1) {
		background: #ff5f57;
	}
	.terminal--adaptive .terminal-dot:nth-child(2) {
		background: #febc2e;
	}
	.terminal--adaptive .terminal-dot:nth-child(3) {
		background: #28c840;
	}

	.terminal--adaptive .terminal-line--input {
		color: #059669;
	}
	.terminal--adaptive .terminal-line--stdout {
		color: var(--text-primary);
	}
	.terminal--adaptive .terminal-line--stderr {
		color: #dc2626;
	}
	.terminal--adaptive .terminal-line--system {
		color: var(--text-muted);
	}

	.terminal--adaptive .terminal-input {
		color: var(--text-primary);
	}
	.terminal--adaptive .terminal-input::placeholder {
		color: var(--text-muted);
	}

	:global(.dark) .terminal--adaptive .terminal-line--input {
		color: #6ee7b7;
	}
	:global(.dark) .terminal--adaptive .terminal-line--stderr {
		color: #f87171;
	}

	.terminal--contrast {
		border-color: oklch(30% 0.03 265);
		background: oklch(18% 0.03 265);
		color: oklch(93% 0.01 265);
	}

	.terminal--contrast .terminal-header,
	.terminal--contrast .terminal-footer {
		border-color: oklch(30% 0.03 265);
		background: oklch(15% 0.025 265);
	}

	.terminal--contrast .terminal-title,
	.terminal--contrast .terminal-prompt,
	.terminal--contrast .terminal-line--system {
		color: oklch(62% 0.02 265);
	}

	.terminal--contrast :global(.terminal-clear) {
		color: oklch(70% 0.02 265);
	}
	.terminal--contrast :global(.terminal-clear:hover) {
		color: oklch(93% 0.01 265);
	}

	.terminal--contrast .terminal-dot:nth-child(1) {
		background: #ff5f57;
	}
	.terminal--contrast .terminal-dot:nth-child(2) {
		background: #febc2e;
	}
	.terminal--contrast .terminal-dot:nth-child(3) {
		background: #28c840;
	}

	.terminal--contrast .terminal-line--input {
		color: #6ee7b7;
	}
	.terminal--contrast .terminal-line--stdout {
		color: oklch(93% 0.01 265);
	}
	.terminal--contrast .terminal-line--stderr {
		color: #f87171;
	}

	.terminal--contrast .terminal-input {
		color: oklch(93% 0.01 265);
	}
	.terminal--contrast .terminal-input::placeholder {
		color: oklch(50% 0.02 265);
	}
</style>
