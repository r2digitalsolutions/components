import type { Meta, StoryObj } from '@storybook/svelte';
import CharacterCountStory from './CharacterCountStory.svelte';

const meta = {
	title: 'Molecules/CharacterCount',
	component: CharacterCountStory,
	tags: ['autodocs']
} satisfies Meta<typeof CharacterCountStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
