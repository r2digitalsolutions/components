import type { Meta, StoryObj } from '@storybook/svelte';
import InputGroupStory from './InputGroupStory.svelte';

const meta = {
	title: 'Molecules/InputGroup',
	component: InputGroupStory,
	tags: ['autodocs']
} satisfies Meta<typeof InputGroupStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
