import type { Meta, StoryObj } from '@storybook/svelte';
import PropertyRowStory from './PropertyRowStory.svelte';

const meta = {
	title: 'Molecules/PropertyRow',
	component: PropertyRowStory,
	tags: ['autodocs']
} satisfies Meta<typeof PropertyRowStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
