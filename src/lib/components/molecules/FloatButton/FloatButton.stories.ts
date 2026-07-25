import type { Meta, StoryObj } from '@storybook/svelte';
import FloatButtonStory from './FloatButtonStory.svelte';

const meta = {
	title: 'Molecules/FloatButton',
	component: FloatButtonStory,
	tags: ['autodocs'],
	argTypes: {
		position: {
			control: 'select',
			options: ['bottom-right', 'bottom-left', 'top-right', 'top-left']
		},
		variant: {
			control: 'select',
			options: ['primary', 'secondary', 'ghost', 'outline', 'destructive']
		}
	},
	args: { position: 'bottom-right', variant: 'primary' }
} satisfies Meta<typeof FloatButtonStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
