import type { Meta, StoryObj } from '@storybook/svelte';
import NetworkStatusStory from './NetworkStatusStory.svelte';

const meta = {
	title: 'Atoms/NetworkStatus',
	component: NetworkStatusStory,
	tags: ['autodocs'],
	argTypes: { forced: { control: 'boolean' } },
	args: { forced: true }
} satisfies Meta<typeof NetworkStatusStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Offline: Story = { args: { forced: false } };
