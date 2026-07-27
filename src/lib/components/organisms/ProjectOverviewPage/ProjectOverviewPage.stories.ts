import type { Meta, StoryObj } from '@storybook/svelte';
import ProjectOverviewPageStory from './ProjectOverviewPageStory.svelte';

const meta = {
	title: 'Organisms/ProjectOverviewPage',
	component: ProjectOverviewPageStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	},
	argTypes: {
		example: {
			control: 'select',
			options: ['default', 'at-risk', 'empty', 'compact']
		}
	}
} satisfies Meta<typeof ProjectOverviewPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { example: 'default' }
};

export const AtRisk: Story = {
	args: { example: 'at-risk' }
};

export const Empty: Story = {
	args: { example: 'empty' }
};

export const Compact: Story = {
	args: { example: 'compact' }
};
