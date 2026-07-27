import type { Meta, StoryObj } from '@storybook/svelte';
import RelationPickerStory from './RelationPickerStory.svelte';

const meta = {
	title: 'Molecules/RelationPicker',
	component: RelationPickerStory,
	tags: ['autodocs']
} satisfies Meta<typeof RelationPickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
