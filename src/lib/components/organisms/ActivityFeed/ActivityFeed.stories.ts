import type { Meta, StoryObj } from '@storybook/svelte';
import ActivityFeedStory from './ActivityFeedStory.svelte';

const meta = {
	title: 'Organisms/ActivityFeed',
	component: ActivityFeedStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered'
	},
	argTypes: {
		size: { control: 'select', options: ['sm', 'md'] },
		showConnectors: { control: 'boolean' },
		loading: { control: 'boolean' },
		example: {
			control: 'select',
			options: ['default', 'empty', 'links', 'scroll']
		}
	},
	args: {
		size: 'md',
		showConnectors: true,
		loading: false,
		example: 'default'
	}
} satisfies Meta<typeof ActivityFeedStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Dense: Story = { args: { size: 'sm' } };
export const Empty: Story = { args: { example: 'empty' } };
export const Loading: Story = { args: { loading: true } };
export const WithLinks: Story = { args: { example: 'links' } };
export const Scrollable: Story = { args: { example: 'scroll' } };
export const WithoutConnectors: Story = { args: { showConnectors: false } };
