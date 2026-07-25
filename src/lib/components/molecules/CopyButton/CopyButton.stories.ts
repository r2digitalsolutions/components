import type { Meta, StoryObj } from '@storybook/svelte';
import CopyButtonStory from './CopyButtonStory.svelte';

const meta = {
	title: 'Molecules/CopyButton',
	component: CopyButtonStory,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Show code includes the props from Controls for each story.'
			},
			source: {
				transformArgs: true,
				componentName: 'CopyButton',
				language: 'svelte',
				extraProps: ['value="npm i @r2digisolutions/components"', 'label="Copy"']
			}
		}
	},
	argTypes: {
		size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
		variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'outline', 'destructive'] }
	},
	args: { size: 'sm', variant: 'secondary' }
} satisfies Meta<typeof CopyButtonStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = {
	args: { size: 'md', variant: 'primary' }
};
