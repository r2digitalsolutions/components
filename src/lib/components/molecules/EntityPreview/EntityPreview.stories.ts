import type { Meta, StoryObj } from '@storybook/svelte';
import EntityPreviewStory from './EntityPreviewStory.svelte';

const meta = {
	title: 'Molecules/EntityPreview',
	component: EntityPreviewStory,
	tags: ['autodocs']
} satisfies Meta<typeof EntityPreviewStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
