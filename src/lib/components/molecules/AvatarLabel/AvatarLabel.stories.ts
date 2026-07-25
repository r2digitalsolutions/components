import type { Meta, StoryObj } from '@storybook/svelte';
import AvatarLabelStory from './AvatarLabelStory.svelte';

const meta = {
	title: 'Molecules/AvatarLabel',
	component: AvatarLabelStory,
	tags: ['autodocs']
} satisfies Meta<typeof AvatarLabelStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
