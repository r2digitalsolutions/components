import type { Meta, StoryObj } from '@storybook/svelte';
import ProjectOverviewPageStory from './ProjectOverviewPageStory.svelte';

const meta = {
	title: 'Organisms/ProjectOverviewPage',
	component: ProjectOverviewPageStory,
	tags: ['autodocs']
} satisfies Meta<typeof ProjectOverviewPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
