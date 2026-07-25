import type { Meta, StoryObj } from '@storybook/svelte';
import PanelStory from './PanelStory.svelte';

const meta = {
	title: 'Molecules/Panel',
	component: PanelStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['dock', 'actions', 'variants', 'stack']
		},
		padding: { control: 'select', options: ['none', 'sm', 'md'] },
		chrome: { control: 'boolean' },
		fill: { control: 'boolean' },
		collapsible: { control: 'boolean' }
	},
	args: {
		example: 'dock',
		padding: 'sm',
		chrome: true,
		fill: true,
		collapsible: true
	}
} satisfies Meta<typeof PanelStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: 'Editor dock',
	args: { example: 'dock' }
};

export const WithActions: Story = {
	name: 'Header actions',
	args: { example: 'actions' }
};

export const Variants: Story = {
	args: { example: 'variants' }
};

export const Stacked: Story = {
	args: { example: 'stack' }
};
