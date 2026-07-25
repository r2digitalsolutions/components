import type { Meta, StoryObj } from '@storybook/svelte';
import WizardStory from './WizardStory.svelte';

const meta = {
	title: 'Organisms/Wizard',
	component: WizardStory,
	tags: ['autodocs']
} satisfies Meta<typeof WizardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
