import type { Meta, StoryObj } from '@storybook/svelte';
import I18nProviderStory from '../I18nProvider/I18nProviderStory.svelte';

const meta = {
	title: 'Molecules/FormGroup',
	component: I18nProviderStory,
	tags: ['autodocs']
} satisfies Meta<typeof I18nProviderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
