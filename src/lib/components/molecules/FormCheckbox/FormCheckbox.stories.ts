import type { Meta, StoryObj } from '@storybook/svelte';
import FormCheckboxStory from './FormCheckboxStory.svelte';

const meta = {
	title: 'Molecules/FormCheckbox',
	component: FormCheckboxStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormCheckboxStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
