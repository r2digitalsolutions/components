import type { Meta, StoryObj } from '@storybook/svelte';
import FormNumberInputStory from './FormNumberInputStory.svelte';

const meta = {
	title: 'Molecules/FormNumberInput',
	component: FormNumberInputStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormNumberInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
