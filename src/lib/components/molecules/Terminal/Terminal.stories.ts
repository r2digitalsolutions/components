import type { Meta, StoryObj } from '@storybook/svelte';
import TerminalStory from './TerminalStory.svelte';

const meta = {
	title: 'Molecules/Terminal',
	component: TerminalStory,
	tags: ['autodocs'],
	argTypes: {
		tone: {
			control: 'select',
			options: ['adaptive', 'contrast']
		}
	},
	args: {
		tone: 'adaptive'
	}
} satisfies Meta<typeof TerminalStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Adaptive: Story = {};

export const Contrast: Story = {
	args: { tone: 'contrast' }
};
