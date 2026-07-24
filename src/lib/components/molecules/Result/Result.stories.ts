import type { Meta, StoryObj } from '@storybook/svelte';
import ResultStory from './ResultStory.svelte';

const meta = {
	title: 'Molecules/Result',
	component: ResultStory,
	tags: ['autodocs'],
	argTypes: {
		status: { control: 'select', options: ['success', 'error', 'info', 'warning', 'empty'] },
		title: { control: 'text' },
		description: { control: 'text' }
	},
	args: {
		status: 'success',
		title: 'Payment completed',
		description: 'Your invoice has been paid and a receipt was sent to your email.'
	}
} satisfies Meta<typeof ResultStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Error: Story = {
	args: {
		status: 'error',
		title: 'Something went wrong',
		description: 'We could not process your request. Please try again.'
	}
};
export const Empty: Story = {
	args: {
		status: 'empty',
		title: 'No results found',
		description: 'Try adjusting your filters or search terms.'
	}
};
