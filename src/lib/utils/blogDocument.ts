/**
 * Blog document model: parse/serialize + optional component registry.
 */

import type { Component } from 'svelte';

export type BlogBlockType =
	| 'heading'
	| 'paragraph'
	| 'image'
	| 'code'
	| 'callout'
	| 'quote'
	| 'list'
	| 'divider'
	| 'markdown'
	| 'component';

export type BlogHeadingLevel = 1 | 2 | 3 | 4;

export interface BlogHeadingData {
	level: BlogHeadingLevel;
	text: string;
}

export interface BlogParagraphData {
	text: string;
}

export interface BlogImageData {
	src: string;
	alt?: string;
	caption?: string;
}

export interface BlogCodeData {
	code: string;
	language?: string;
}

export interface BlogCalloutData {
	tone?: 'info' | 'success' | 'warning' | 'danger';
	title?: string;
	text: string;
}

export interface BlogQuoteData {
	text: string;
	cite?: string;
}

export interface BlogListData {
	ordered?: boolean;
	items: string[];
}

export interface BlogMarkdownData {
	source: string;
}

export interface BlogComponentData {
	componentId: string;
	props?: Record<string, unknown>;
}

export type BlogBlockData =
	| BlogHeadingData
	| BlogParagraphData
	| BlogImageData
	| BlogCodeData
	| BlogCalloutData
	| BlogQuoteData
	| BlogListData
	| BlogMarkdownData
	| BlogComponentData
	| Record<string, never>;

export interface BlogBlock {
	id: string;
	type: BlogBlockType;
	data: BlogBlockData;
}

export interface BlogDocument {
	version: 1;
	title?: string;
	blocks: BlogBlock[];
}

export interface BlogComponentRegistration {
	label: string;
	component: Component<any>;
	defaultProps?: Record<string, unknown>;
	description?: string;
}

const registry = new Map<string, BlogComponentRegistration>();

function uid(prefix = 'b'): string {
	return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function emptyBlogDocument(title = ''): BlogDocument {
	return { version: 1, title, blocks: [] };
}

export function defaultDataForType(type: BlogBlockType): BlogBlockData {
	switch (type) {
		case 'heading':
			return { level: 2, text: 'Heading' };
		case 'paragraph':
			return { text: '' };
		case 'image':
			return { src: '', alt: '' };
		case 'code':
			return { code: '', language: 'typescript' };
		case 'callout':
			return { tone: 'info', text: '' };
		case 'quote':
			return { text: '', cite: '' };
		case 'list':
			return { ordered: false, items: [''] };
		case 'divider':
			return {};
		case 'markdown':
			return { source: '' };
		case 'component':
			return { componentId: '', props: {} };
		default:
			return {};
	}
}

export function createBlock(type: BlogBlockType, data?: Partial<BlogBlockData>): BlogBlock {
	return {
		id: uid(),
		type,
		data: { ...defaultDataForType(type), ...data } as BlogBlockData
	};
}

export function createComponentBlock(
	componentId: string,
	props?: Record<string, unknown>
): BlogBlock {
	const reg = registry.get(componentId);
	return createBlock('component', {
		componentId,
		props: { ...(reg?.defaultProps ?? {}), ...(props ?? {}) }
	});
}

export function serializeBlogDocument(doc: BlogDocument): string {
	return JSON.stringify(doc, null, 2);
}

export function parseBlogDocument(raw: string | BlogDocument): BlogDocument {
	if (typeof raw !== 'string') {
		return normalizeDocument(raw);
	}
	try {
		const parsed = JSON.parse(raw) as unknown;
		return normalizeDocument(parsed);
	} catch {
		return emptyBlogDocument();
	}
}

function normalizeDocument(input: unknown): BlogDocument {
	if (!input || typeof input !== 'object') return emptyBlogDocument();
	const obj = input as Record<string, unknown>;
	const blocks = Array.isArray(obj.blocks)
		? obj.blocks
				.filter((b): b is BlogBlock => !!b && typeof b === 'object' && 'type' in b && 'id' in b)
				.map((b) => ({
					id: String(b.id),
					type: b.type as BlogBlockType,
					data: (b.data ?? defaultDataForType(b.type as BlogBlockType)) as BlogBlockData
				}))
		: [];
	return {
		version: 1,
		title: typeof obj.title === 'string' ? obj.title : '',
		blocks
	};
}

export function registerBlogComponent(id: string, registration: BlogComponentRegistration): void {
	registry.set(id, registration);
}

export function unregisterBlogComponent(id: string): void {
	registry.delete(id);
}

export function getBlogComponent(id: string): BlogComponentRegistration | undefined {
	return registry.get(id);
}

export function listBlogComponents(): { id: string; registration: BlogComponentRegistration }[] {
	return [...registry.entries()].map(([id, registration]) => ({ id, registration }));
}

export function clearBlogComponentRegistry(): void {
	registry.clear();
}

export const NATIVE_BLOCK_TYPES: { type: Exclude<BlogBlockType, 'component'>; label: string }[] = [
	{ type: 'heading', label: 'Heading' },
	{ type: 'paragraph', label: 'Paragraph' },
	{ type: 'image', label: 'Image' },
	{ type: 'code', label: 'Code' },
	{ type: 'callout', label: 'Callout' },
	{ type: 'quote', label: 'Quote' },
	{ type: 'list', label: 'List' },
	{ type: 'divider', label: 'Divider' },
	{ type: 'markdown', label: 'Markdown' }
];
