import type { Meta, StoryObj } from '@storybook/svelte';
import ReadMoreStory from './ReadMoreStory.svelte';

const meta = {
	title: 'Molecules/ReadMore',
	component: ReadMoreStory,
	tags: ['autodocs'],
	argTypes: {
		maxLength: { control: { type: 'number', min: 40, max: 300, step: 10 } }
	},
	args: { maxLength: 120 }
} satisfies Meta<typeof ReadMoreStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
