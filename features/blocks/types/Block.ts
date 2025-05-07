// Block interface definition for the block management feature
export interface Block {
  id: string;
  title: string;
  content: string;
  categories: string[];
  estimatedDuration: number;
  unitPrice: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}