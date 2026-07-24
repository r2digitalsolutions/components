import type { Meta, StoryObj } from '@storybook/svelte';
import CommandPaletteStory from './CommandPaletteStory.svelte';

const meta = {
	title: 'Organisms/CommandPalette',
	component: CommandPaletteStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered'
	}
} satisfies Meta<typeof CommandPaletteStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
