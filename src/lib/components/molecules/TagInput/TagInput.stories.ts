import type { Meta, StoryObj } from '@storybook/svelte';
import TagInputStory from './TagInputStory.svelte';

const meta = {
	title: 'Molecules/TagInput',
	component: TagInputStory,
	tags: ['autodocs'],
	argTypes: {
		disabled: { control: 'boolean' },
		max: { control: 'number' }
	},
	args: { disabled: false }
} satisfies Meta<typeof TagInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const MaxThree: Story = { args: { max: 3 } };
export const Disabled: Story = { args: { disabled: true } };
