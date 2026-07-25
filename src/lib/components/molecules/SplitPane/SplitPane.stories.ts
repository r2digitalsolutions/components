import type { Meta, StoryObj } from '@storybook/svelte';
import SplitPaneStory from './SplitPaneStory.svelte';

const meta = {
	title: 'Molecules/SplitPane',
	component: SplitPaneStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	},
	argTypes: {
		example: {
			control: 'select',
			options: ['ide', 'hover', 'horizontal', 'vertical', 'sizeEnd', 'code']
		},
		orientation: { control: 'select', options: ['horizontal', 'vertical'] },
		sizePane: { control: 'select', options: ['start', 'end'] },
		minSize: { control: { type: 'number', min: 5, max: 40 } },
		maxSize: { control: { type: 'number', min: 50, max: 95 } },
		revealOnHover: { control: 'boolean' }
	},
	args: {
		example: 'ide',
		orientation: 'horizontal',
		sizePane: 'start',
		minSize: 15,
		maxSize: 70,
		revealOnHover: false
	}
} satisfies Meta<typeof SplitPaneStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: 'IDE layout',
	args: { example: 'ide' }
};

export const RevealOnHover: Story = {
	name: 'Reveal on hover',
	args: { example: 'hover', revealOnHover: true }
};

export const Horizontal: Story = {
	args: { example: 'horizontal', orientation: 'horizontal' }
};

export const Vertical: Story = {
	args: { example: 'vertical' }
};

export const SizeEndPane: Story = {
	name: 'Size end pane',
	args: { example: 'sizeEnd' }
};

export const CodeEditor: Story = {
	name: 'Code + terminal',
	args: { example: 'code' }
};
