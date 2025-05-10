'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useProposalDraft } from '../hooks/useProposals';
import { Proposal, PaymentTerm } from '../types/Proposal';
import SectionEditor from './SectionEditor';
import {
  PlusIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import ProposalPreview from './ProposalPreview';
import Dialog from '@/components/ui/Dialog';

// Default payment terms options
const DEFAULT_PAYMENT_TERMS: PaymentTerm[][] = [
  [
    { label: '40%', percent: 40, trigger: 'upon order' },
    { label: '30%', percent: 30, trigger: 'after validation' },
    { label: '20%', percent: 20, trigger: 'after delivery' },
    { label: '10%', percent: 10, trigger: 'on go-live' },
  ],
  [
    { label: '50%', percent: 50, trigger: 'upon order' },
    { label: '50%', percent: 50, trigger: 'after delivery' },
  ],
];

interface ProposalBuilderProps {
  onSave?: (
    proposal: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<Proposal>;
  initialProposal?: Partial<Proposal>;
  isSubmitting?: boolean;
}

export default function ProposalBuilder({
  onSave,
  initialProposal,
  isSubmitting = false,
}: ProposalBuilderProps) {
  const {
    draft,
    unsavedChanges,
    updateProperty,
    addSection,
    updateSection,
    deleteSection,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    reorderSections,
    getTotals,
    markAsSaved,
    duplicateSection,
    duplicateBlock,
    updateDraft,
  } = useProposalDraft();

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showUnsavedChangesAlert, setShowUnsavedChangesAlert] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedPaymentTerms, setSelectedPaymentTerms] = useState<
    PaymentTerm[]
  >(initialProposal?.paymentTerms || DEFAULT_PAYMENT_TERMS[0]);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const isInitialized = useRef(false);

  // Initialize with initialProposal if provided
  useEffect(() => {
    if (initialProposal && !isInitialized.current) {
      // Implementation for editing an existing proposal
      const proposalToEdit = {
        ...initialProposal,
        updatedAt: initialProposal.updatedAt || new Date(),
      } as Proposal;

      updateDraft(proposalToEdit);
      markAsSaved();
      isInitialized.current = true;

      // Set payment terms if available
      if (initialProposal.paymentTerms) {
        setSelectedPaymentTerms(initialProposal.paymentTerms);
      }
    }
  }, [initialProposal, markAsSaved, updateDraft]);

  // Update payment terms in draft when they change - but only if they're really different
  useEffect(() => {
    // Using JSON.stringify for deep comparison of payment terms
    const currentTerms = JSON.stringify(draft.paymentTerms || []);
    const newTerms = JSON.stringify(selectedPaymentTerms);

    if (currentTerms !== newTerms) {
      updateProperty('paymentTerms', selectedPaymentTerms);
    }
  }, [selectedPaymentTerms, updateProperty, draft.paymentTerms]);

  // Calculate totals
  const { totalCost, totalDuration } = getTotals();

  // Sort sections by order
  const sortedSections = [...draft.sections].sort((a, b) => a.order - b.order);

  // Handle saving the proposal
  const handleSave = useCallback(async () => {
    if (onSave) {
      try {
        setIsSaving(true);
        setSaveError(null);

        // Convert draft to the format expected by the API
        const proposalToSave = {
          title: draft.title,
          clientName: draft.clientName,
          paymentTerms: selectedPaymentTerms,
          sections: draft.sections.map((section) => ({
            ...section,
            blocks: section.blocks.map((block) => ({
              ...block,
              // Transform the block data to match the database schema expectations
              overrideTitle: block.overrides.title,
              overrideContent: block.overrides.content,
              overrideUnitPrice: block.overrides.unitPrice,
              overrideDuration: block.overrides.estimatedDuration,
            })),
          })),
        };

        await onSave(
          proposalToSave as Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>,
        );
        markAsSaved();
        setSaveSuccess(true);

        // Reset success message after a delay
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } catch (error) {
        console.error('Error saving proposal:', error);
        setSaveError(
          error instanceof Error ? error.message : 'Failed to save proposal',
        );
      } finally {
        setIsSaving(false);
      }
    }
  }, [onSave, draft, markAsSaved, selectedPaymentTerms]);

  // Select payment terms
  const selectPaymentTerms = (terms: PaymentTerm[]) => {
    setSelectedPaymentTerms(terms);
    setShowPaymentOptions(false);
  };

  // Move a section up or down
  const moveSection = (currentIndex: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= sortedSections.length) return;

    const newOrder = [...sortedSections];
    const [movedSection] = newOrder.splice(currentIndex, 1);
    newOrder.splice(newIndex, 0, movedSection);

    // Update order values and reorder
    const sectionIds = newOrder.map((section) => section.id);
    reorderSections(sectionIds);
  };

  // Handle preview
  const handlePreview = useCallback(() => {
    setShowPreview(true);
  }, []);

  const closePreview = () => {
    setShowPreview(false);
  };

  // Keyboard navigation for the entire builder
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Add new section with Alt+N
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        addSection();
      }

      // Save with Ctrl/Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }

      // Preview with Ctrl/Cmd+P
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handlePreview();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [addSection, handleSave, handlePreview]);

  // Show a warning when unsaved changes exist
  useEffect(() => {
    setShowUnsavedChangesAlert(unsavedChanges);

    // Set up beforeunload event to warn when leaving page with unsaved changes
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [unsavedChanges]);

  return (
    <div className='pb-24'>
      {/* Title and client inputs */}
      <div className='mb-8 space-y-4'>
        <div>
          <label
            htmlFor='title'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Proposal Title
          </label>
          <input
            id='title'
            type='text'
            value={draft.title}
            onChange={(e) => updateProperty('title', e.target.value)}
            className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-katalyx-primary focus:border-katalyx-primary shadow-sm'
            placeholder='Enter a title for this proposal'
          />
        </div>

        <div>
          <label
            htmlFor='clientName'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Client Name
          </label>
          <input
            id='clientName'
            type='text'
            value={draft.clientName}
            onChange={(e) => updateProperty('clientName', e.target.value)}
            className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-katalyx-primary focus:border-katalyx-primary shadow-sm'
            placeholder='Enter client name'
          />
        </div>
      </div>

      {/* Unsaved changes alert */}
      {showUnsavedChangesAlert && (
        <div className='mb-6 bg-blue-50 text-blue-700 px-4 py-3 rounded-xl border border-blue-200 flex items-center'>
          <ArrowPathIcon className='h-5 w-5 mr-2 text-blue-500' />
          <span>You have unsaved changes</span>
        </div>
      )}

      {/* Sections */}
      <div className='mb-8'>
        <h2 className='text-lg font-medium mb-4'>Proposal Sections</h2>

        {sortedSections.map((section, index) => (
          <SectionEditor
            key={section.id}
            section={section}
            onUpdateSection={updateSection}
            onDeleteSection={deleteSection}
            onDuplicateSection={duplicateSection}
            onAddBlock={addBlock}
            onUpdateBlock={updateBlock}
            onDeleteBlock={deleteBlock}
            onDuplicateBlock={duplicateBlock}
            onReorderBlocks={reorderBlocks}
            isFirst={index === 0}
            isLast={index === sortedSections.length - 1}
            onMoveUp={() => moveSection(index, 'up')}
            onMoveDown={() => moveSection(index, 'down')}
          />
        ))}

        {sortedSections.length === 0 && (
          <div className='text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300'>
            <DocumentTextIcon className='h-12 w-12 mx-auto text-gray-400 mb-4' />
            <p className='text-gray-600 mb-4'>
              Your proposal is empty. Create your first section to get started.
            </p>
            <button
              onClick={() => addSection('Introduction')}
              className='px-6 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors'
            >
              Create First Section
            </button>
          </div>
        )}

        {/* Add section button */}
        {sortedSections.length > 0 && (
          <button
            onClick={() => addSection()}
            className='w-full py-4 mt-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-katalyx-primary hover:text-katalyx-primary hover:bg-katalyx-primary/5 transition-colors flex items-center justify-center'
          >
            <PlusIcon className='h-5 w-5 mr-2' />
            Add New Section
          </button>
        )}
      </div>

      {/* Payment Terms */}
      <div className='mb-8'>
        <h2 className='text-lg font-medium mb-4'>Payment Terms</h2>
        <div className='bg-white rounded-xl border border-gray-200 p-6'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Payment Schedule
          </label>

          <div className='relative'>
            <button
              className='flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-lg text-left mb-4 bg-white hover:bg-gray-50'
              onClick={() => setShowPaymentOptions(!showPaymentOptions)}
            >
              <span>
                {selectedPaymentTerms.reduce(
                  (acc, term) => acc + term.percent,
                  0,
                ) === 100
                  ? `${selectedPaymentTerms.length} payment ${selectedPaymentTerms.length > 1 ? 'installments' : 'installment'}`
                  : 'Select payment terms'}
              </span>
              <ChevronDownIcon className='h-5 w-5' />
            </button>

            {showPaymentOptions && (
              <div className='absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1'>
                <div className='p-2'>
                  {DEFAULT_PAYMENT_TERMS.map((terms, index) => (
                    <button
                      key={index}
                      className='w-full text-left px-4 py-3 hover:bg-gray-100 rounded'
                      onClick={() => selectPaymentTerms(terms)}
                    >
                      {terms.map((t) => `${t.label} ${t.trigger}`).join(', ')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {selectedPaymentTerms.length > 0 && (
            <div className='bg-gray-50 rounded-lg p-4'>
              <ul className='space-y-2'>
                {selectedPaymentTerms.map((term, index) => (
                  <li key={index} className='flex items-start'>
                    <span className='text-katalyx-primary mr-2 text-lg leading-6'>
                      •
                    </span>
                    <span>
                      <strong>{term.label}</strong> (€
                      {Math.round(
                        (totalCost * term.percent) / 100,
                      ).toLocaleString()}
                      ) {term.trigger}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className='mt-4 text-sm text-gray-500'>
            These payment terms will be displayed in the proposal and can be
            adjusted before finalizing.
          </p>
        </div>
      </div>

      {/* Summary and totals */}
      {sortedSections.length > 0 && (
        <div className='mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200'>
          <h2 className='text-lg font-medium mb-4'>Proposal Summary</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <p className='text-sm text-gray-500 mb-1'>Total Duration</p>
              <p className='text-2xl font-sora font-bold text-gray-800'>
                {totalDuration} days
              </p>
            </div>

            <div>
              <p className='text-sm text-gray-500 mb-1'>Total Cost</p>
              <p className='text-2xl font-sora font-bold text-katalyx-primary'>
                {totalCost.toLocaleString()}€
              </p>
            </div>

            <div className='md:col-span-2'>
              <p className='text-sm text-gray-500 mb-2'>Sections & Blocks</p>
              <div className='flex items-center space-x-2'>
                <span className='px-2 py-1 bg-white border border-gray-200 rounded-md text-sm'>
                  {sortedSections.length} sections
                </span>
                <span className='px-2 py-1 bg-white border border-gray-200 rounded-md text-sm'>
                  {sortedSections.reduce(
                    (acc, section) => acc + section.blocks.length,
                    0,
                  )}{' '}
                  blocks
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save errors */}
      {saveError && (
        <div className='mb-6 bg-katalyx-error/10 text-katalyx-error p-4 rounded-xl border border-katalyx-error/20'>
          <p className='font-medium'>Error saving proposal</p>
          <p>{saveError}</p>
        </div>
      )}

      {/* Sticky action bar */}
      <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 shadow-lg z-10'>
        <div className='container mx-auto max-w-5xl flex justify-between items-center'>
          <div className='flex items-center'>
            {unsavedChanges ? (
              <span className='text-blue-600 flex items-center'>
                <ArrowPathIcon className='h-4 w-4 mr-1.5' />
                Unsaved changes
              </span>
            ) : saveSuccess ? (
              <span className='text-green-600 flex items-center'>
                <svg
                  className='h-4 w-4 mr-1.5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
                Saved successfully
              </span>
            ) : (
              <span className='text-gray-500'>All changes saved</span>
            )}
          </div>

          <div className='flex space-x-3'>
            <button
              onClick={handlePreview}
              className='px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors'
              disabled={isSubmitting || isSaving}
            >
              Preview
            </button>

            <button
              onClick={handleSave}
              disabled={isSubmitting || isSaving || !unsavedChanges}
              className={`px-6 py-2 bg-gradient-primary text-white rounded-xl transition-all ${
                isSubmitting || isSaving || !unsavedChanges
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:shadow-button-hover'
              }`}
            >
              {isSubmitting || isSaving ? 'Saving...' : 'Save Proposal'}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <Dialog
          isOpen={showPreview}
          onClose={closePreview}
          title='Proposal Preview'
          size='lg'
        >
          <ProposalPreview
            proposal={{
              ...draft,
              id: draft.id || 'preview',
              createdAt: draft.createdAt || new Date().toISOString(),
              updatedAt: draft.updatedAt || new Date().toISOString(),
              status: draft.status || 'draft',
              paymentTerms: selectedPaymentTerms,
            }}
            onClose={closePreview}
          />
        </Dialog>
      )}
    </div>
  );
}
