import type { Meta, StoryObj } from '@storybook/svelte';
import AttachmentChipStory from './AttachmentChipStory.svelte';

const meta = {
	title: 'Molecules/AttachmentChip',
	component: AttachmentChipStory,
	tags: ['autodocs']
} satisfies Meta<typeof AttachmentChipStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
