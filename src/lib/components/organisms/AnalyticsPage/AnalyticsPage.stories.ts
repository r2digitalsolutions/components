import type { Meta, StoryObj } from '@storybook/svelte';
import AnalyticsPageStory from './AnalyticsPageStory.svelte';

const meta = {
	title: 'Organisms/AnalyticsPage',
	component: AnalyticsPageStory,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'empty', 'with-logs']
		}
	},
	args: { variant: 'default' }
} satisfies Meta<typeof AnalyticsPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPipelineLogs: Story = {
	args: { variant: 'with-logs' }
};

export const Empty: Story = {
	args: { variant: 'empty' }
};
