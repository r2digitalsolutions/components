import type { Meta, StoryObj } from '@storybook/svelte';
import FormTagInputStory from './FormTagInputStory.svelte';

const meta = {
	title: 'Molecules/FormTagInput',
	component: FormTagInputStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormTagInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
