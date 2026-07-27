import type { Meta, StoryObj } from '@storybook/svelte';
import PhoneFrameStory from './PhoneFrameStory.svelte';

const meta = {
	title: 'Molecules/PhoneFrame',
	component: PhoneFrameStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['default', 'scroll', 'sizes']
		}
	}
} satisfies Meta<typeof PhoneFrameStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { example: 'default' }
};

export const ScrollContent: Story = {
	args: { example: 'scroll' }
};

export const Sizes: Story = {
	args: { example: 'sizes' }
};
