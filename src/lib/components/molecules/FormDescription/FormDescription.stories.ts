import type { Meta, StoryObj } from '@storybook/svelte';
import FormDescriptionStory from './FormDescriptionStory.svelte';

const meta = {
	title: 'Molecules/FormDescription',
	component: FormDescriptionStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormDescriptionStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
