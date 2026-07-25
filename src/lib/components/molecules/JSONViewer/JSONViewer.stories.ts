import type { Meta, StoryObj } from '@storybook/svelte';
import JSONViewerStory from './JSONViewerStory.svelte';

const meta = {
	title: 'Molecules/JSONViewer',
	component: JSONViewerStory,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['api', 'nested', 'array', 'string', 'minimal']
		},
		collapsed: { control: 'boolean' },
		defaultExpandDepth: { control: { type: 'number', min: 0, max: 6 } },
		showToolbar: { control: 'boolean' }
	},
	args: {
		variant: 'api',
		collapsed: false,
		defaultExpandDepth: 1,
		showToolbar: true
	}
} satisfies Meta<typeof JSONViewerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Nested: Story = {
	args: { variant: 'nested', defaultExpandDepth: 2 }
};

export const ArrayRoot: Story = {
	name: 'Array root',
	args: { variant: 'array', defaultExpandDepth: 1 }
};

export const FromString: Story = {
	name: 'Parse string JSON',
	args: { variant: 'string' }
};

export const Collapsed: Story = {
	args: { collapsed: true }
};

export const Expanded: Story = {
	args: { defaultExpandDepth: 4 }
};

export const Minimal: Story = {
	name: 'Without toolbar',
	args: { variant: 'minimal', showToolbar: false }
};
