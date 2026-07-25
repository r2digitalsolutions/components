import type { Meta, StoryObj } from '@storybook/svelte';
import AddressFieldsStory from './AddressFieldsStory.svelte';

const meta = {
	title: 'Molecules/AddressFields',
	component: AddressFieldsStory,
	tags: ['autodocs']
} satisfies Meta<typeof AddressFieldsStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
