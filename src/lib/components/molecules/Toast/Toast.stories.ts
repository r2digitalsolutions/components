import type { Meta, StoryObj } from '@storybook/svelte';
import ToastStory from './ToastStory.svelte';

const meta = {
	title: 'Molecules/Toast',
	component: ToastStory,
	tags: ['autodocs'],
	argTypes: {
		position: {
			control: 'select',
			options: [
				'top-left',
				'top-center',
				'top-right',
				'bottom-left',
				'bottom-center',
				'bottom-right'
			]
		}
	},
	args: {
		position: 'bottom-right'
	},
	parameters: {
		layout: 'fullscreen'
	}
} satisfies Meta<typeof ToastStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const TopRight: Story = { args: { position: 'top-right' } };
export const TopCenter: Story = { args: { position: 'top-center' } };
export const BottomCenter: Story = { args: { position: 'bottom-center' } };
