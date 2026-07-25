import type { Meta, StoryObj } from '@storybook/svelte';
import ChipSelectStory from './ChipSelectStory.svelte';

const meta = {
	title: 'Molecules/ChipSelect',
	component: ChipSelectStory,
	tags: ['autodocs']
} satisfies Meta<typeof ChipSelectStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
