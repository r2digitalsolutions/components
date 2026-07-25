import type { Meta, StoryObj } from '@storybook/svelte';
import AuthTemplateStory from './AuthTemplateStory.svelte';

const meta = {
	title: 'Templates/AuthTemplate',
	component: AuthTemplateStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen'
	},
	argTypes: {
		view: {
			control: 'select',
			options: ['signin', 'signup', 'forgot']
		},
		asideSide: {
			control: 'select',
			options: ['left', 'right', 'none']
		}
	}
} satisfies Meta<typeof AuthTemplateStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		view: 'signin',
		asideSide: 'left'
	}
};

export const SignUp: Story = {
	args: {
		view: 'signup',
		asideSide: 'left'
	}
};

export const ForgotPassword: Story = {
	args: {
		view: 'forgot',
		asideSide: 'left'
	}
};

export const AsideRight: Story = {
	args: {
		view: 'signin',
		asideSide: 'right'
	}
};

export const Centered: Story = {
	args: {
		view: 'signin',
		asideSide: 'none'
	}
};
