import type { Meta, StoryObj } from '@storybook/svelte';
import ClusterStory from './ClusterStory.svelte';

const meta = {
	title: 'Atoms/Cluster',
	component: ClusterStory,
	tags: ['autodocs'],
	argTypes: {
		gap: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg'] }
	},
	args: { gap: 'sm' }
} satisfies Meta<typeof ClusterStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
