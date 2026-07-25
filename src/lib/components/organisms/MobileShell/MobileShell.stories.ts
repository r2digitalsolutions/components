import type { Meta, StoryObj } from '@storybook/svelte';
import MobileShellStory from './MobileShellStory.svelte';

const meta = {
	title: 'Organisms/MobileShell',
	component: MobileShellStory,
	tags: ['autodocs'],
	argTypes: {
		navVariant: {
			control: 'select',
			options: ['default', 'floating', 'pill']
		}
	},
	args: {
		navVariant: 'default'
	},
	parameters: {
		layout: 'centered'
	}
} satisfies Meta<typeof MobileShellStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FloatingNav: Story = {
	args: { navVariant: 'floating' }
};

export const PillNav: Story = {
	args: { navVariant: 'pill' }
};
