import type { Meta, StoryObj } from '@storybook/svelte';
import WaveBarsStory from './WaveBarsStory.svelte';

const meta = {
	title: 'Atoms/WaveBars',
	component: WaveBarsStory,
	tags: ['autodocs']
} satisfies Meta<typeof WaveBarsStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
