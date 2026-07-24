import type { Meta, StoryObj } from '@storybook/svelte';
import NotificationCenterStory from './NotificationCenterStory.svelte';

const meta = {
	title: 'Organisms/NotificationCenter',
	component: NotificationCenterStory,
	tags: ['autodocs'],
	argTypes: {
		example: { control: 'select', options: ['default', 'empty'] }
	},
	args: {
		example: 'default'
	}
} satisfies Meta<typeof NotificationCenterStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { example: 'empty' } };
