import type { Meta, StoryObj } from '@storybook/svelte';
import ShareButtonStory from './ShareButtonStory.svelte';

const meta = {
	title: 'Molecules/ShareButton',
	component: ShareButtonStory,
	tags: ['autodocs'],
	argTypes: {
		iconOnly: { control: 'boolean' },
		variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'outline', 'destructive'] }
	},
	args: { iconOnly: false, variant: 'secondary' }
} satisfies Meta<typeof ShareButtonStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const IconOnly: Story = { args: { iconOnly: true } };
