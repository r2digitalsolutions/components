import type { Meta, StoryObj } from '@storybook/svelte';
import FloatingWindowStory from './FloatingWindowStory.svelte';

const meta = {
	title: 'Molecules/FloatingWindow',
	component: FloatingWindowStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['default', 'actions']
		}
	}
} satisfies Meta<typeof FloatingWindowStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { example: 'default' }
};

export const WithActions: Story = {
	args: { example: 'actions' }
};
