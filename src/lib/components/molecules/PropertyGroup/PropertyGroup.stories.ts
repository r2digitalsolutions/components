import type { Meta, StoryObj } from '@storybook/svelte';
import PropertyGroupStory from './PropertyGroupStory.svelte';

const meta = {
	title: 'Molecules/PropertyGroup',
	component: PropertyGroupStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	}
} satisfies Meta<typeof PropertyGroupStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
