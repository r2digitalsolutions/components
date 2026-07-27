import type { Meta, StoryObj } from '@storybook/svelte';
import ResourceStudioStory from './ResourceStudioStory.svelte';

const meta = {
	title: 'Organisms/ResourceStudio',
	component: ResourceStudioStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: [
				'crudAdmin',
				'cms',
				'readOnly',
				'sqlBrowser',
				'customQuery',
				'notesAndRules',
				'bulkWorkflow',
				'empty',
				'loading',
				'mainOnly',
				'permissions'
			]
		}
	},
	args: { example: 'crudAdmin' },
	parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof ResourceStudioStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CrudAdmin: Story = {};
export const CmsCollections: Story = { args: { example: 'cms' } };
export const ReadOnlyCatalog: Story = { args: { example: 'readOnly' } };
export const SqlBrowser: Story = { args: { example: 'sqlBrowser' } };
export const CustomQuerySlot: Story = { args: { example: 'customQuery' } };
export const WithNotesAndRules: Story = {
	args: { example: 'notesAndRules' },
	parameters: {
		docs: {
			description: {
				story:
					'Orders with cell notes, row/cell conditional format rules, and the Rules panel open from the toolbar.'
			}
		}
	}
};
export const BulkWorkflow: Story = {
	args: { example: 'bulkWorkflow' },
	parameters: {
		docs: {
			description: {
				story:
					'Ops queue: rows pre-selected, dock shows Approve / Reject / Assign, plus an Activity tab for the workflow.'
			}
		}
	}
};
export const EmptyAndLoading: Story = { args: { example: 'empty' } };
export const Loading: Story = { args: { example: 'loading' } };
export const MainOnly: Story = { args: { example: 'mainOnly' } };
export const PermissionsGated: Story = { args: { example: 'permissions' } };
