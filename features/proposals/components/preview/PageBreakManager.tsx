import React, { useState, useEffect, ReactNode, Children } from 'react';
import ContentContainer from './ContentContainer';
import KatalyxFooter from './KatalyxFooter';

interface PageBreakManagerProps {
  children: ReactNode;
  proposalId?: string;
  pageNumber: number;
  totalPages: number;
}

/**
 * PageBreakManager component that automatically splits content across multiple pages
 * when it exceeds the height of an A4 page
 */
export default function PageBreakManager({
  children,
  proposalId,
  pageNumber,
  totalPages,
}: PageBreakManagerProps) {
  const [pages, setPages] = useState<ReactNode[]>([]);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const maxContentHeight = 980; // Approximate A4 height minus margins and footer (in pixels)

  // Function to handle content overflow detection
  const handleContentOverflow = (isOverflowing: boolean, height: number) => {
    setContentHeight(height);
  };

  // Split content into pages when children or contentHeight changes
  useEffect(() => {
    // If content fits on a single page, no need to split
    if (contentHeight <= maxContentHeight || !children) {
      setPages([children]);
      return;
    }

    // For more complex content, we would need a more sophisticated algorithm
    // that analyzes each child element and creates breaks at appropriate points
    // This is a simplified approach that splits content after certain elements

    // Convert children to array for processing
    const childrenArray = Children.toArray(children);

    // Simple approach: try to divide content into roughly equal pages
    const approximateItemsPerPage = Math.ceil(
      childrenArray.length / Math.ceil(contentHeight / maxContentHeight),
    );

    // Split into pages
    const newPages: ReactNode[][] = [];
    for (let i = 0; i < childrenArray.length; i += approximateItemsPerPage) {
      newPages.push(childrenArray.slice(i, i + approximateItemsPerPage));
    }

    setPages(newPages);
  }, [children, contentHeight, maxContentHeight]);

  // If we don't have multiple pages yet, render a single container to measure height
  if (pages.length <= 1) {
    return (
      <div className='a4-page'>
        <ContentContainer
          proposalId={proposalId}
          onContentOverflow={handleContentOverflow}
        >
          {children}
        </ContentContainer>
        <div className='footer-container'>
          <KatalyxFooter page={pageNumber} total={totalPages} />
        </div>
      </div>
    );
  }

  // Render multiple pages with the split content
  return (
    <>
      {pages.map((pageContent, index) => (
        <div
          key={index}
          className={index > 0 ? 'a4-page page-break-before' : 'a4-page'}
        >
          <ContentContainer proposalId={proposalId} showHeader={true}>
            {pageContent}
          </ContentContainer>
          <div className='footer-container'>
            <KatalyxFooter
              page={pageNumber + index}
              total={totalPages + pages.length - 1}
            />
          </div>
        </div>
      ))}
    </>
  );
}
