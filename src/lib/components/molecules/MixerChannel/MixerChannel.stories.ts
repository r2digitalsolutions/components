import type { Meta, StoryObj } from '@storybook/svelte';
import MixerChannelStory from './MixerChannelStory.svelte';

const meta = {
	title: 'Molecules/MixerChannel',
	component: MixerChannelStory,
	tags: ['autodocs']
} satisfies Meta<typeof MixerChannelStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
