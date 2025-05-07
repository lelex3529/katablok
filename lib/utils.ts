/**
 * Formats a date in a human-readable format
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Extracts all unique categories from an array of blocks
 */
export function extractUniqueCategories(blocks: any[]): string[] {
  const categories = new Set<string>();
  
  blocks.forEach(block => {
    if (Array.isArray(block.categories)) {
      block.categories.forEach((category: string) => {
        categories.add(category);
      });
    }
  });
  
  return Array.from(categories).sort();
}