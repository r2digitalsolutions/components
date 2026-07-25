import type { Meta, StoryObj } from '@storybook/svelte';
import MarkdownPreviewStory from './MarkdownPreviewStory.svelte';

const meta = {
	title: 'Molecules/MarkdownPreview',
	component: MarkdownPreviewStory,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['editor', 'docs', 'compact']
		},
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		framed: { control: 'boolean' }
	},
	args: {
		variant: 'editor',
		size: 'md',
		framed: true
	}
} satisfies Meta<typeof MarkdownPreviewStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Documentation: Story = {
	args: { variant: 'docs', size: 'md' }
};

export const Compact: Story = {
	args: { variant: 'compact', size: 'sm' }
};

export const Large: Story = {
	args: { variant: 'docs', size: 'lg' }
};

export const Unframed: Story = {
	args: { variant: 'docs', framed: false }
};
