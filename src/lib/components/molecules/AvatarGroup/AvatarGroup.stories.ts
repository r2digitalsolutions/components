import type { Meta, StoryObj } from '@storybook/svelte';
import AvatarGroupStory from './AvatarGroupStory.svelte';

const meta = {
	title: 'Molecules/AvatarGroup',
	component: AvatarGroupStory,
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
		max: { control: 'number' }
	},
	args: { max: 4, size: 'md' }
} satisfies Meta<typeof AvatarGroupStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Compact: Story = { args: { max: 3, size: 'sm' } };
