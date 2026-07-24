import type { Meta, StoryObj } from '@storybook/svelte';
import HoverCardStory from './HoverCardStory.svelte';

const meta = {
	title: 'Molecules/HoverCard',
	component: HoverCardStory,
	tags: ['autodocs'],
	argTypes: {
		placement: { control: 'select', options: ['top', 'bottom', 'left', 'right'] }
	},
	args: { placement: 'bottom' }
} satisfies Meta<typeof HoverCardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
