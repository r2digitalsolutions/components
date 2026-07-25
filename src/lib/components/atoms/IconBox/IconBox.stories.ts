import type { Meta, StoryObj } from '@storybook/svelte';
import IconBoxStory from './IconBoxStory.svelte';

const meta = {
	title: 'Atoms/IconBox',
	component: IconBoxStory,
	tags: ['autodocs'],
	argTypes: {
		tone: { control: 'select', options: ['brand', 'neutral', 'success', 'warning', 'error', 'info'] }
	},
	args: { tone: 'brand' }
} satisfies Meta<typeof IconBoxStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
