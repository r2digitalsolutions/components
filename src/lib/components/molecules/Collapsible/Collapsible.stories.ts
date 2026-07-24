import type { Meta, StoryObj } from '@storybook/svelte';
import CollapsibleStory from './CollapsibleStory.svelte';

const meta = {
	title: 'Molecules/Collapsible',
	component: CollapsibleStory,
	tags: ['autodocs'],
	argTypes: {
		open: { control: 'boolean' },
		title: { control: 'text' },
		disabled: { control: 'boolean' }
	},
	args: {
		open: false,
		title: 'Shipping details',
		disabled: false
	}
} satisfies Meta<typeof CollapsibleStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Open: Story = { args: { open: true } };
export const Disabled: Story = { args: { disabled: true } };
