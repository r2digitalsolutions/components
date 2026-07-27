import type { Meta, StoryObj } from '@storybook/svelte';
import AppBarStory from './AppBarStory.svelte';

const meta = {
	title: 'Molecules/AppBar',
	component: AppBarStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: [
				'inbox',
				'back',
				'blur',
				'transparent',
				'search',
				'profile',
				'commerce',
				'webDashboard',
				'webDocs',
				'webProject'
			]
		},
		layout: {
			control: 'select',
			options: ['mobile', 'web']
		}
	}
} satisfies Meta<typeof AppBarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { example: 'inbox', layout: 'mobile' }
};

export const WithBack: Story = {
	args: { example: 'back', layout: 'mobile' }
};

export const Blur: Story = {
	args: { example: 'blur', layout: 'mobile' }
};

export const Transparent: Story = {
	args: { example: 'transparent', layout: 'mobile' }
};

export const WithSearch: Story = {
	args: { example: 'search', layout: 'mobile' }
};

export const Profile: Story = {
	args: { example: 'profile', layout: 'mobile' }
};

export const Commerce: Story = {
	args: { example: 'commerce', layout: 'mobile' }
};

export const WebDashboard: Story = {
	args: { example: 'webDashboard', layout: 'web' }
};

export const WebDocs: Story = {
	args: { example: 'webDocs', layout: 'web' }
};

export const WebProject: Story = {
	args: { example: 'webProject', layout: 'web' }
};

/** Same inbox chrome, rendered as a wide web header */
export const WebInbox: Story = {
	args: { example: 'inbox', layout: 'web' }
};
