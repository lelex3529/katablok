import { Proposal, ProposalBlock, TimelineItem } from '../../types/Proposal';
import { formatDate } from '@/lib/utils';

interface ProposalPdfDocumentProps {
  proposal: Proposal;
}

// Function to get block content considering overrides
const getBlockContent = (block: ProposalBlock) => {
  return (
    block.overrideContent ||
    block.overrides?.content ||
    block.block?.content ||
    ''
  );
};

// Function to get block title considering overrides
const getBlockTitle = (block: ProposalBlock) => {
  return (
    block.overrideTitle || block.overrides?.title || block.block?.title || ''
  );
};

// Function to get block duration considering overrides
const getBlockDuration = (block: ProposalBlock) => {
  return block.overrideDuration !== undefined
    ? block.overrideDuration
    : block.overrides?.estimatedDuration !== undefined
      ? block.overrides.estimatedDuration
      : block.block?.estimatedDuration;
};

// Function to get block price considering overrides
const getBlockPrice = (block: ProposalBlock) => {
  return block.overrideUnitPrice !== undefined
    ? block.overrideUnitPrice
    : block.overrides?.unitPrice !== undefined
      ? block.overrides.unitPrice
      : block.block?.unitPrice;
};

// Calculate timeline data based on sections
const calculateTimeline = (proposal: Proposal) => {
  let currentWeek = 1;
  // Only include sections with a total duration > 0
  return proposal.sections
    .sort((a, b) => a.order - b.order)
    .map((section) => {
      const sectionDuration = section.blocks.reduce((total, block) => {
        const duration = getBlockDuration(block);
        return (
          total +
          (typeof duration === 'number' && !isNaN(duration) ? duration : 0)
        );
      }, 0);
      // Skip sections with no duration
      if (!sectionDuration) return null;
      const durationInWeeks = Math.ceil(sectionDuration / 5);
      const startWeek = section.expectedDeliveryStart || currentWeek;
      const endWeek =
        section.expectedDeliveryEnd || startWeek + durationInWeeks - 1;
      currentWeek = endWeek + 1;
      // Collect block titles for description
      const blockTitles = section.blocks
        .map(getBlockTitle)
        .filter(Boolean)
        .join(', ');
      return {
        name: section.title,
        description: blockTitles,
        startWeek,
        endWeek,
        duration: durationInWeeks,
        durationDays: sectionDuration,
      };
    })
    .filter(Boolean) as TimelineItem[];
};

export default function ProposalPdfDocument({ proposal }: ProposalPdfDocumentProps) {
  // Calculate totals
  const totalDuration = proposal.sections.reduce((total, section) => {
    return (
      total +
      section.blocks.reduce((sectionTotal, block) => {
        const duration = getBlockDuration(block);
        return (
          sectionTotal +
          (typeof duration === 'number' && !isNaN(duration) ? duration : 0)
        );
      }, 0)
    );
  }, 0);

  const totalPrice = proposal.sections.reduce((total, section) => {
    return (
      total +
      section.blocks.reduce((sectionTotal, block) => {
        const price = getBlockPrice(block);
        return (
          sectionTotal +
          (typeof price === 'number' && !isNaN(price) ? price : 0)
        );
      }, 0)
    );
  }, 0);

  // Format the proposal date
  const formattedDate = formatDate(
    proposal.createdAt || new Date().toISOString(),
  );
  
  // Sort sections for display
  const sortedSections = [...proposal.sections].sort(
    (a, b) => a.order - b.order
  );

  // Build TOC items
  const tocItems = [];
  sortedSections.forEach((section, sectionIndex) => {
    const sectionNumber = `${sectionIndex + 1}`;
    tocItems.push({
      id: section.id,
      title: section.title,
      level: 1,
      number: sectionNumber,
    });
    
    const sortedBlocks = [...section.blocks].sort(
      (a, b) => a.order - b.order
    );
    
    sortedBlocks.forEach((block, blockIndex) => {
      const blockNumber = `${sectionNumber}.${blockIndex + 1}`;
      tocItems.push({
        id: block.id,
        title: getBlockTitle(block),
        level: 2,
        number: blockNumber,
      });
    });
  });
  
  // Add special sections to TOC
  tocItems.push({
    id: 'timeline',
    title: 'Chronologie du projet',
    level: 1,
    number: `${sortedSections.length + 1}`,
  });
  
  tocItems.push({
    id: 'budget',
    title: 'Détail du budget',
    level: 1,
    number: `${sortedSections.length + 2}`,
  });
  
  tocItems.push({
    id: 'payment',
    title: 'Modalités de paiement',
    level: 1,
    number: `${sortedSections.length + 3}`,
  });

  // Calculate timeline
  const timeline = calculateTimeline(proposal);
  
  // Calculate total pages
  const baseCount = proposal.introduction ? 3 : 2; // Cover, TOC, Introduction (if present)
  const specialPagesCount = 4; // Timeline, Budget, Payment Terms, Final Contact
  const totalPages = baseCount + sortedSections.length + specialPagesCount;

  // Let's create our page counter
  let currentPageNumber = 1;

  return (
    <div>
      {/* Cover page */}
      <div className="a4-page">
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <img 
              src="/katalyx-logo.png" 
              alt="Katalyx Logo" 
              style={{ height: '50px', marginBottom: '4rem' }}
            />
            
            <div style={{ marginTop: '7rem', marginBottom: '3rem' }}>
              <h1 style={{ fontSize: '36px', color: '#0F766E', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                {proposal.title}
              </h1>
              
              <p style={{ fontSize: '18px', color: '#374151', marginBottom: '2rem' }}>
                Préparé pour <strong>{proposal.clientName}</strong>
              </p>
              
              <p style={{ fontSize: '14px', color: '#6B7280' }}>
                {formattedDate}
              </p>
            </div>
          </div>
          
          <div>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '0.25rem' }}>
              Katalyx SAS
            </p>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '0.25rem' }}>
              contact@katalyx.dev
            </p>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>
              www.katalyx.dev
            </p>
          </div>
        </div>
        
        <div className="footer-container">
          <p>Page {currentPageNumber++} sur {totalPages}</p>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="a4-page page-break">
        <h2 style={{ fontSize: '24px', color: '#0F766E', fontWeight: 'bold', marginBottom: '2rem' }}>
          Table des matières
        </h2>
        
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tocItems.map((item) => (
            <li key={item.id} style={{ 
              marginLeft: item.level === 1 ? 0 : '20px',
              marginBottom: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ 
                  marginRight: '0.75rem',
                  fontWeight: item.level === 1 ? 'bold' : 'normal'
                }}>
                  {item.number}
                </span>
                <span style={{ 
                  fontWeight: item.level === 1 ? 'bold' : 'normal',
                  fontSize: item.level === 1 ? '16px' : '14px'
                }}>
                  {item.title}
                </span>
              </div>
            </li>
          ))}
        </ul>
        
        <div className="footer-container">
          <p>Page {currentPageNumber++} sur {totalPages}</p>
        </div>
      </div>

      {/* Introduction if available */}
      {proposal.introduction && proposal.introduction.trim() && (
        <div className="a4-page page-break">
          <h2 style={{ fontSize: '24px', color: '#0F766E', fontWeight: 'bold', marginBottom: '2rem' }}>
            Introduction
          </h2>
          
          <div className="prose" dangerouslySetInnerHTML={{ __html: proposal.introduction }} />
          
          <div className="footer-container">
            <p>Page {currentPageNumber++} sur {totalPages}</p>
          </div>
        </div>
      )}

      {/* Content pages - sections and blocks */}
      {sortedSections.map((section, sectionIndex) => {
        const sectionNumber = sectionIndex + 1;
        const sortedBlocks = [...section.blocks].sort((a, b) => a.order - b.order);
        
        return (
          <div key={section.id} id={`section-${section.id}`} className="a4-page page-break">
            <h2 style={{ fontSize: '24px', color: '#0F766E', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              {sectionNumber}. {section.title}
            </h2>
            
            {section.description && (
              <p style={{ marginBottom: '2rem', color: '#4B5563' }}>
                {section.description}
              </p>
            )}
            
            {sortedBlocks.map((block, blockIndex) => {
              const blockNumber = `${sectionNumber}.${blockIndex + 1}`;
              const blockTitle = getBlockTitle(block);
              const blockContent = getBlockContent(block);
              const duration = getBlockDuration(block);
              const price = getBlockPrice(block);
              
              return (
                <div 
                  key={block.id} 
                  id={`block-${block.id}`} 
                  style={{ marginBottom: '2rem' }}
                >
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1rem' }}>
                    {blockNumber} {blockTitle}
                  </h3>
                  
                  {blockContent && (
                    <div 
                      className="prose" 
                      dangerouslySetInnerHTML={{ __html: blockContent }}
                      style={{ marginBottom: '1rem' }}
                    />
                  )}
                  
                  <div style={{ display: 'flex', marginTop: '1rem' }}>
                    {typeof duration === 'number' && !isNaN(duration) && (
                      <div style={{ marginRight: '2rem' }}>
                        <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '0.25rem' }}>
                          Durée estimée
                        </p>
                        <p style={{ fontWeight: 'bold' }}>
                          {duration} jour{duration > 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                    
                    {typeof price === 'number' && !isNaN(price) && (
                      <div>
                        <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '0.25rem' }}>
                          Budget
                        </p>
                        <p style={{ fontWeight: 'bold', color: '#0F766E' }}>
                          {price.toLocaleString()}€
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            <div className="footer-container">
              <p>Page {currentPageNumber++} sur {totalPages}</p>
            </div>
          </div>
        );
      })}

      {/* Timeline page */}
      <div className="a4-page page-break" id="section-timeline">
        <h2 style={{ fontSize: '24px', color: '#0F766E', fontWeight: 'bold', marginBottom: '2rem' }}>
          Chronologie du projet
        </h2>
        
        {timeline.length > 0 ? (
          <div>
            <p style={{ marginBottom: '1.5rem' }}>
              Durée totale estimée: <strong>{totalDuration} jours</strong> ({Math.ceil(totalDuration / 5)} semaines)
            </p>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Phase</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Description</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Durée</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Semaines</th>
                </tr>
              </thead>
              <tbody>
                {timeline.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: '10px', borderBottom: '1px solid #E5E7EB', fontWeight: 'bold' }}>{item.name}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #E5E7EB' }}>{item.description}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #E5E7EB' }}>{item.durationDays} jours</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #E5E7EB' }}>
                      {item.startWeek === item.endWeek 
                        ? `Semaine ${item.startWeek}` 
                        : `Semaine ${item.startWeek} à ${item.endWeek}`
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Aucune donnée de chronologie disponible.</p>
        )}
        
        <div className="footer-container">
          <p>Page {currentPageNumber++} sur {totalPages}</p>
        </div>
      </div>

      {/* Budget page */}
      <div className="a4-page page-break" id="section-budget">
        <h2 style={{ fontSize: '24px', color: '#0F766E', fontWeight: 'bold', marginBottom: '2rem' }}>
          Détail du budget
        </h2>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Section / Tâche</th>
              <th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #E5E7EB' }}>Montant</th>
            </tr>
          </thead>
          <tbody>
            {sortedSections.map((section) => {
              // Calculate section total
              const sectionTotal = section.blocks.reduce((total, block) => {
                const price = getBlockPrice(block);
                return total + (typeof price === 'number' && !isNaN(price) ? price : 0);
              }, 0);
              
              const sortedBlocks = [...section.blocks]
                .sort((a, b) => a.order - b.order)
                .filter((block) => {
                  const price = getBlockPrice(block);
                  return typeof price === 'number' && !isNaN(price) && price > 0;
                });
              
              return [
                // Section row
                <tr key={section.id}>
                  <td style={{ 
                    padding: '10px', 
                    borderBottom: '1px solid #E5E7EB',
                    fontWeight: 'bold'
                  }}>
                    {section.title}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    borderBottom: '1px solid #E5E7EB', 
                    textAlign: 'right',
                    fontWeight: 'bold'
                  }}>
                    {sectionTotal.toLocaleString()}€
                  </td>
                </tr>,
                
                // Block rows
                ...sortedBlocks.map((block) => {
                  const price = getBlockPrice(block);
                  return (
                    <tr key={block.id}>
                      <td style={{ 
                        padding: '10px', 
                        borderBottom: '1px solid #E5E7EB',
                        paddingLeft: '30px' // Indent to show hierarchy
                      }}>
                        {getBlockTitle(block)}
                      </td>
                      <td style={{ 
                        padding: '10px', 
                        borderBottom: '1px solid #E5E7EB', 
                        textAlign: 'right'
                      }}>
                        {(typeof price === 'number' ? price.toLocaleString() : 0)}€
                      </td>
                    </tr>
                  );
                })
              ];
            })}
            
            {/* Total row */}
            <tr>
              <td style={{ 
                padding: '12px 10px', 
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                Total
              </td>
              <td style={{ 
                padding: '12px 10px', 
                fontWeight: 'bold',
                fontSize: '18px',
                textAlign: 'right',
                color: '#0F766E'
              }}>
                {totalPrice.toLocaleString()}€
              </td>
            </tr>
          </tbody>
        </table>
        
        <div className="footer-container">
          <p>Page {currentPageNumber++} sur {totalPages}</p>
        </div>
      </div>

      {/* Payment Terms page */}
      <div className="a4-page page-break" id="section-payment">
        <h2 style={{ fontSize: '24px', color: '#0F766E', fontWeight: 'bold', marginBottom: '2rem' }}>
          Modalités de paiement
        </h2>
        
        {(proposal.paymentTerms && proposal.paymentTerms.length > 0) ? (
          <div>
            <p style={{ marginBottom: '1.5rem' }}>
              Le paiement sera effectué selon les modalités suivantes:
            </p>
            
            <ul style={{ paddingLeft: '20px', marginBottom: '2rem' }}>
              {proposal.paymentTerms.map((term, index) => (
                <li key={index} style={{ marginBottom: '1rem' }}>
                  <strong>{term.label}</strong> ({Math.round(totalPrice * term.percent / 100).toLocaleString()}€)
                  &nbsp;{term.trigger}
                </li>
              ))}
            </ul>
            
            <p>
              Le paiement devra être effectué par virement bancaire à réception de la facture.
              Les délais de paiement sont de 30 jours à compter de la date d'émission de la facture.
            </p>
          </div>
        ) : (
          <p>Aucune modalité de paiement n'a été définie.</p>
        )}
        
        <div className="footer-container">
          <p>Page {currentPageNumber++} sur {totalPages}</p>
        </div>
      </div>

      {/* Final Contact Page */}
      <div className="a4-page page-break">
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h2 style={{ fontSize: '24px', color: '#0F766E', fontWeight: 'bold', marginBottom: '3rem' }}>
            Contactez-nous
          </h2>
          
          <div style={{ marginBottom: '3rem' }}>
            <p style={{ marginBottom: '0.5rem', fontSize: '18px' }}>Katalyx SAS</p>
            <p style={{ marginBottom: '0.5rem' }}>
              <a href="mailto:contact@katalyx.dev" style={{ color: '#0F766E', textDecoration: 'none' }}>
                contact@katalyx.dev
              </a>
            </p>
            <p>
              <a href="https://www.katalyx.dev" style={{ color: '#0F766E', textDecoration: 'none' }}>
                www.katalyx.dev
              </a>
            </p>
          </div>
          
          <p style={{ color: '#6B7280', maxWidth: '500px', margin: '0 auto' }}>
            Merci de nous avoir accordé l'opportunité de vous proposer nos services. 
            Nous sommes impatients de collaborer avec vous sur ce projet.
          </p>
        </div>
        
        <div className="footer-container">
          <p>Page {currentPageNumber++} sur {totalPages}</p>
        </div>
      </div>
    </div>
  );
}