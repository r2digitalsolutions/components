import type { Meta, StoryObj } from '@storybook/svelte';
import FormErrorStory from './FormErrorStory.svelte';

const meta = {
	title: 'Molecules/FormError',
	component: FormErrorStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormErrorStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
