import type { Meta, StoryObj } from '@storybook/svelte';
import EmailComposerStory from './EmailComposerStory.svelte';

const meta = {
	title: 'Organisms/EmailComposer',
	component: EmailComposerStory,
	tags: ['autodocs']
} satisfies Meta<typeof EmailComposerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
