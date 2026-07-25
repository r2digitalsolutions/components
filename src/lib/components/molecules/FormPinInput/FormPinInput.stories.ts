import type { Meta, StoryObj } from '@storybook/svelte';
import FormPinInputStory from './FormPinInputStory.svelte';

const meta = {
	title: 'Molecules/FormPinInput',
	component: FormPinInputStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormPinInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
