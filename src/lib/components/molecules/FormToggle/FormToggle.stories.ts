import type { Meta, StoryObj } from '@storybook/svelte';
import FormToggleStory from './FormToggleStory.svelte';

const meta = {
	title: 'Molecules/FormToggle',
	component: FormToggleStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormToggleStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
