import type { Meta, StoryObj } from '@storybook/svelte';
import ChangePasswordFormStory from './ChangePasswordFormStory.svelte';

const meta = {
	title: 'Organisms/ChangePasswordForm',
	component: ChangePasswordFormStory,
	tags: ['autodocs']
} satisfies Meta<typeof ChangePasswordFormStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
