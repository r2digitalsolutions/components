import type { Meta, StoryObj } from '@storybook/svelte';
import FacetPanelStory from './FacetPanelStory.svelte';

const meta = {
	title: 'Molecules/FacetPanel',
	component: FacetPanelStory,
	tags: ['autodocs']
} satisfies Meta<typeof FacetPanelStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
