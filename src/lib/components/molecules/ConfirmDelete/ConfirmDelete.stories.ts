import type { Meta, StoryObj } from '@storybook/svelte';
import ConfirmDeleteStory from './ConfirmDeleteStory.svelte';

const meta = {
	title: 'Molecules/ConfirmDelete',
	component: ConfirmDeleteStory,
	tags: ['autodocs']
} satisfies Meta<typeof ConfirmDeleteStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
