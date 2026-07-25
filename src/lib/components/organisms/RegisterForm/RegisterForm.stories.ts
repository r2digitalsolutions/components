import type { Meta, StoryObj } from '@storybook/svelte';
import RegisterFormStory from './RegisterFormStory.svelte';

const meta = {
	title: 'Organisms/RegisterForm',
	component: RegisterFormStory,
	tags: ['autodocs']
} satisfies Meta<typeof RegisterFormStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
