import type { Meta, StoryObj } from '@storybook/svelte';
import ProseStory from './ProseStory.svelte';

const meta = {
	title: 'Atoms/Prose',
	component: ProseStory,
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
		density: { control: 'select', options: ['compact', 'comfortable', 'relaxed'] },
		tone: { control: 'radio', options: ['default', 'muted'] },
		align: { control: 'radio', options: ['left', 'center', 'justify'] },
		maxWidth: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'prose'] },
		subtleHeadings: { control: 'boolean' },
		demo: { control: false }
	},
	args: {
		size: 'md',
		density: 'comfortable',
		tone: 'default',
		align: 'left',
		maxWidth: 'prose',
		subtleHeadings: false,
		demo: 'playground'
	}
} satisfies Meta<typeof ProseStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CompactMuted: Story = {
	args: { size: 'sm', density: 'compact', tone: 'muted' }
};

export const LargeCentered: Story = {
	args: { size: 'lg', align: 'center', subtleHeadings: true }
};

export const Justified: Story = {
	args: { align: 'justify', density: 'relaxed' }
};

export const Article: Story = {
	args: { demo: 'article' }
};

export const SizeScale: Story = {
	args: { demo: 'sizes' }
};

export const DensityCompare: Story = {
	args: { demo: 'compact' }
};
