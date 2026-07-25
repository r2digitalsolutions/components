import type { Meta, StoryObj } from '@storybook/svelte';
import FormRadioGroupStory from './FormRadioGroupStory.svelte';

const meta = {
	title: 'Molecules/FormRadioGroup',
	component: FormRadioGroupStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormRadioGroupStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
