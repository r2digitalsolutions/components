import type { Meta, StoryObj } from '@storybook/svelte';
import CardStory from './CardStory.svelte';

const meta = {
	title: 'Molecules/Card',
	component: CardStory,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'elevated', 'bordered', 'ghost', 'soft']
		},
		padding: {
			control: 'select',
			options: ['none', 'sm', 'md', 'lg']
		},
		hoverable: { control: 'boolean' },
		chrome: { control: 'boolean' },
		layout: {
			control: 'select',
			options: ['basic', 'toolbar', 'stats', 'action']
		}
	},
	args: {
		variant: 'default',
		padding: 'md',
		hoverable: false,
		chrome: true,
		layout: 'basic'
	}
} satisfies Meta<typeof CardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Toolbar: Story = {
	name: 'Toolbar chrome',
	args: { layout: 'toolbar', padding: 'none' }
};

export const WithActions: Story = {
	name: 'Header + actions',
	args: { layout: 'action' }
};

export const Stats: Story = {
	args: { layout: 'stats' }
};

export const Elevated: Story = { args: { variant: 'elevated' } };
export const Soft: Story = { args: { variant: 'soft' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Hoverable: Story = { args: { hoverable: true, layout: 'action' } };
export const NoChrome: Story = {
	name: 'Flat header',
	args: { chrome: false }
};
