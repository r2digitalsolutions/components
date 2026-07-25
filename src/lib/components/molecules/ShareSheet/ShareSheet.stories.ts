import type { Meta, StoryObj } from '@storybook/svelte';
import ShareSheetStory from './ShareSheetStory.svelte';

const meta = {
	title: 'Molecules/ShareSheet',
	component: ShareSheetStory,
	tags: ['autodocs']
} satisfies Meta<typeof ShareSheetStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
