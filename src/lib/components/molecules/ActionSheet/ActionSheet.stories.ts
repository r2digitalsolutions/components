import type { Meta, StoryObj } from '@storybook/svelte';
import ActionSheetStory from './ActionSheetStory.svelte';

const meta = {
	title: 'Molecules/ActionSheet',
	component: ActionSheetStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['photo', 'share', 'account', 'sort', 'confirmDelete', 'disabled']
		}
	}
} satisfies Meta<typeof ActionSheetStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { example: 'photo' }
};

export const Share: Story = {
	args: { example: 'share' }
};

export const Account: Story = {
	args: { example: 'account' }
};

export const Sort: Story = {
	args: { example: 'sort' }
};

export const ConfirmDelete: Story = {
	args: { example: 'confirmDelete' }
};

export const WithDisabled: Story = {
	args: { example: 'disabled' }
};
