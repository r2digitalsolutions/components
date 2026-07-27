import type { Meta, StoryObj } from '@storybook/svelte';
import AssetPickerPageStory from './AssetPickerPageStory.svelte';

const meta = {
	title: 'Organisms/AssetPickerPage',
	component: AssetPickerPageStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	},
	argTypes: {
		example: {
			control: 'select',
			options: ['default', 'list', 'single', 'empty', 'loading']
		}
	}
} satisfies Meta<typeof AssetPickerPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { example: 'default' }
};

export const ListView: Story = {
	args: { example: 'list' }
};

export const SingleSelect: Story = {
	args: { example: 'single' }
};

export const Empty: Story = {
	args: { example: 'empty' }
};

export const Loading: Story = {
	args: { example: 'loading' }
};
