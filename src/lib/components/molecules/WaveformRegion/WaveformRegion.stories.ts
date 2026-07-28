import type { Meta, StoryObj } from '@storybook/svelte';
import WaveformRegionStory from './WaveformRegionStory.svelte';

const meta = {
	title: 'Molecules/WaveformRegion',
	component: WaveformRegionStory,
	tags: ['autodocs']
} satisfies Meta<typeof WaveformRegionStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
