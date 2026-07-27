import type { Meta, StoryObj } from '@storybook/svelte';
import MobileAccountPageStory from './MobileAccountPageStory.svelte';

const meta = {
	title: 'Organisms/MobileAccountPage',
	component: MobileAccountPageStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	},
	argTypes: {
		example: {
			control: 'select',
			options: ['default', 'minimal', 'toggles']
		}
	}
} satisfies Meta<typeof MobileAccountPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { example: 'default' }
};

export const WithToggles: Story = {
	args: { example: 'toggles' }
};

export const Minimal: Story = {
	args: { example: 'minimal' }
};
