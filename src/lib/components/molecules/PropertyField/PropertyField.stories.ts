import type { Meta, StoryObj } from '@storybook/svelte';
import PropertyFieldStory from './PropertyFieldStory.svelte';

const meta = {
	title: 'Molecules/PropertyField',
	component: PropertyFieldStory,
	tags: ['autodocs']
} satisfies Meta<typeof PropertyFieldStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
