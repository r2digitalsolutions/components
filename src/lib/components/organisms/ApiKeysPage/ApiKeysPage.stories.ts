import type { Meta, StoryObj } from '@storybook/svelte';
import ApiKeysPageStory from './ApiKeysPageStory.svelte';

const meta = {
	title: 'Organisms/ApiKeysPage',
	component: ApiKeysPageStory,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'empty', 'revealed']
		}
	},
	args: { variant: 'default' }
} satisfies Meta<typeof ApiKeysPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RevealedSecret: Story = {
	args: { variant: 'revealed' }
};

export const Empty: Story = {
	args: { variant: 'empty' }
};
