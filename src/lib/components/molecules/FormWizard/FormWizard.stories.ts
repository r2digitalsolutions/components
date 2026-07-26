import type { Meta, StoryObj } from '@storybook/svelte';
import FormWizardStory from './FormWizardStory.svelte';

const meta = {
	title: 'Molecules/FormWizard',
	component: FormWizardStory,
	tags: ['autodocs']
} satisfies Meta<typeof FormWizardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
