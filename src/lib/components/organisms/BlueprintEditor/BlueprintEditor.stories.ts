import type { Meta, StoryObj } from '@storybook/svelte';
import BlueprintEditorStory from './BlueprintEditorStory.svelte';

const meta = {
	title: 'Organisms/BlueprintEditor',
	component: BlueprintEditorStory,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof BlueprintEditorStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
