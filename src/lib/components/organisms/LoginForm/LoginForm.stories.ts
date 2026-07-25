import type { Meta, StoryObj } from '@storybook/svelte';
import LoginFormStory from './LoginFormStory.svelte';

const meta = {
	title: 'Organisms/LoginForm',
	component: LoginFormStory,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	argTypes: {
		loading: { control: 'boolean' },
		variant: { control: 'inline-radio', options: ['card', 'plain'] }
	},
	args: { loading: false, variant: 'card' }
} satisfies Meta<typeof LoginFormStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Plain: Story = { args: { variant: 'plain' } };
export const Loading: Story = { args: { loading: true } };
