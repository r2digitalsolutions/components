import type { Meta, StoryObj } from '@storybook/svelte';
import InfoTileStory from './InfoTileStory.svelte';

const meta = {
	title: 'Molecules/InfoTile',
	component: InfoTileStory,
	tags: ['autodocs']
} satisfies Meta<typeof InfoTileStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
