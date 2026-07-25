import type { Meta, StoryObj } from '@storybook/svelte';
import ForgotPasswordFormStory from './ForgotPasswordFormStory.svelte';

const meta = {
	title: 'Organisms/ForgotPasswordForm',
	component: ForgotPasswordFormStory,
	tags: ['autodocs']
} satisfies Meta<typeof ForgotPasswordFormStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
