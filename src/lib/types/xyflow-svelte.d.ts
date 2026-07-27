/**
 * Ambient helpers for @xyflow/svelte component re-exports.
 * NodeNext resolution does not always surface `.svelte` default re-exports from the package entry.
 */
declare module '@xyflow/svelte' {
	import type { Component } from 'svelte';

	export const SvelteFlow: Component<Record<string, unknown>>;
	export const Background: Component<Record<string, unknown>>;
	export const Controls: Component<Record<string, unknown>>;
	export const MiniMap: Component<Record<string, unknown>>;
	export const Handle: Component<Record<string, unknown>>;
	export const Panel: Component<Record<string, unknown>>;

	export enum BackgroundVariant {
		Lines = 'lines',
		Dots = 'dots',
		Cross = 'cross'
	}

	export enum Position {
		Left = 'left',
		Top = 'top',
		Right = 'right',
		Bottom = 'bottom'
	}

	export enum MarkerType {
		Arrow = 'arrow',
		ArrowClosed = 'arrowclosed'
	}

	export type Connection = {
		source: string;
		target: string;
		sourceHandle: string | null;
		targetHandle: string | null;
	};

	export type Edge = Connection & {
		id?: string;
		[key: string]: unknown;
	};

	export type NodeProps = {
		id: string;
		data: Record<string, unknown>;
		selected?: boolean;
		type?: string;
		[key: string]: unknown;
	};

	// Custom nodes have typed props; xyflow accepts them at runtime.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export type NodeTypes = Record<string, Component<any>>;

	export function useSvelteFlow(): {
		fitView: (opts?: { padding?: number; duration?: number }) => Promise<boolean> | boolean | void;
		screenToFlowPosition: (pos: { x: number; y: number }) => { x: number; y: number };
		[key: string]: unknown;
	};
}
