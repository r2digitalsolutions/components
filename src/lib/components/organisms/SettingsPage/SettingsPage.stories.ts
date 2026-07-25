import type { Meta, StoryObj } from '@storybook/svelte';
import SettingsPageStory from './SettingsPageStory.svelte';

const meta = {
	title: 'Organisms/SettingsPage',
	component: SettingsPageStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['default', 'security', 'danger', 'loading', 'flat']
		},
		loading: { control: 'boolean' }
	},
	args: {
		example: 'default',
		loading: false
	}
} satisfies Meta<typeof SettingsPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Security: Story = {
	args: { example: 'security' }
};

export const DangerZone: Story = {
	args: { example: 'danger' }
};

export const Loading: Story = {
	args: { example: 'loading', loading: true }
};

export const FlatNav: Story = {
	args: { example: 'flat' }
};
