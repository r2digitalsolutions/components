import type { Meta, StoryObj } from '@storybook/svelte';
import MapExplorerStory from './MapExplorerStory.svelte';

const meta = {
	title: 'Organisms/MapExplorer',
	component: MapExplorerStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen'
	}
} satisfies Meta<typeof MapExplorerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
