import type { Meta, StoryObj } from '@storybook/svelte';
import OrgChartStory from './OrgChartStory.svelte';

const meta = {
	title: 'Molecules/OrgChart',
	component: OrgChartStory,
	tags: ['autodocs']
} satisfies Meta<typeof OrgChartStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
