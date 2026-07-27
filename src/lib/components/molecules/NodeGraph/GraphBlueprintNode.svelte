<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import {
		formatPortLiteral,
		isDataPort,
		isExecPort,
		parsePortLiteral,
		pinColor,
		type BlueprintFlowNodeData,
		type GraphPort
	} from '$lib/utils/nodeGraph.js';

	type Props = NodeProps & {
		data: BlueprintFlowNodeData;
	};

	let { data, selected }: Props = $props();

	/** Must match .bp-node__title height — handles are positioned from the NODE root. */
	const HEADER_H = 32;
	const ROW_H = 24;
	const BODY_PAD = 6;

	const isComment = $derived(data.graphType === 'comment');
	const isReroute = $derived(data.graphType === 'reroute');
	const isVarGet = $derived(data.graphType === 'var_get');
	const isVarSet = $derived(data.graphType === 'var_set');
	const color = $derived(data.color ?? '#64748b');
	const inputs = $derived(data.inputs ?? []);
	const outputs = $derived(data.outputs ?? []);
	const wired = $derived(new Set(data._wiredInputs ?? []));
	const rowCount = $derived(Math.max(inputs.length, outputs.length, 1));
	const bodyH = $derived(BODY_PAD * 2 + rowCount * ROW_H);
	const nodeW = $derived(
		data.width ??
			(isVarGet
				? Math.max(128, String(data.label ?? '').length * 8 + 64)
				: Math.max(240, 180 + Math.max(inputs.length, outputs.length) * 16))
	);
	const commentW = $derived(data.width ?? 220);
	const commentH = $derived(data.height ?? 100);

	function handleTop(index: number): number {
		return HEADER_H + BODY_PAD + index * ROW_H + ROW_H / 2;
	}

	function handleStyle(port: GraphPort, index: number): string {
		const fill = isExecPort(port) ? 'background:#e2e8f0;' : `background:${pinColor(port)};`;
		return `top:${handleTop(index)}px;${fill}`;
	}

	function labelOf(port: GraphPort | undefined): string {
		if (!port) return '';
		const t = port.label ?? port.id;
		return t === '' ? '' : t;
	}

	function showLiteral(port: GraphPort | undefined): boolean {
		if (!port || !isDataPort(port)) return false;
		return !wired.has(port.id);
	}

	function onLiteralInput(port: GraphPort, event: Event) {
		const el = event.currentTarget as HTMLInputElement;
		const next =
			port.dataType === 'bool' ? el.checked : parsePortLiteral(port, el.value);
		data._onLiteral?.(port.id, next);
	}

	function onLiteralKeydown(event: KeyboardEvent) {
		// Keep typing from deleting the node / bubbling to the graph.
		event.stopPropagation();
	}
</script>

{#if isReroute}
	{@const port = inputs[0] ?? outputs[0]}
	{@const fill = port && isExecPort(port) ? '#e2e8f0' : pinColor(port ?? { id: 'p', dataType: 'any' })}
	<div class={['bp-reroute', selected ? 'bp-reroute--selected' : '']}>
		<span class="bp-reroute__dot" style={`background:${fill}`}></span>
		{#each inputs as inn (inn.id)}
			<Handle
				id={inn.id}
				type="target"
				position={Position.Left}
				class={['bp-handle', isExecPort(inn) ? 'bp-handle--exec' : 'bp-handle--data']}
				style={`top:50%;${isExecPort(inn) ? 'background:#e2e8f0;' : `background:${pinColor(inn)};`}`}
			/>
		{/each}
		{#each outputs as out (out.id)}
			<Handle
				id={out.id}
				type="source"
				position={Position.Right}
				class={['bp-handle', isExecPort(out) ? 'bp-handle--exec' : 'bp-handle--data']}
				style={`top:50%;${isExecPort(out) ? 'background:#e2e8f0;' : `background:${pinColor(out)};`}`}
			/>
		{/each}
	</div>
{:else if isComment}
	<div
		class={[
			'bp-comment',
			selected ? 'bp-comment--selected' : ''
		]}
		style={`width:${commentW}px;min-height:${commentH}px;background:${data.commentColor ?? 'rgba(251,191,36,0.22)'}`}
	>
		<p class="bp-comment__tag">Comment</p>
		<p class="bp-comment__label">{data.label ?? 'Comment'}</p>
	</div>
{:else}
	<div class={['bp-node', selected ? 'bp-node--selected' : '']} style={`width:${nodeW}px;`}>
		<div class="bp-node__title" style={`background:${color};`}>
			{#if isVarGet || isVarSet}
				<span class="bp-node__badge">{isVarGet ? 'Get' : 'Set'}</span>
			{/if}
			<span class="bp-node__title-text">{data.label ?? data.graphType}</span>
			{#if data._alert}
				<span class="text-amber-200" title="Needs attention">
					<AlertTriangle class="h-3.5 w-3.5" strokeWidth={2.5} />
				</span>
			{/if}
		</div>

		<div class="bp-node__body" style={`height:${bodyH}px;padding-block:${BODY_PAD}px;`}>
			{#each Array.from({ length: rowCount }, (_, i) => i) as i (i)}
				{@const inn = inputs[i]}
				{@const out = outputs[i]}
				<div class="bp-node__row" style={`height:${ROW_H}px;`}>
					<div class="bp-node__cell bp-node__cell--in">
						{#if inn}
							{#if labelOf(inn)}
								<span
									class="bp-node__label"
									class:bp-node__label--exec={isExecPort(inn)}
									style={isExecPort(inn) ? undefined : `color:${pinColor(inn)}`}
								>
									{labelOf(inn)}
								</span>
							{/if}
							{#if showLiteral(inn)}
								{#if inn.dataType === 'bool'}
									<input
										type="checkbox"
										class="bp-node__literal bp-node__literal--bool nodrag nopan"
										checked={Boolean(inn.value)}
										onchange={(e) => onLiteralInput(inn, e)}
										onkeydown={onLiteralKeydown}
										onclick={(e) => e.stopPropagation()}
										title="Literal value"
									/>
								{:else if inn.dataType === 'int' || inn.dataType === 'float'}
									<input
										type="number"
										step={inn.dataType === 'float' ? 'any' : '1'}
										class="bp-node__literal nodrag nopan"
										value={formatPortLiteral(inn)}
										oninput={(e) => onLiteralInput(inn, e)}
										onkeydown={onLiteralKeydown}
										onclick={(e) => e.stopPropagation()}
										title="Literal value"
									/>
								{:else}
									<input
										type="text"
										class="bp-node__literal nodrag nopan"
										value={formatPortLiteral(inn)}
										placeholder="…"
										oninput={(e) => onLiteralInput(inn, e)}
										onkeydown={onLiteralKeydown}
										onclick={(e) => e.stopPropagation()}
										title="Literal value"
									/>
								{/if}
							{/if}
						{/if}
					</div>
					<div class="bp-node__cell bp-node__cell--out">
						{#if out && labelOf(out)}
							<span
								class="bp-node__label"
								class:bp-node__label--exec={isExecPort(out)}
								style={isExecPort(out) ? undefined : `color:${pinColor(out)}`}
							>
								{labelOf(out)}
							</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		{#each inputs as port, i (port.id)}
			<Handle
				type="target"
				id={port.id}
				position={Position.Left}
				class={['bp-handle', isExecPort(port) ? 'bp-handle--exec' : 'bp-handle--data']}
				style={handleStyle(port, i)}
				title={`${labelOf(port) || port.id} (${port.dataType ?? port.kind ?? 'any'})`}
			>
				{#if isExecPort(port)}
					<svg viewBox="0 0 10 10" class="bp-handle__play" aria-hidden="true">
						<polygon points="2,1 9,5 2,9" fill="currentColor" />
					</svg>
				{/if}
			</Handle>
		{/each}

		{#each outputs as port, i (port.id)}
			<Handle
				type="source"
				id={port.id}
				position={Position.Right}
				class={['bp-handle', isExecPort(port) ? 'bp-handle--exec' : 'bp-handle--data']}
				style={handleStyle(port, i)}
				title={`${labelOf(port) || port.id} (${port.dataType ?? port.kind ?? 'any'})`}
			>
				{#if isExecPort(port)}
					<svg viewBox="0 0 10 10" class="bp-handle__play" aria-hidden="true">
						<polygon points="2,1 9,5 2,9" fill="currentColor" />
					</svg>
				{/if}
			</Handle>
		{/each}
	</div>
{/if}

<style>
	.bp-comment {
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		border: 1px dashed rgba(245, 158, 11, 0.55);
		border-radius: 2px;
		padding: 8px 10px;
		pointer-events: all;
	}
	.bp-comment--selected {
		border-color: #f59e0b;
		box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.28);
	}
	.bp-comment__tag {
		margin: 0;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: rgba(120, 53, 15, 0.75);
	}
	.bp-comment__label {
		margin: 2px 0 0;
		font-size: 13px;
		font-weight: 600;
		color: #422006;
	}
	.bp-reroute {
		position: relative;
		width: 16px;
		height: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.bp-reroute__dot {
		width: 10px;
		height: 10px;
		border-radius: 999px;
		border: 1.5px solid #fff;
		box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.2);
	}
	.bp-reroute--selected .bp-reroute__dot {
		box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.55);
	}
	.bp-node {
		position: relative;
		box-sizing: border-box;
		overflow: visible;
		border: 1px solid var(--bp-node-border, #d4d4d8);
		border-radius: 2px;
		background: var(--bp-node-bg, #ffffff);
		box-shadow: 0 2px 10px rgba(15, 23, 42, 0.08);
	}
	.bp-node--selected {
		border-color: #0ea5e9;
		box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.28);
	}
	.bp-node__title {
		display: flex;
		align-items: center;
		gap: 6px;
		height: 32px;
		padding: 0 8px;
		border-radius: 1px 1px 0 0;
	}
	.bp-node__badge {
		flex-shrink: 0;
		border-radius: 2px;
		background: rgba(0, 0, 0, 0.28);
		padding: 1px 5px;
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.95);
	}
	.bp-node__title-text {
		min-width: 0;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 12px;
		font-weight: 600;
		color: #fff;
	}
	.bp-node__body {
		box-sizing: border-box;
	}
	.bp-node__row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		width: 100%;
	}
	.bp-node__cell {
		display: flex;
		align-items: center;
		gap: 4px;
		min-width: 0;
		box-sizing: border-box;
	}
	.bp-node__cell--in {
		justify-content: flex-start;
		padding-left: 16px;
		padding-right: 6px;
	}
	.bp-node__cell--out {
		justify-content: flex-end;
		padding-left: 6px;
		padding-right: 16px;
	}
	.bp-node__label {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 10px;
		font-weight: 600;
		line-height: 1;
		flex-shrink: 0;
		max-width: 56%;
	}
	.bp-node__cell--out .bp-node__label {
		text-align: right;
		max-width: 100%;
	}
	.bp-node__label--exec {
		color: var(--bp-exec-label, #64748b);
	}
	.bp-node__literal {
		min-width: 0;
		flex: 1;
		max-width: 72px;
		height: 16px;
		border: 1px solid var(--bp-literal-border, #cbd5e1);
		border-radius: 2px;
		background: var(--bp-literal-bg, #f8fafc);
		padding: 0 4px;
		font-size: 10px;
		font-weight: 500;
		line-height: 16px;
		color: var(--bp-literal-fg, #0f172a);
		outline: none;
	}
	.bp-node__literal:focus {
		border-color: #0ea5e9;
	}
	.bp-node__literal--bool {
		flex: 0 0 auto;
		width: 12px;
		max-width: 12px;
		height: 12px;
		padding: 0;
		accent-color: #ef4444;
	}

	:global(.dark) .bp-node {
		--bp-node-bg: #1e1e1e;
		--bp-node-border: rgba(0, 0, 0, 0.55);
		--bp-exec-label: #cbd5e1;
		--bp-literal-bg: #111827;
		--bp-literal-border: #334155;
		--bp-literal-fg: #e2e8f0;
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
	}
	:global(.dark) .bp-node--selected {
		border-color: #38bdf8;
		box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.35);
	}

	:global(.svelte-flow__node-blueprint) {
		padding: 0 !important;
		border: none !important;
		background: transparent !important;
		box-shadow: none !important;
		overflow: visible !important;
	}
	:global(.svelte-flow__node-blueprint .bp-handle.svelte-flow__handle) {
		position: absolute !important;
		z-index: 5;
		display: flex !important;
		align-items: center;
		justify-content: center;
		box-sizing: border-box !important;
		margin: 0 !important;
		border: 1.5px solid var(--bp-handle-border, #fff) !important;
		bottom: auto !important;
	}
	:global(.dark) .svelte-flow__node-blueprint .bp-handle.svelte-flow__handle {
		--bp-handle-border: #111;
	}
	:global(.svelte-flow__node-blueprint .bp-handle--exec) {
		width: 11px !important;
		height: 11px !important;
		min-width: 11px !important;
		min-height: 11px !important;
		border-radius: 1px !important;
	}
	:global(.svelte-flow__node-blueprint .bp-handle--data) {
		width: 12px !important;
		height: 12px !important;
		min-width: 12px !important;
		min-height: 12px !important;
		border-radius: 999px !important;
	}
	:global(.svelte-flow__node-blueprint .svelte-flow__handle-left) {
		left: 0 !important;
		right: auto !important;
		transform: translate(-50%, -50%) !important;
	}
	:global(.svelte-flow__node-blueprint .svelte-flow__handle-right) {
		right: 0 !important;
		left: auto !important;
		transform: translate(50%, -50%) !important;
	}
	:global(.svelte-flow__node-blueprint .bp-handle__play) {
		pointer-events: none;
		width: 7px;
		height: 7px;
		color: #111;
	}
</style>
