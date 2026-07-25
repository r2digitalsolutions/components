import type { Meta, StoryObj } from '@storybook/svelte';
import CalloutStory from './CalloutStory.svelte';

const meta = {
	title: 'Molecules/Callout',
	component: CalloutStory,
	tags: ['autodocs'],
	argTypes: {
		tone: { control: 'select', options: ['info', 'success', 'warning', 'error', 'neutral'] },
		title: { control: 'text' }
	},
	args: { tone: 'info', title: 'Heads up' }
} satisfies Meta<typeof CalloutStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Error: Story = { args: { tone: 'error', title: 'Action required' } };
