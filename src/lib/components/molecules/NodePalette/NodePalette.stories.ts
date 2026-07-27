import type { Meta, StoryObj } from '@storybook/svelte';
import NodePaletteStory from './NodePaletteStory.svelte';

const meta = {
	title: 'Molecules/NodePalette',
	component: NodePaletteStory,
	tags: ['autodocs']
} satisfies Meta<typeof NodePaletteStory>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
