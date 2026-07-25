import type { Meta, StoryObj } from '@storybook/svelte';
import DropZoneStory from './DropZoneStory.svelte';

const meta = {
	title: 'Molecules/DropZone',
	component: DropZoneStory,
	tags: ['autodocs']
} satisfies Meta<typeof DropZoneStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
