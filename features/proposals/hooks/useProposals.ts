'use client';

import { useState, useEffect, useCallback } from 'react';
import { Proposal, ProposalBlock, ProposalSection } from '../types/Proposal';
import * as proposalService from '../services/proposalService';

export function useProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProposals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await proposalService.getProposals();
      setProposals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch proposals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  const deleteProposal = async (id: string) => {
    try {
      setLoading(true);
      await proposalService.deleteProposal(id);
      setProposals((prevProposals) => prevProposals.filter((proposal) => proposal.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete proposal');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    proposals,
    loading,
    error,
    refreshProposals: fetchProposals,
    deleteProposal,
  };
}

export function useProposal(id?: string) {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(id !== undefined);
  const [error, setError] = useState<string | null>(null);

  const fetchProposal = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await proposalService.getProposal(id);
      setProposal(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch proposal');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProposal();
    }
  }, [id, fetchProposal]);

  const updateProposal = async (data: Partial<Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>>) => {
    if (!id || !proposal) return null;
    
    try {
      setLoading(true);
      setError(null);
      const updatedProposal = await proposalService.updateProposal(id, data);
      setProposal(updatedProposal);
      return updatedProposal;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update proposal');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createProposal = async (data: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const newProposal = await proposalService.createProposal(data);
      setProposal(newProposal);
      return newProposal;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create proposal');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    proposal,
    loading,
    error,
    refreshProposal: fetchProposal,
    updateProposal,
    createProposal,
  };
}

export function useProposalDraft() {
  const [draft, setDraft] = useState<Proposal>(() => ({
    id: `draft-${Date.now()}`,
    title: 'New Proposal',
    clientName: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [{
      id: `section-${Date.now()}`,
      title: 'Introduction',
      order: 0,
      blocks: []
    }]
  }));
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Update the entire draft
  const updateDraft = (updatedDraft: Proposal) => {
    setDraft(updatedDraft);
    setUnsavedChanges(true);
  };

  // Update specific properties
  const updateProperty = <T extends keyof Omit<Proposal, 'id' | 'createdAt' | 'updatedAt' | 'sections'>>(
    property: T, 
    value: Proposal[T]
  ) => {
    setDraft(prev => ({
      ...prev,
      [property]: value,
      updatedAt: new Date()
    }));
    setUnsavedChanges(true);
  };

  // Add a new section
  const addSection = (title: string = 'New Section') => {
    const newSection = {
      id: `section-${Date.now()}`,
      title,
      order: draft.sections.length,
      blocks: []
    };
    
    setDraft(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
      updatedAt: new Date()
    }));
    setUnsavedChanges(true);
    
    return newSection.id;
  };

  // Update a section
  const updateSection = (sectionId: string, updates: Partial<Omit<ProposalSection, 'id'>>) => {
    setDraft(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? { ...section, ...updates } 
          : section
      ),
      updatedAt: new Date()
    }));
    setUnsavedChanges(true);
  };

  // Delete a section
  const deleteSection = (sectionId: string) => {
    setDraft(prev => {
      const filteredSections = prev.sections.filter(s => s.id !== sectionId);
      
      // Re-order the remaining sections
      const reorderedSections = filteredSections.map((section, index) => ({
        ...section,
        order: index
      }));
      
      return {
        ...prev,
        sections: reorderedSections,
        updatedAt: new Date()
      };
    });
    setUnsavedChanges(true);
  };

  // Add a block to a section
  const addBlock = (sectionId: string, block: Omit<ProposalBlock, 'id' | 'order'>) => {
    const blockId = `block-${Date.now()}`;
    
    setDraft(prev => {
      const sectionIndex = prev.sections.findIndex(s => s.id === sectionId);
      
      if (sectionIndex === -1) return prev;
      
      const updatedSections = [...prev.sections];
      const section = updatedSections[sectionIndex];
      
      updatedSections[sectionIndex] = {
        ...section,
        blocks: [...section.blocks, {
          ...block,
          id: blockId,
          order: section.blocks.length
        }]
      };
      
      return {
        ...prev,
        sections: updatedSections,
        updatedAt: new Date()
      };
    });
    setUnsavedChanges(true);
    
    return blockId;
  };

  // Update a block
  const updateBlock = (sectionId: string, blockId: string, updates: Partial<Omit<ProposalBlock, 'id'>>) => {
    setDraft(prev => {
      const sectionIndex = prev.sections.findIndex(s => s.id === sectionId);
      
      if (sectionIndex === -1) return prev;
      
      const updatedSections = [...prev.sections];
      const section = updatedSections[sectionIndex];
      
      updatedSections[sectionIndex] = {
        ...section,
        blocks: section.blocks.map(block => 
          block.id === blockId 
            ? { ...block, ...updates } 
            : block
        )
      };
      
      return {
        ...prev,
        sections: updatedSections,
        updatedAt: new Date()
      };
    });
    setUnsavedChanges(true);
  };

  // Delete a block
  const deleteBlock = (sectionId: string, blockId: string) => {
    setDraft(prev => {
      const sectionIndex = prev.sections.findIndex(s => s.id === sectionId);
      
      if (sectionIndex === -1) return prev;
      
      const updatedSections = [...prev.sections];
      const section = updatedSections[sectionIndex];
      
      const filteredBlocks = section.blocks.filter(b => b.id !== blockId);
      
      // Re-order the remaining blocks
      const reorderedBlocks = filteredBlocks.map((block, index) => ({
        ...block,
        order: index
      }));
      
      updatedSections[sectionIndex] = {
        ...section,
        blocks: reorderedBlocks
      };
      
      return {
        ...prev,
        sections: updatedSections,
        updatedAt: new Date()
      };
    });
    setUnsavedChanges(true);
  };

  // Reorder blocks within a section
  const reorderBlocks = (sectionId: string, blockIds: string[]) => {
    setDraft(prev => {
      const sectionIndex = prev.sections.findIndex(s => s.id === sectionId);
      
      if (sectionIndex === -1) return prev;
      
      const updatedSections = [...prev.sections];
      const section = updatedSections[sectionIndex];
      
      // Create a map of existing blocks by ID for quick lookup
      const blockMap = new Map(section.blocks.map(block => [block.id, block]));
      
      // Create new blocks array with updated order
      const reorderedBlocks = blockIds.map((id, index) => {
        const block = blockMap.get(id);
        if (!block) return null;
        return { ...block, order: index };
      }).filter(Boolean) as ProposalBlock[];
      
      updatedSections[sectionIndex] = {
        ...section,
        blocks: reorderedBlocks
      };
      
      return {
        ...prev,
        sections: updatedSections,
        updatedAt: new Date()
      };
    });
    setUnsavedChanges(true);
  };

  // Reorder sections
  const reorderSections = (sectionIds: string[]) => {
    setDraft(prev => {
      // Create a map of existing sections by ID for quick lookup
      const sectionMap = new Map(prev.sections.map(section => [section.id, section]));
      
      // Create new sections array with updated order
      const reorderedSections = sectionIds.map((id, index) => {
        const section = sectionMap.get(id);
        if (!section) return null;
        return { ...section, order: index };
      }).filter(Boolean) as ProposalSection[];
      
      return {
        ...prev,
        sections: reorderedSections,
        updatedAt: new Date()
      };
    });
    setUnsavedChanges(true);
  };

  // Get total cost and duration
  const getTotals = useCallback(() => {
    let totalCost = 0;
    let totalDuration = 0;

    draft.sections.forEach(section => {
      section.blocks.forEach(block => {
        const unitPrice = block.overrides.unitPrice !== undefined 
          ? block.overrides.unitPrice 
          : 0; // In a real app, we'd fetch the base block price
          
        const estimatedDuration = block.overrides.estimatedDuration !== undefined
          ? block.overrides.estimatedDuration
          : 0; // In a real app, we'd fetch the base block duration

        totalCost += unitPrice;
        totalDuration += estimatedDuration;
      });
    });

    return { totalCost, totalDuration };
  }, [draft]);

  // Mark draft as saved
  const markAsSaved = () => {
    setUnsavedChanges(false);
  };

  // Duplicate a section
  const duplicateSection = (sectionId: string) => {
    setDraft(prev => {
      const sectionToDuplicate = prev.sections.find(s => s.id === sectionId);
      
      if (!sectionToDuplicate) return prev;
      
      const duplicatedSection = {
        ...sectionToDuplicate,
        id: `section-${Date.now()}`,
        title: `${sectionToDuplicate.title} (Copy)`,
        order: prev.sections.length,
        blocks: sectionToDuplicate.blocks.map(block => ({
          ...block,
          id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        }))
      };
      
      return {
        ...prev,
        sections: [...prev.sections, duplicatedSection],
        updatedAt: new Date()
      };
    });
    setUnsavedChanges(true);
  };

  // Duplicate a block
  const duplicateBlock = (sectionId: string, blockId: string) => {
    setDraft(prev => {
      const sectionIndex = prev.sections.findIndex(s => s.id === sectionId);
      
      if (sectionIndex === -1) return prev;
      
      const updatedSections = [...prev.sections];
      const section = updatedSections[sectionIndex];
      const blockToDuplicate = section.blocks.find(b => b.id === blockId);
      
      if (!blockToDuplicate) return prev;
      
      const duplicatedBlock = {
        ...blockToDuplicate,
        id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        order: section.blocks.length
      };
      
      updatedSections[sectionIndex] = {
        ...section,
        blocks: [...section.blocks, duplicatedBlock]
      };
      
      return {
        ...prev,
        sections: updatedSections,
        updatedAt: new Date()
      };
    });
    setUnsavedChanges(true);
  };

  return {
    draft,
    unsavedChanges,
    updateDraft,
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
    duplicateBlock
  };
}