import type { Meta, StoryObj } from '@storybook/svelte';
import FormMultiSelectStory from './FormMultiSelectStory.svelte';

const meta = {
	title: 'Molecules/FormMultiSelect',
	component: FormMultiSelectStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormMultiSelectStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
