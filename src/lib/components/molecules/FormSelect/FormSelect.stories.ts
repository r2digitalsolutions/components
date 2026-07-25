import type { Meta, StoryObj } from '@storybook/svelte';
import FormSelectStory from './FormSelectStory.svelte';

const meta = {
	title: 'Molecules/FormSelect',
	component: FormSelectStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormSelectStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
