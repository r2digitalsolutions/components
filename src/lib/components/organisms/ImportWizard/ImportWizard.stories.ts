import type { Meta, StoryObj } from '@storybook/svelte';
import ImportWizardStory from './ImportWizardStory.svelte';

const meta = {
	title: 'Organisms/ImportWizard',
	component: ImportWizardStory,
	tags: ['autodocs']
} satisfies Meta<typeof ImportWizardStory>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
