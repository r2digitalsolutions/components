import type { Meta, StoryObj } from '@storybook/svelte';
import TableOfContentsStory from './TableOfContentsStory.svelte';

const meta = {
	title: 'Molecules/TableOfContents',
	component: TableOfContentsStory,
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'select', options: ['rail', 'soft', 'plain'] },
		size: { control: 'select', options: ['sm', 'md'] },
		numbered: { control: 'boolean' },
		title: { control: 'text' }
	},
	args: {
		variant: 'rail',
		size: 'md',
		numbered: false,
		title: 'On this page'
	}
} satisfies Meta<typeof TableOfContentsStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Numbered: Story = { args: { numbered: true } };
export const Soft: Story = { args: { variant: 'soft' } };
