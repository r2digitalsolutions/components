import type { Meta, StoryObj } from '@storybook/svelte';
import TypingIndicatorStory from './TypingIndicatorStory.svelte';

const meta = {
	title: 'Molecules/TypingIndicator',
	component: TypingIndicatorStory,
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		variant: { control: 'select', options: ['bubble', 'plain'] },
		showText: { control: 'boolean' }
	},
	args: { size: 'md', variant: 'bubble', showText: true }
} satisfies Meta<typeof TypingIndicatorStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const DotsOnly: Story = { args: { showText: false } };
export const Plain: Story = { args: { variant: 'plain' } };
