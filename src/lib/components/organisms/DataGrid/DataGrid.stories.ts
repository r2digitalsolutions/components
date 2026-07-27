import type { Meta, StoryObj } from '@storybook/svelte';
import DataGridStory from './DataGridStory.svelte';

const meta = {
	title: 'Organisms/DataGrid',
	component: DataGridStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: [
				'default',
				'rowSelection',
				'columnAndCell',
				'marquee',
				'contextMenu',
				'withNotes',
				'conditional',
				'formatPanel',
				'editable',
				'pinned',
				'responsive',
				'large',
				'empty',
				'loading',
				'customDock',
				'readOnly'
			]
		},
		sortable: { control: 'boolean' },
		editable: { control: 'boolean' },
		compact: { control: 'boolean' },
		striped: { control: 'boolean' }
	},
	args: {
		example: 'default',
		sortable: true,
		editable: false,
		compact: false,
		striped: false
	},
	parameters: {
		layout: 'padded',
		docs: {
			// Docs only mounts Default below — other variants are canvas-only.
			story: { inline: false, iframeHeight: 420 }
		}
	}
} satisfies Meta<typeof DataGridStory>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Keep Docs page light: one live preview. Rest stay available in Canvas. */
const canvasOnly = {
	parameters: {
		docs: { disable: true }
	}
} as const;

export const Default: Story = {};
export const RowSelection: Story = { args: { example: 'rowSelection' }, ...canvasOnly };
export const ColumnAndCellSelection: Story = {
	args: { example: 'columnAndCell' },
	...canvasOnly
};
export const MarqueeDragSelect: Story = {
	args: { example: 'marquee' },
	...canvasOnly
};
export const ContextMenuAndActions: Story = {
	args: { example: 'contextMenu', editable: true },
	...canvasOnly
};
export const WithNotes: Story = { args: { example: 'withNotes' }, ...canvasOnly };
export const ConditionalFormatting: Story = {
	args: { example: 'conditional' },
	...canvasOnly
};
export const FormatRulesPanel: Story = {
	args: { example: 'formatPanel' },
	...canvasOnly
};
export const EditableCells: Story = {
	args: { example: 'editable', editable: true },
	...canvasOnly
};
export const PinnedColumns: Story = { args: { example: 'pinned' }, ...canvasOnly };
export const ResponsiveViewsAndFilters: Story = {
	args: { example: 'responsive' },
	...canvasOnly
};
export const LargeDataset: Story = { args: { example: 'large' }, ...canvasOnly };
export const EmptyAndLoading: Story = { args: { example: 'empty' }, ...canvasOnly };
export const Loading: Story = { args: { example: 'loading' }, ...canvasOnly };
export const CustomDockActions: Story = { args: { example: 'customDock' }, ...canvasOnly };
export const ReadOnly: Story = { args: { example: 'readOnly' }, ...canvasOnly };
export const CompactStriped: Story = {
	args: { example: 'default', compact: true, striped: true },
	...canvasOnly
};
