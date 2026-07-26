import type { Meta, StoryObj } from '@storybook/svelte';
import FormPhoneInputStory from './FormPhoneInputStory.svelte';

const meta = {
	title: 'Molecules/FormPhoneInput',
	component: FormPhoneInputStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormPhoneInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
