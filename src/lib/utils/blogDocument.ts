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
	| 'video'
	| 'embed'
	| 'gallery'
	| 'table'
	| 'cta'
	| 'spacer'
	| 'html'
	| 'component';

export type BlogHeadingLevel = 1 | 2 | 3 | 4;
export type BlogAlign = 'left' | 'center' | 'right';
export type BlogWidth = 'full' | 'wide' | 'content' | 'narrow';
export type BlogCalloutTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

export interface BlogHeadingData {
	level: BlogHeadingLevel;
	text: string;
	align?: BlogAlign;
	anchor?: string;
}

export interface BlogParagraphData {
	text: string;
	align?: BlogAlign;
	lead?: boolean;
	muted?: boolean;
}

export interface BlogImageData {
	src: string;
	alt?: string;
	caption?: string;
	href?: string;
	align?: BlogAlign;
	width?: BlogWidth;
	rounded?: boolean;
	shadow?: boolean;
}

export interface BlogCodeData {
	code: string;
	language?: string;
	filename?: string;
	showLineNumbers?: boolean;
	highlightLines?: string;
}

export interface BlogCalloutData {
	tone?: BlogCalloutTone;
	title?: string;
	text: string;
	collapsible?: boolean;
}

export interface BlogQuoteData {
	text: string;
	cite?: string;
	role?: string;
	align?: BlogAlign;
}

export interface BlogListData {
	ordered?: boolean;
	items: string[];
	tight?: boolean;
	start?: number;
}

export interface BlogMarkdownData {
	source: string;
}

export interface BlogDividerData {
	style?: 'solid' | 'dashed' | 'dotted';
	label?: string;
	spacing?: 'sm' | 'md' | 'lg';
}

export interface BlogVideoData {
	src: string;
	poster?: string;
	caption?: string;
	controls?: boolean;
	autoplay?: boolean;
	loop?: boolean;
	muted?: boolean;
	align?: BlogAlign;
	width?: BlogWidth;
}

export interface BlogEmbedData {
	url: string;
	title?: string;
	aspectRatio?: '16:9' | '4:3' | '1:1' | '9:16';
	height?: number;
	caption?: string;
}

export interface BlogGalleryImage {
	src: string;
	alt?: string;
	caption?: string;
}

export interface BlogGalleryData {
	images: BlogGalleryImage[];
	columns?: 2 | 3 | 4;
	gap?: 'sm' | 'md' | 'lg';
	rounded?: boolean;
}

export interface BlogTableData {
	headers: string[];
	rows: string[][];
	striped?: boolean;
	compact?: boolean;
	caption?: string;
}

export interface BlogCtaData {
	label: string;
	href?: string;
	variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
	align?: BlogAlign;
	subtitle?: string;
	openInNewTab?: boolean;
}

export interface BlogSpacerData {
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface BlogHtmlData {
	html: string;
}

export interface BlogComponentPropField {
	key: string;
	label: string;
	type: 'string' | 'number' | 'boolean' | 'select' | 'textarea' | 'color';
	options?: { value: string; label: string }[];
	placeholder?: string;
	description?: string;
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
	| BlogDividerData
	| BlogVideoData
	| BlogEmbedData
	| BlogGalleryData
	| BlogTableData
	| BlogCtaData
	| BlogSpacerData
	| BlogHtmlData
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
	description?: string;
	coverImage?: string;
	author?: string;
	tags?: string[];
	publishedAt?: string;
	blocks: BlogBlock[];
}

export interface BlogComponentRegistration {
	label: string;
	component: Component<any>;
	defaultProps?: Record<string, unknown>;
	description?: string;
	/** Optional schema so BlogEditor can show typed prop fields. */
	propFields?: BlogComponentPropField[];
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
			return { level: 2, text: 'Heading', align: 'left' };
		case 'paragraph':
			return { text: '', align: 'left', lead: false, muted: false };
		case 'image':
			return {
				src: '',
				alt: '',
				caption: '',
				align: 'center',
				width: 'content',
				rounded: true,
				shadow: false
			};
		case 'code':
			return {
				code: '',
				language: 'typescript',
				filename: '',
				showLineNumbers: false,
				highlightLines: ''
			};
		case 'callout':
			return { tone: 'info', title: '', text: '', collapsible: false };
		case 'quote':
			return { text: '', cite: '', role: '', align: 'left' };
		case 'list':
			return { ordered: false, items: [''], tight: false, start: 1 };
		case 'divider':
			return { style: 'solid', label: '', spacing: 'md' };
		case 'markdown':
			return { source: '' };
		case 'video':
			return {
				src: '',
				poster: '',
				caption: '',
				controls: true,
				autoplay: false,
				loop: false,
				muted: false,
				align: 'center',
				width: 'content'
			};
		case 'embed':
			return { url: '', title: '', aspectRatio: '16:9', caption: '' };
		case 'gallery':
			return {
				images: [{ src: '', alt: '' }],
				columns: 3,
				gap: 'md',
				rounded: true
			};
		case 'table':
			return {
				headers: ['Column A', 'Column B'],
				rows: [
					['', ''],
					['', '']
				],
				striped: true,
				compact: false,
				caption: ''
			};
		case 'cta':
			return {
				label: 'Get started',
				href: '#',
				variant: 'primary',
				align: 'center',
				subtitle: '',
				openInNewTab: false
			};
		case 'spacer':
			return { size: 'md' };
		case 'html':
			return { html: '' };
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
					data: {
						...defaultDataForType(b.type as BlogBlockType),
						...(b.data ?? {})
					} as BlogBlockData
				}))
		: [];
	const tags = Array.isArray(obj.tags)
		? obj.tags.filter((t): t is string => typeof t === 'string')
		: undefined;
	return {
		version: 1,
		title: typeof obj.title === 'string' ? obj.title : '',
		description: typeof obj.description === 'string' ? obj.description : undefined,
		coverImage: typeof obj.coverImage === 'string' ? obj.coverImage : undefined,
		author: typeof obj.author === 'string' ? obj.author : undefined,
		tags,
		publishedAt: typeof obj.publishedAt === 'string' ? obj.publishedAt : undefined,
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

export function blogWidthClass(width?: BlogWidth): string {
	switch (width) {
		case 'full':
			return 'w-full max-w-none';
		case 'wide':
			return 'w-full max-w-4xl mx-auto';
		case 'narrow':
			return 'w-full max-w-md mx-auto';
		case 'content':
		default:
			return 'w-full max-w-3xl mx-auto';
	}
}

export function blogAlignClass(align?: BlogAlign): string {
	if (align === 'center') return 'text-center mx-auto';
	if (align === 'right') return 'text-right ml-auto';
	return 'text-left';
}

export function blogAspectPadding(ratio?: BlogEmbedData['aspectRatio']): string {
	switch (ratio) {
		case '4:3':
			return '75%';
		case '1:1':
			return '100%';
		case '9:16':
			return '177.78%';
		case '16:9':
		default:
			return '56.25%';
	}
}

export const NATIVE_BLOCK_TYPES: {
	type: Exclude<BlogBlockType, 'component'>;
	label: string;
	group: string;
}[] = [
	{ type: 'heading', label: 'Heading', group: 'Text' },
	{ type: 'paragraph', label: 'Paragraph', group: 'Text' },
	{ type: 'quote', label: 'Quote', group: 'Text' },
	{ type: 'list', label: 'List', group: 'Text' },
	{ type: 'markdown', label: 'Markdown', group: 'Text' },
	{ type: 'callout', label: 'Callout', group: 'Text' },
	{ type: 'code', label: 'Code', group: 'Media' },
	{ type: 'image', label: 'Image', group: 'Media' },
	{ type: 'video', label: 'Video', group: 'Media' },
	{ type: 'gallery', label: 'Gallery', group: 'Media' },
	{ type: 'embed', label: 'Embed', group: 'Media' },
	{ type: 'table', label: 'Table', group: 'Layout' },
	{ type: 'cta', label: 'Button / CTA', group: 'Layout' },
	{ type: 'divider', label: 'Divider', group: 'Layout' },
	{ type: 'spacer', label: 'Spacer', group: 'Layout' },
	{ type: 'html', label: 'HTML', group: 'Advanced' }
];
