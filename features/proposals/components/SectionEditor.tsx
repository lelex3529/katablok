'use client';

import { useState, useEffect, useRef } from 'react';
import { ProposalSection, ProposalBlock } from '../types/Proposal';
import { Block } from '@/features/blocks/types/Block';
import BlockSearchModal from './BlockSearchModal';
import ProposalBlockEditor from './ProposalBlockEditor';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface SectionEditorProps {
  section: ProposalSection;
  onUpdateSection: (
    sectionId: string,
    updates: Partial<Omit<ProposalSection, 'id'>>,
  ) => void;
  onDeleteSection: (sectionId: string) => void;
  onDuplicateSection: (sectionId: string) => void;
  onAddBlock: (
    sectionId: string,
    block: Omit<ProposalBlock, 'id' | 'order'>,
  ) => string;
  onUpdateBlock: (
    sectionId: string,
    blockId: string,
    updates: Partial<Omit<ProposalBlock, 'id'>>,
  ) => void;
  onDeleteBlock: (sectionId: string, blockId: string) => void;
  onDuplicateBlock: (sectionId: string, blockId: string) => void;
  onReorderBlocks: (sectionId: string, blockIds: string[]) => void;
  isCollapsed?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

interface DragItem {
  id: string;
  type: string;
  index: number;
}

interface DraggableBlockProps {
  block: ProposalBlock;
  index: number;
  onUpdateBlock: (
    sectionId: string,
    blockId: string,
    updates: Partial<Omit<ProposalBlock, 'id'>>,
  ) => void;
  onDeleteBlock: (sectionId: string, blockId: string) => void;
  onDuplicateBlock: (sectionId: string, blockId: string) => void;
  moveBlock: (dragIndex: number, hoverIndex: number) => void;
  sectionId: string;
}

const DraggableBlock = ({
  block,
  index,
  onUpdateBlock,
  onDeleteBlock,
  onDuplicateBlock,
  moveBlock,
  sectionId,
}: DraggableBlockProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'block',
    item: { id: block.id, type: 'block', index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop<DragItem>({
    accept: 'block',
    hover: (item, monitor) => {
      if (!ref.current) return;
      if (item.index === index) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (item.index < index && hoverClientY < hoverMiddleY) return;
      if (item.index > index && hoverClientY > hoverMiddleY) return;

      moveBlock(item.index, index);
      item.index = index;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`${isDragging ? 'opacity-50' : 'opacity-100'} mb-4 transition-opacity duration-200`}
    >
      <ProposalBlockEditor
        block={block}
        onUpdateBlock={(updates) => onUpdateBlock(sectionId, block.id, updates)}
        onDeleteBlock={() => onDeleteBlock(sectionId, block.id)}
        onDuplicateBlock={() => onDuplicateBlock(sectionId, block.id)}
      />
    </div>
  );
};

export default function SectionEditor({
  section,
  onUpdateSection,
  onDeleteSection,
  onDuplicateSection,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onReorderBlocks,
  isCollapsed = false,
  isFirst = false,
  isLast = false,
  onMoveUp,
  onMoveDown,
}: SectionEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(section.title);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(isCollapsed);

  // Sort blocks by order
  const sortedBlocks = [...section.blocks].sort((a, b) => a.order - b.order);

  // Update section title
  const handleTitleChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const newTitle = e.target.value.trim();
    if (newTitle && newTitle !== section.title) {
      onUpdateSection(section.id, { title: newTitle });
      setTitle(newTitle);
    } else {
      setTitle(section.title);
    }
    setIsEditing(false);
  };

  // Handle Enter key press for title input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur(); // This will trigger the onBlur event which calls handleTitleChange
    }
  };

  // Handle block selection from modal
  const handleSelectBlock = (block: Block) => {
    const newProposalBlock: Omit<ProposalBlock, 'id' | 'order'> = {
      blockId: block.id,
      overrides: {
        title: block.title,
        content: block.content,
        unitPrice: block.unitPrice,
        estimatedDuration: block.estimatedDuration,
      },
    };

    onAddBlock(section.id, newProposalBlock);
    setIsBlockModalOpen(false);
  };

  // Handle block reordering
  const moveBlock = (dragIndex: number, hoverIndex: number) => {
    const newBlockOrder = [...sortedBlocks];
    const draggedBlock = newBlockOrder.splice(dragIndex, 1)[0];
    newBlockOrder.splice(hoverIndex, 0, draggedBlock);

    // Update the order parameter
    const reorderedBlocks = newBlockOrder.map((block, index) => ({
      ...block,
      order: index,
    }));

    // Get block IDs in new order
    const blockIds = reorderedBlocks.map((block) => block.id);
    onReorderBlocks(section.id, blockIds);
  };

  // Handle key press for keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // For section title editing input
      if (isEditing) return;

      // Section navigation
      if (e.altKey) {
        if (e.key === 'ArrowUp' && !isFirst && onMoveUp) {
          e.preventDefault();
          onMoveUp();
        } else if (e.key === 'ArrowDown' && !isLast && onMoveDown) {
          e.preventDefault();
          onMoveDown();
        } else if (e.key === 'd' && onDuplicateSection) {
          e.preventDefault();
          onDuplicateSection(section.id);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    isEditing,
    isFirst,
    isLast,
    onMoveUp,
    onMoveDown,
    section.id,
    onDuplicateSection,
  ]);

  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-200 mb-6'>
      {/* Section header */}
      <div className='px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
        <div className='flex-1 flex items-center'>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className='mr-3 text-gray-500 hover:text-katalyx-primary transition-colors'
          >
            {collapsed ? (
              <ChevronDownIcon className='h-5 w-5' />
            ) : (
              <ChevronUpIcon className='h-5 w-5' />
            )}
          </button>

          {isEditing ? (
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleChange}
              onKeyDown={handleKeyDown}
              className='flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-katalyx-primary focus:border-katalyx-primary'
              autoFocus
            />
          ) : (
            <h3
              className='text-lg font-sora font-medium text-gray-800 truncate cursor-pointer hover:text-katalyx-primary'
              onClick={() => setIsEditing(true)}
            >
              {section.title}
            </h3>
          )}
        </div>

        <div className='flex space-x-2'>
          <button
            onClick={() => setIsEditing(true)}
            className='text-gray-500 hover:text-katalyx-primary p-1.5 rounded-lg hover:bg-gray-100 transition-colors'
            title='Edit section title'
          >
            <PencilIcon className='h-4 w-4' />
          </button>

          <button
            onClick={() => onDuplicateSection(section.id)}
            className='text-gray-500 hover:text-katalyx-primary p-1.5 rounded-lg hover:bg-gray-100 transition-colors'
            title='Duplicate section'
          >
            <DocumentDuplicateIcon className='h-4 w-4' />
          </button>

          <button
            onClick={() => onDeleteSection(section.id)}
            className='text-gray-500 hover:text-katalyx-error p-1.5 rounded-lg hover:bg-gray-100 transition-colors'
            title='Delete section'
          >
            <TrashIcon className='h-4 w-4' />
          </button>

          {!isFirst && (
            <button
              onClick={onMoveUp}
              className='text-gray-500 hover:text-katalyx-primary p-1.5 rounded-lg hover:bg-gray-100 transition-colors'
              title='Move section up'
            >
              ↑
            </button>
          )}

          {!isLast && (
            <button
              onClick={onMoveDown}
              className='text-gray-500 hover:text-katalyx-primary p-1.5 rounded-lg hover:bg-gray-100 transition-colors'
              title='Move section down'
            >
              ↓
            </button>
          )}
        </div>
      </div>

      {/* Section content */}
      {!collapsed && (
        <div className='p-6'>
          <DndProvider backend={HTML5Backend}>
            {sortedBlocks.map((block, index) => (
              <DraggableBlock
                key={block.id}
                block={block}
                index={index}
                onUpdateBlock={onUpdateBlock}
                onDeleteBlock={onDeleteBlock}
                onDuplicateBlock={onDuplicateBlock}
                moveBlock={moveBlock}
                sectionId={section.id}
              />
            ))}
          </DndProvider>

          {sortedBlocks.length === 0 && (
            <div className='text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300'>
              <p className='text-gray-500 mb-4'>
                This section is empty. Add some blocks to get started.
              </p>
              <button
                onClick={() => setIsBlockModalOpen(true)}
                className='px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors'
              >
                Add Your First Block
              </button>
            </div>
          )}

          {/* Add block button */}
          {sortedBlocks.length > 0 && (
            <button
              onClick={() => setIsBlockModalOpen(true)}
              className='w-full mt-4 py-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-katalyx-primary hover:text-katalyx-primary hover:bg-katalyx-primary/5 transition-colors flex items-center justify-center'
            >
              <PlusIcon className='h-5 w-5 mr-2' />
              Add Block
            </button>
          )}
        </div>
      )}

      {/* Block search modal */}
      <BlockSearchModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onSelectBlock={handleSelectBlock}
      />
    </div>
  );
}
