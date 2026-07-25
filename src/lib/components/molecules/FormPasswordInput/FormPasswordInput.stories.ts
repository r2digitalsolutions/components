import type { Meta, StoryObj } from '@storybook/svelte';
import FormPasswordInputStory from './FormPasswordInputStory.svelte';

const meta = {
	title: 'Molecules/FormPasswordInput',
	component: FormPasswordInputStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormPasswordInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
