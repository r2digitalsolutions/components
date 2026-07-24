import type { Meta, StoryObj } from '@storybook/svelte';
import TimelineStory from './TimelineStory.svelte';

const meta = {
	title: 'Molecules/Timeline',
	component: TimelineStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['deploy', 'order', 'onboarding', 'activity']
		},
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		showConnectors: { control: 'boolean' }
	},
	args: {
		example: 'deploy',
		size: 'md',
		showConnectors: true
	}
} satisfies Meta<typeof TimelineStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Deployment: Story = { args: { example: 'deploy' } };
export const OrderTracking: Story = { args: { example: 'order' } };
export const Onboarding: Story = { args: { example: 'onboarding' } };
export const ActivityFeed: Story = { args: { example: 'activity', size: 'sm' } };
export const Large: Story = { args: { example: 'order', size: 'lg' } };
export const WithoutConnectors: Story = {
	args: { example: 'onboarding', showConnectors: false }
};
