import type { Meta, StoryObj } from '@storybook/svelte';
import PageHeaderStory from './PageHeaderStory.svelte';

const meta = {
	title: 'Molecules/PageHeader',
	component: PageHeaderStory,
	tags: ['autodocs'],
	argTypes: {
		title: { control: 'text' },
		description: { control: 'text' }
	},
	args: {
		title: 'Project settings',
		description: 'Manage workspace preferences, members, and billing.'
	}
} satisfies Meta<typeof PageHeaderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
