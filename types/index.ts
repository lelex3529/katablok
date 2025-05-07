// /types/index.ts

/**
 * Represents a generic content block in the editor.
 * This is a placeholder and can be expanded based on specific block types.
 */
export interface Block {
  id: string;
  type: string; // e.g., 'paragraph', 'heading', 'image', 'list'
  content: any; // Content can vary greatly depending on the block type
  attributes?: Record<string, any>; // Optional attributes for styling or behavior
}

/**
 * Represents a commercial proposal.
 */
export interface Proposal {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string; // Assuming association with a user
  blocks: Block[]; // The content of the proposal, composed of blocks
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'archived';
  // Add other relevant fields like client info, total amount, etc.
}

/**
 * Represents a user of the application.
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  // Add other relevant fields like subscription status, roles, etc.
}

// You can add more global types here as the project grows.
// For example, types for API responses, specific form inputs, etc.
