import type { Meta, StoryObj } from '@storybook/svelte';
import StatusPageStory from './StatusPageStory.svelte';

const meta = {
	title: 'Organisms/StatusPage',
	component: StatusPageStory,
	tags: ['autodocs'],
	argTypes: {
		status: { control: 'select', options: ['success', 'error', 'info', 'warning', 'empty'] }
	},
	args: { status: 'success' }
} satisfies Meta<typeof StatusPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Error: Story = {
	args: { status: 'error' }
};
