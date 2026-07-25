import type { Meta, StoryObj } from '@storybook/svelte';
import PasswordFieldStory from './PasswordFieldStory.svelte';

const meta = {
	title: 'Molecules/PasswordField',
	component: PasswordFieldStory,
	tags: ['autodocs']
} satisfies Meta<typeof PasswordFieldStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
