import type { Meta, StoryObj } from '@storybook/svelte';
import FormTextareaStory from './FormTextareaStory.svelte';

const meta = {
	title: 'Molecules/FormTextarea',
	component: FormTextareaStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormTextareaStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
