import type { Meta, StoryObj } from '@storybook/svelte';
import FormComboboxStory from './FormComboboxStory.svelte';

const meta = {
	title: 'Molecules/FormCombobox',
	component: FormComboboxStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormComboboxStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
