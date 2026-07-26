import type { Meta, StoryObj } from '@storybook/svelte';
import FormChipSelectStory from './FormChipSelectStory.svelte';

const meta = {
	title: 'Molecules/FormChipSelect',
	component: FormChipSelectStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormChipSelectStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
