import type { Meta, StoryObj } from '@storybook/svelte';
import JSONViewerStory from './JSONViewerStory.svelte';

const meta = {
	title: 'Molecules/JSONViewer',
	component: JSONViewerStory,
	tags: ['autodocs']
} satisfies Meta<typeof JSONViewerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
