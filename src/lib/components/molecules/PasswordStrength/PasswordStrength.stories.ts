import type { Meta, StoryObj } from '@storybook/svelte';
import PasswordStrengthStory from './PasswordStrengthStory.svelte';

const meta = {
	title: 'Molecules/PasswordStrength',
	component: PasswordStrengthStory,
	tags: ['autodocs']
} satisfies Meta<typeof PasswordStrengthStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
