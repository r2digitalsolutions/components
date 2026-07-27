<script lang="ts">
	import Terminal from './Terminal.svelte';
	import type { TerminalLine } from './Terminal.svelte';

	interface Props {
		tone?: 'adaptive' | 'contrast';
	}

	let { tone = 'adaptive' }: Props = $props();

	let lines = $state<TerminalLine[]>([
		{ id: '1', kind: 'system', text: 'Connected to sandbox.' },
		{ id: '2', kind: 'input', text: 'ls' },
		{ id: '3', kind: 'stdout', text: 'README.md\nsrc\npackage.json' }
	]);

	function reply(kind: TerminalLine['kind'], text: string) {
		lines = [...lines, { id: `out-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, kind, text }];
	}

	function oncommand(cmd: string) {
		const [name, ...rest] = cmd.split(/\s+/);
		const args = rest.join(' ');

		if (name === 'help') {
			reply('stdout', 'Commands: help, ls, echo, clear');
			return;
		}
		if (name === 'ls') {
			reply('stdout', 'README.md\nsrc\npackage.json');
			return;
		}
		if (name === 'echo') {
			reply('stdout', args);
			return;
		}
		if (name === 'clear') {
			lines = [];
			return;
		}
		reply('stderr', `command not found: ${name}`);
	}
</script>

<div class="mx-auto max-w-xl p-4">
	<Terminal bind:lines {tone} {oncommand} />
</div>
