import type { Meta, StoryObj } from '@storybook/svelte';
import NavbarStory from './NavbarStory.svelte';

const meta = {
	title: 'Organisms/Navbar',
	component: NavbarStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen'
	},
	argTypes: {
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		variant: { control: 'select', options: ['underline', 'pills', 'plain'] },
		example: {
			control: 'select',
			options: ['marketing', 'app', 'centered', 'docs', 'compact']
		},
		sticky: { control: 'boolean' },
		blur: { control: 'boolean' },
		bordered: { control: 'boolean' },
		centerLinks: { control: 'boolean' },
		maxWidth: { control: 'select', options: ['full', '5xl', '6xl', '7xl'] }
	},
	args: {
		size: 'md',
		sticky: false,
		variant: 'underline',
		example: 'marketing',
		bordered: true,
		blur: true,
		maxWidth: '7xl',
		centerLinks: false
	}
} satisfies Meta<typeof NavbarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Marketing: Story = { args: { example: 'marketing' } };
export const AppShell: Story = {
	args: { example: 'app', variant: 'pills', sticky: true, maxWidth: 'full' }
};
export const Centered: Story = {
	args: { example: 'centered', variant: 'plain', centerLinks: true, maxWidth: '6xl' }
};
export const Docs: Story = { args: { example: 'docs', size: 'sm', sticky: true } };
export const Compact: Story = {
	args: { example: 'compact', size: 'sm', variant: 'pills', bordered: false }
};
export const Large: Story = { args: { example: 'marketing', size: 'lg' } };
