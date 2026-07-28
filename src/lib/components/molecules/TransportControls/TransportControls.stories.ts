import type { Meta, StoryObj } from '@storybook/svelte';
import TransportControlsStory from './TransportControlsStory.svelte';

const meta = {
	title: 'Molecules/TransportControls',
	component: TransportControlsStory,
	tags: ['autodocs']
} satisfies Meta<typeof TransportControlsStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
