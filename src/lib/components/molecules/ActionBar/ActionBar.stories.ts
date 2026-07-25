import type { Meta, StoryObj } from '@storybook/svelte';
import ActionBarStory from './ActionBarStory.svelte';

const meta = {
	title: 'Molecules/ActionBar',
	component: ActionBarStory,
	tags: ['autodocs'],
	argTypes: {
		dirty: { control: 'boolean' },
		loading: { control: 'boolean' },
		variant: { control: 'select', options: ['dock', 'inline'] }
	},
	args: { dirty: true, loading: false, variant: 'dock' }
} satisfies Meta<typeof ActionBarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Clean: Story = {
	args: { dirty: false }
};

export const Inline: Story = {
	args: { variant: 'inline' }
};
