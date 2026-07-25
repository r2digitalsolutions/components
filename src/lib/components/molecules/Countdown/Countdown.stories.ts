import type { Meta, StoryObj } from '@storybook/svelte';
import CountdownStory from './CountdownStory.svelte';

const meta = {
	title: 'Molecules/Countdown',
	component: CountdownStory,
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		showDays: { control: 'boolean' }
	},
	args: { size: 'md', showDays: true }
} satisfies Meta<typeof CountdownStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Compact: Story = { args: { size: 'sm', showDays: false } };
