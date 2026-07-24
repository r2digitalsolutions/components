import type { Meta, StoryObj } from '@storybook/svelte';
import LoginFormStory from './LoginFormStory.svelte';

const meta = {
	title: 'Organisms/LoginForm',
	component: LoginFormStory,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	argTypes: { loading: { control: 'boolean' } },
	args: { loading: false }
} satisfies Meta<typeof LoginFormStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Loading: Story = { args: { loading: true } };
