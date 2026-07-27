import type { Meta, StoryObj } from '@storybook/svelte';
import ExploreFeedPageStory from './ExploreFeedPageStory.svelte';

const meta = {
	title: 'Organisms/ExploreFeedPage',
	component: ExploreFeedPageStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	},
	argTypes: {
		example: {
			control: 'select',
			options: ['default', 'filtered', 'empty', 'loading', 'no-sidebar']
		}
	}
} satisfies Meta<typeof ExploreFeedPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { example: 'default' }
};

export const Filtered: Story = {
	args: { example: 'filtered' }
};

export const Empty: Story = {
	args: { example: 'empty' }
};

export const Loading: Story = {
	args: { example: 'loading' }
};

export const NoSidebar: Story = {
	args: { example: 'no-sidebar' }
};
