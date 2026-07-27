import type { Meta, StoryObj } from '@storybook/svelte';
import NodeGraphStory from './NodeGraphStory.svelte';

const meta = {
	title: 'Molecules/NodeGraph',
	component: NodeGraphStory,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof NodeGraphStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
