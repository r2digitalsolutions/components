import type { Meta, StoryObj } from '@storybook/svelte';
import LocaleSwitcherStory from './LocaleSwitcherStory.svelte';

const meta = {
	title: 'Molecules/LocaleSwitcher',
	component: LocaleSwitcherStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	},
	argTypes: {
		variant: {
			control: 'select',
			options: ['settings', 'menu', 'segmented', 'list']
		}
	}
} satisfies Meta<typeof LocaleSwitcherStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { variant: 'settings' }
};

export const Menu: Story = {
	args: { variant: 'menu' }
};

export const Segmented: Story = {
	args: { variant: 'segmented' }
};

export const List: Story = {
	args: { variant: 'list' }
};
