import puppeteer from 'puppeteer';
import { Proposal } from '../types/Proposal';
import { formatDate } from '@/lib/utils';

/**
 * Generates a PDF from a proposal
 *
 * @param proposal The proposal to generate a PDF for
 * @returns Buffer containing the generated PDF
 */
export async function generateProposalPdf(proposal: Proposal): Promise<Buffer> {
  // Generate HTML content for the proposal
  const htmlContent = generateProposalHtml(proposal);

  // Launch a headless browser
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    // Create a new page
    const page = await browser.newPage();

    // Set content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate PDF with A4 size
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
      displayHeaderFooter: false,
    });

    return pdfBuffer;
  } finally {
    // Always close the browser
    await browser.close();
  }
}

/**
 * Gets the filename for a proposal PDF
 *
 * @param proposal The proposal
 * @returns A sanitized filename
 */
export function getProposalPdfFilename(proposal: Proposal): string {
  // Create a sanitized filename
  const clientName =
    proposal.clientName?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'client';
  const title =
    proposal.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'proposal';
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  return `katalyx_proposal_${clientName}_${title}_${date}.pdf`;
}

/**
 * Function to get block content considering overrides
 */
function getBlockContent(block: any): string {
  return (
    block.overrideContent ||
    block.overrides?.content ||
    block.block?.content ||
    ''
  );
}

/**
 * Function to get block title considering overrides
 */
function getBlockTitle(block: any): string {
  return (
    block.overrideTitle || block.overrides?.title || block.block?.title || ''
  );
}

/**
 * Function to get block duration considering overrides
 */
function getBlockDuration(block: any): number | undefined {
  return block.overrideDuration !== undefined
    ? block.overrideDuration
    : block.overrides?.estimatedDuration !== undefined
      ? block.overrides.estimatedDuration
      : block.block?.estimatedDuration;
}

/**
 * Function to get block price considering overrides
 */
function getBlockPrice(block: any): number | undefined {
  return block.overrideUnitPrice !== undefined
    ? block.overrideUnitPrice
    : block.overrides?.unitPrice !== undefined
      ? block.overrides.unitPrice
      : block.block?.unitPrice;
}

/**
 * Calculate total duration of a proposal
 */
function calculateTotalDuration(proposal: Proposal): number {
  return proposal.sections.reduce((total, section) => {
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
}

/**
 * Calculate total price of a proposal
 */
function calculateTotalPrice(proposal: Proposal): number {
  return proposal.sections.reduce((total, section) => {
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
}

/**
 * Calculate timeline data based on sections
 */
function calculateTimeline(proposal: Proposal) {
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
    .filter(Boolean);
}

/**
 * Generates HTML content for a proposal
 */
function generateProposalHtml(proposal: Proposal): string {
  // Format the proposal date
  const formattedDate = formatDate(
    proposal.createdAt || new Date().toISOString(),
  );

  // Sort sections for display
  const sortedSections = [...proposal.sections].sort(
    (a, b) => a.order - b.order,
  );

  // Calculate totals
  const totalDuration = calculateTotalDuration(proposal);
  const totalPrice = calculateTotalPrice(proposal);

  // Calculate timeline
  const timeline = calculateTimeline(proposal);

  // Generate TOC items
  const tocItems = [];
  sortedSections.forEach((section, sectionIndex) => {
    const sectionNumber = `${sectionIndex + 1}`;
    tocItems.push({
      id: section.id,
      title: section.title,
      level: 1,
      number: sectionNumber,
    });

    const sortedBlocks = [...section.blocks].sort((a, b) => a.order - b.order);
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

  // Calculate total pages
  const basePages = proposal.introduction ? 3 : 2; // Cover, TOC, and Introduction (if present)
  const specialPages = 4; // Timeline, Budget, Payment Terms, Contact
  const totalPages = basePages + sortedSections.length + specialPages;

  // Initialize page counter for footer
  let currentPage = 1;

  // Build the HTML document
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${proposal.title || 'Proposition'} - ${proposal.clientName || 'Client'}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@400;600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
          color: #111827;
          line-height: 1.5;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Sora', sans-serif;
        }

        .a4-page {
          width: 210mm;
          height: 297mm;
          padding: 20mm;
          margin: 0 auto;
          position: relative;
          page-break-after: always;
        }

        .footer-container {
          position: absolute;
          bottom: 20mm;
          left: 20mm;
          right: 20mm;
          text-align: center;
          font-size: 9pt;
          color: #6B7280;
        }
        
        .page-break {
          page-break-before: always;
        }
        
        .text-katalyx-primary {
          color: #0F766E;
        }
        
        .bg-katalyx-primary {
          background-color: #0F766E;
        }
        
        .border-katalyx-primary {
          border-color: #0F766E;
        }
        
        .text-katalyx-secondary {
          color: #134E4A;
        }
        
        .grid {
          display: grid;
        }
        
        .prose {
          max-width: 65ch;
        }
        
        .prose p {
          margin-top: 1.25em;
          margin-bottom: 1.25em;
        }
        
        .prose h1, .prose h2, .prose h3 {
          margin-top: 2em;
          margin-bottom: 1em;
          font-weight: 600;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        table th, table td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #E5E7EB;
        }
        
        table th {
          font-weight: 600;
          background-color: #F9FAFB;
        }

        ul {
          padding-left: 20px;
        }

        @media print {
          .a4-page {
            margin: 0;
            padding: 10mm;
          }
        }
      </style>
    </head>
    <body>
      <!-- Cover Page -->
      <div class="a4-page">
        <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between;">
          <div>
            <div style="height: 50px; margin-bottom: 4rem; display: flex; align-items: center;">
              <span style="font-size: 24px; font-weight: 700; color: #0F766E;">KATALYX</span>
            </div>
            
            <div style="margin-top: 7rem; margin-bottom: 3rem;">
              <h1 style="font-size: 36px; color: #0F766E; font-weight: bold; margin-bottom: 1.5rem;">
                ${proposal.title}
              </h1>
              
              <p style="font-size: 18px; color: #374151; margin-bottom: 2rem;">
                Préparé pour <strong>${proposal.clientName}</strong>
              </p>
              
              <p style="font-size: 14px; color: #6B7280;">
                ${formattedDate}
              </p>
            </div>
          </div>
          
          <div>
            <p style="font-size: 14px; color: #6B7280; margin-bottom: 0.25rem;">
              Katalyx SAS
            </p>
            <p style="font-size: 14px; color: #6B7280; margin-bottom: 0.25rem;">
              contact@katalyx.dev
            </p>
            <p style="font-size: 14px; color: #6B7280;">
              www.katalyx.dev
            </p>
          </div>
        </div>
        
        <div class="footer-container">
          <p>Page ${currentPage++} sur ${totalPages}</p>
        </div>
      </div>

      <!-- Table of Contents -->
      <div class="a4-page page-break">
        <h2 style="font-size: 24px; color: #0F766E; font-weight: bold; margin-bottom: 2rem;">
          Table des matières
        </h2>
        
        <ul style="list-style: none; padding: 0;">
          ${tocItems
            .map(
              (item) => `
            <li style="
              margin-left: ${item.level === 1 ? 0 : '20px'}; 
              margin-bottom: 0.75rem;
            ">
              <div style="display: flex; align-items: center;">
                <span style="
                  margin-right: 0.75rem;
                  font-weight: ${item.level === 1 ? 'bold' : 'normal'};
                ">
                  ${item.number}
                </span>
                <span style="
                  font-weight: ${item.level === 1 ? 'bold' : 'normal'};
                  font-size: ${item.level === 1 ? '16px' : '14px'};
                ">
                  ${item.title}
                </span>
              </div>
            </li>
          `,
            )
            .join('')}
        </ul>
        
        <div class="footer-container">
          <p>Page ${currentPage++} sur ${totalPages}</p>
        </div>
      </div>

      <!-- Introduction (if available) -->
      ${
        proposal.introduction && proposal.introduction.trim()
          ? `
        <div class="a4-page page-break">
          <h2 style="font-size: 24px; color: #0F766E; font-weight: bold; margin-bottom: 2rem;">
            Introduction
          </h2>
          
          <div class="prose">${proposal.introduction}</div>
          
          <div class="footer-container">
            <p>Page ${currentPage++} sur ${totalPages}</p>
          </div>
        </div>
      `
          : ''
      }

      <!-- Sections and Blocks -->
      ${sortedSections
        .map((section, sectionIndex) => {
          const sectionNumber = sectionIndex + 1;
          const sortedBlocks = [...section.blocks].sort(
            (a, b) => a.order - b.order,
          );

          return `
          <div id="section-${section.id}" class="a4-page page-break">
            <h2 style="font-size: 24px; color: #0F766E; font-weight: bold; margin-bottom: 1.5rem;">
              ${sectionNumber}. ${section.title}
            </h2>
            
            ${
              section.description
                ? `
              <p style="margin-bottom: 2rem; color: #4B5563;">
                ${section.description}
              </p>
            `
                : ''
            }
            
            ${sortedBlocks
              .map((block, blockIndex) => {
                const blockNumber = `${sectionNumber}.${blockIndex + 1}`;
                const blockTitle = getBlockTitle(block);
                const blockContent = getBlockContent(block);
                const duration = getBlockDuration(block);
                const price = getBlockPrice(block);

                return `
                <div id="block-${block.id}" style="margin-bottom: 2rem;">
                  <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 1rem;">
                    ${blockNumber} ${blockTitle}
                  </h3>
                  
                  ${
                    blockContent
                      ? `
                    <div class="prose" style="margin-bottom: 1rem;">
                      ${blockContent}
                    </div>
                  `
                      : ''
                  }
                  
                  <div style="display: flex; margin-top: 1rem;">
                    ${
                      typeof duration === 'number' && !isNaN(duration)
                        ? `
                      <div style="margin-right: 2rem;">
                        <p style="font-size: 14px; color: #6B7280; margin-bottom: 0.25rem;">
                          Durée estimée
                        </p>
                        <p style="font-weight: bold;">
                          ${duration} jour${duration > 1 ? 's' : ''}
                        </p>
                      </div>
                    `
                        : ''
                    }
                    
                    ${
                      typeof price === 'number' && !isNaN(price)
                        ? `
                      <div>
                        <p style="font-size: 14px; color: #6B7280; margin-bottom: 0.25rem;">
                          Budget
                        </p>
                        <p style="font-weight: bold; color: #0F766E;">
                          ${price.toLocaleString()}€
                        </p>
                      </div>
                    `
                        : ''
                    }
                  </div>
                </div>
              `;
              })
              .join('')}
            
            <div class="footer-container">
              <p>Page ${currentPage++} sur ${totalPages}</p>
            </div>
          </div>
        `;
        })
        .join('')}

      <!-- Timeline Page -->
      <div class="a4-page page-break" id="section-timeline">
        <h2 style="font-size: 24px; color: #0F766E; font-weight: bold; margin-bottom: 2rem;">
          Chronologie du projet
        </h2>
        
        ${
          timeline.length > 0
            ? `
          <div>
            <p style="margin-bottom: 1.5rem;">
              Durée totale estimée: <strong>${totalDuration} jours</strong> (${Math.ceil(totalDuration / 5)} semaines)
            </p>
            
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="padding: 10px; text-align: left; border-bottom: 1px solid #E5E7EB;">Phase</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 1px solid #E5E7EB;">Description</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 1px solid #E5E7EB;">Durée</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 1px solid #E5E7EB;">Semaines</th>
                </tr>
              </thead>
              <tbody>
                ${timeline
                  .map(
                    (item: any) => `
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">${item.name}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #E5E7EB;">${item.description}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #E5E7EB;">${item.durationDays} jours</td>
                    <td style="padding: 10px; border-bottom: 1px solid #E5E7EB;">
                      ${
                        item.startWeek === item.endWeek
                          ? `Semaine ${item.startWeek}`
                          : `Semaine ${item.startWeek} à ${item.endWeek}`
                      }
                    </td>
                  </tr>
                `,
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        `
            : `
          <p>Aucune donnée de chronologie disponible.</p>
        `
        }
        
        <div class="footer-container">
          <p>Page ${currentPage++} sur ${totalPages}</p>
        </div>
      </div>

      <!-- Budget Page -->
      <div class="a4-page page-break" id="section-budget">
        <h2 style="font-size: 24px; color: #0F766E; font-weight: bold; margin-bottom: 2rem;">
          Détail du budget
        </h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #E5E7EB;">Section / Tâche</th>
              <th style="padding: 10px; text-align: right; border-bottom: 1px solid #E5E7EB;">Montant</th>
            </tr>
          </thead>
          <tbody>
            ${sortedSections
              .map((section) => {
                const sectionTotal = section.blocks.reduce((total, block) => {
                  const price = getBlockPrice(block);
                  return (
                    total +
                    (typeof price === 'number' && !isNaN(price) ? price : 0)
                  );
                }, 0);

                const sortedBlocks = [...section.blocks]
                  .sort((a, b) => a.order - b.order)
                  .filter((block) => {
                    const price = getBlockPrice(block);
                    return (
                      typeof price === 'number' && !isNaN(price) && price > 0
                    );
                  });

                const sectionRow = `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">
                    ${section.title}
                  </td>
                  <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; text-align: right; font-weight: bold;">
                    ${sectionTotal.toLocaleString()}€
                  </td>
                </tr>
              `;

                const blockRows = sortedBlocks
                  .map((block) => {
                    const price = getBlockPrice(block);
                    return `
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; padding-left: 30px;">
                      ${getBlockTitle(block)}
                    </td>
                    <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; text-align: right;">
                      ${typeof price === 'number' ? price.toLocaleString() : 0}€
                    </td>
                  </tr>
                `;
                  })
                  .join('');

                return sectionRow + blockRows;
              })
              .join('')}
            
            <!-- Total row -->
            <tr>
              <td style="padding: 12px 10px; font-weight: bold; font-size: 18px;">
                Total
              </td>
              <td style="padding: 12px 10px; font-weight: bold; font-size: 18px; text-align: right; color: #0F766E;">
                ${totalPrice.toLocaleString()}€
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="footer-container">
          <p>Page ${currentPage++} sur ${totalPages}</p>
        </div>
      </div>

      <!-- Payment Terms Page -->
      <div class="a4-page page-break" id="section-payment">
        <h2 style="font-size: 24px; color: #0F766E; font-weight: bold; margin-bottom: 2rem;">
          Modalités de paiement
        </h2>
        
        ${
          proposal.paymentTerms && proposal.paymentTerms.length > 0
            ? `
          <div>
            <p style="margin-bottom: 1.5rem;">
              Le paiement sera effectué selon les modalités suivantes:
            </p>
            
            <ul style="padding-left: 20px; margin-bottom: 2rem;">
              ${proposal.paymentTerms
                .map(
                  (term: any) => `
                <li style="margin-bottom: 1rem;">
                  <strong>${term.label}</strong> (${Math.round((totalPrice * term.percent) / 100).toLocaleString()}€)
                  &nbsp;${term.trigger}
                </li>
              `,
                )
                .join('')}
            </ul>
            
            <p>
              Le paiement devra être effectué par virement bancaire à réception de la facture.
              Les délais de paiement sont de 30 jours à compter de la date d'émission de la facture.
            </p>
          </div>
        `
            : `
          <p>Aucune modalité de paiement n'a été définie.</p>
        `
        }
        
        <div class="footer-container">
          <p>Page ${currentPage++} sur ${totalPages}</p>
        </div>
      </div>

      <!-- Contact Page -->
      <div class="a4-page page-break">
        <div style="text-align: center; margin-top: 4rem;">
          <h2 style="font-size: 24px; color: #0F766E; font-weight: bold; margin-bottom: 3rem;">
            Contactez-nous
          </h2>
          
          <div style="margin-bottom: 3rem;">
            <p style="margin-bottom: 0.5rem; font-size: 18px;">Katalyx SAS</p>
            <p style="margin-bottom: 0.5rem;">
              <a href="mailto:contact@katalyx.dev" style="color: #0F766E; text-decoration: none;">
                contact@katalyx.dev
              </a>
            </p>
            <p>
              <a href="https://www.katalyx.dev" style="color: #0F766E; text-decoration: none;">
                www.katalyx.dev
              </a>
            </p>
          </div>
          
          <p style="color: #6B7280; max-width: 500px; margin: 0 auto;">
            Merci de nous avoir accordé l'opportunité de vous proposer nos services. 
            Nous sommes impatients de collaborer avec vous sur ce projet.
          </p>
        </div>
        
        <div class="footer-container">
          <p>Page ${currentPage++} sur ${totalPages}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
