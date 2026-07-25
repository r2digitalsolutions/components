import type { Meta, StoryObj } from '@storybook/svelte';
import FieldArrayStory from './FieldArrayStory.svelte';

const meta = {
	title: 'Molecules/FieldArray',
	component: FieldArrayStory,
	tags: ['autodocs']
} satisfies Meta<typeof FieldArrayStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
