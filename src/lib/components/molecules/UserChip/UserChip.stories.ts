import type { Meta, StoryObj } from '@storybook/svelte';
import UserChipStory from './UserChipStory.svelte';

const meta = {
	title: 'Molecules/UserChip',
	component: UserChipStory,
	tags: ['autodocs']
} satisfies Meta<typeof UserChipStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
