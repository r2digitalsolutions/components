import type { Meta, StoryObj } from '@storybook/svelte';
import TileStory from './TileStory.svelte';

const meta = {
	title: 'Molecules/Tile',
	component: TileStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['list', 'settings', 'custom', 'accents', 'flush']
		}
	}
} satisfies Meta<typeof TileStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { example: 'list' }
};

export const Settings: Story = {
	args: { example: 'settings' }
};

export const CustomChildren: Story = {
	args: { example: 'custom' }
};

export const Accents: Story = {
	args: { example: 'accents' }
};

export const FlushList: Story = {
	args: { example: 'flush' }
};
