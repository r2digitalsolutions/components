import type { Meta, StoryObj } from '@storybook/svelte';
import SettingsLayoutStory from './SettingsLayoutStory.svelte';

const meta = {
	title: 'Organisms/SettingsLayout',
	component: SettingsLayoutStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered'
	},
	argTypes: {
		example: {
			control: 'select',
			options: ['default', 'groups', 'customHeader', 'disabled']
		},
		showHeader: { control: 'boolean' },
		stickyHeader: { control: 'boolean' }
	},
	args: {
		example: 'default',
		showHeader: true,
		stickyHeader: false
	}
} satisfies Meta<typeof SettingsLayoutStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithGroups: Story = { args: { example: 'groups' } };
export const CustomHeader: Story = { args: { example: 'customHeader', showHeader: false } };
export const DisabledItems: Story = { args: { example: 'disabled' } };
export const StickyHeader: Story = { args: { stickyHeader: true } };
