import type { Meta, StoryObj } from '@storybook/svelte';
import BacklogPageStory from './BacklogPageStory.svelte';

const meta = {
	title: 'Organisms/BacklogPage',
	component: BacklogPageStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen'
	},
	argTypes: {
		example: {
			control: 'select',
			options: ['default', 'empty', 'loading', 'readonly', 'filtered']
		}
	}
} satisfies Meta<typeof BacklogPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { example: 'default' }
};

export const WithFilters: Story = {
	args: { example: 'filtered' }
};

export const Empty: Story = {
	args: { example: 'empty' }
};

export const Loading: Story = {
	args: { example: 'loading' }
};

export const ReadOnly: Story = {
	args: { example: 'readonly' }
};
