import type { Meta, StoryObj } from '@storybook/svelte';
import AssetPickerPageStory from './AssetPickerPageStory.svelte';

const meta = {
	title: 'Organisms/AssetPickerPage',
	component: AssetPickerPageStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	}
} satisfies Meta<typeof AssetPickerPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
