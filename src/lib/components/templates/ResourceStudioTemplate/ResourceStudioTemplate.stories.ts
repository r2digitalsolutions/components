import type { Meta, StoryObj } from '@storybook/svelte';
import ResourceStudioTemplateStory from './ResourceStudioTemplateStory.svelte';

const meta = {
	title: 'Templates/ResourceStudioTemplate',
	component: ResourceStudioTemplateStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['crud', 'sql', 'mainOnly']
		}
	},
	args: { example: 'crud' },
	parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof ResourceStudioTemplateStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CrudAdmin: Story = {};
export const SqlBrowser: Story = { args: { example: 'sql' } };
export const MainOnly: Story = { args: { example: 'mainOnly' } };
