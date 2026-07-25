import type { Meta, StoryObj } from '@storybook/svelte';
import FormStory from './FormStory.svelte';
import { formUsageCode } from './formUsage.js';

const meta = {
	title: 'Molecules/Form',
	component: FormStory,
	tags: ['autodocs'],
	parameters: {
		docs: {
			source: {
				type: 'code',
				language: 'svelte',
				code: formUsageCode
			}
		}
	}
} satisfies Meta<typeof FormStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
