import type { Meta, StoryObj } from '@storybook/svelte';
import FormLabelStory from './FormLabelStory.svelte';

const meta = {
	title: 'Molecules/FormLabel',
	component: FormLabelStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormLabelStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
