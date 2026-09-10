import type { Meta, StoryObj } from '@storybook/svelte';
import StoreProductTileStory from './StoreProductTileStory.svelte';

const meta = {
	title: 'Molecules/StoreProductTile',
	component: StoreProductTileStory,
	tags: ['autodocs'],
	argTypes: {
		featured: { control: 'boolean' },
		installed: { control: 'boolean' }
	},
	args: {
		featured: false,
		installed: false,
		tags: ['new']
	}
} satisfies Meta<typeof StoreProductTileStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Featured: Story = {
	args: { featured: true, tags: ['featured', 'new'] }
};

export const Installed: Story = {
	args: { installed: true, tags: ['popular'] }
};
