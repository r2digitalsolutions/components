import type { Meta, StoryObj } from '@storybook/svelte';
import FacetGroupStory from './FacetGroupStory.svelte';

const meta = {
	title: 'Molecules/FacetGroup',
	component: FacetGroupStory,
	tags: ['autodocs']
} satisfies Meta<typeof FacetGroupStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
