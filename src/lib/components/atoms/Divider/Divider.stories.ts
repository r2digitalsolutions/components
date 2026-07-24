import type { Meta, StoryObj } from '@storybook/svelte';
import DividerStory from './DividerStory.svelte';

const meta = {
	title: 'Atoms/Divider',
	component: DividerStory,
	tags: ['autodocs'],
	argTypes: {
		orientation: { control: 'select', options: ['horizontal', 'vertical'] },
		label: { control: 'text' }
	},
	args: { orientation: 'horizontal', label: '' }
} satisfies Meta<typeof DividerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithLabel: Story = { args: { label: 'or continue with' } };
