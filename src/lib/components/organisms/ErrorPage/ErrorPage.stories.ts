import type { Meta, StoryObj } from '@storybook/svelte';
import ErrorPageStory from './ErrorPageStory.svelte';

const meta = {
	title: 'Organisms/ErrorPage',
	component: ErrorPageStory,
	tags: ['autodocs'],
	argTypes: {
		code: { control: 'number' }
	},
	args: { code: 404, title: 'Page not found' }
} satisfies Meta<typeof ErrorPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ServerError: Story = {
	args: { code: 500, title: 'Something went wrong' }
};
