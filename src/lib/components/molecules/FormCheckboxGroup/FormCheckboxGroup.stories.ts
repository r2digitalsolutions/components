import type { Meta, StoryObj } from '@storybook/svelte';
import FormCheckboxGroupStory from './FormCheckboxGroupStory.svelte';

const meta = {
	title: 'Molecules/FormCheckboxGroup',
	component: FormCheckboxGroupStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormCheckboxGroupStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
