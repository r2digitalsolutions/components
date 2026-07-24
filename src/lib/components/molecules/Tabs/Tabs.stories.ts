import type { Meta, StoryObj } from '@storybook/svelte';
import TabsStory from './TabsStory.svelte';

const meta = {
	title: 'Molecules/Tabs',
	component: TabsStory,
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'select', options: ['underline', 'pills'] },
		fullWidth: { control: 'boolean' }
	},
	args: { variant: 'underline', fullWidth: false }
} satisfies Meta<typeof TabsStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Underline: Story = { args: { variant: 'underline' } };
export const Pills: Story = { args: { variant: 'pills' } };
export const FullWidth: Story = { args: { fullWidth: true } };
