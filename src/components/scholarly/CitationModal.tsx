// ============================================================================
// CITATION MODAL COMPONENT
// ============================================================================
// Modern citation system supporting multiple formats
// Inspired by Nature, Science, IEEE Xplore, and other top publishing houses
// ============================================================================

import React, { useState } from 'react';
import { X, Copy, Check, FileText, BookOpen, GraduationCap, Code, Download } from 'lucide-react';
import { toast } from 'sonner';

export interface CitationData {
  title: string;
  authors: Array<{ name: string; affiliation?: string; is_corresponding?: boolean }>;
  publishedAt?: string;
  submittedAt?: string;
  journal?: string;
  institution?: string;
  doi?: string;
  url?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  abstract?: string;
}

interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  citationData: CitationData;
}

type CitationFormat = 'apa' | 'mla' | 'chicago' | 'harvard' | 'ieee' | 'vancouver' | 'bibtex' | 'ris';

const CitationModal: React.FC<CitationModalProps> = ({ isOpen, onClose, citationData }) => {
  const [selectedFormat, setSelectedFormat] = useState<CitationFormat>('apa');
  const [copiedFormat, setCopiedFormat] = useState<CitationFormat | null>(null);

  if (!isOpen) return null;

  const formatAuthorName = (name: string, format: CitationFormat): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return name;
    
    if (format === 'mla' || format === 'chicago') {
      // Last, First Middle
      if (parts.length === 1) return parts[0];
      const last = parts[parts.length - 1];
      const first = parts.slice(0, -1).join(' ');
      return `${last}, ${first}`;
    } else if (format === 'harvard') {
      // Last, F. M.
      if (parts.length === 1) return parts[0];
      const last = parts[parts.length - 1];
      const initials = parts.slice(0, -1).map(p => p[0]?.toUpperCase() || '').join('. ');
      return `${last}, ${initials}.`;
    } else {
      // APA, IEEE, Vancouver: Last, F. M.
      if (parts.length === 1) return parts[0];
      const last = parts[parts.length - 1];
      const initials = parts.slice(0, -1).map(p => p[0]?.toUpperCase() || '').join('. ');
      return `${last}, ${initials}.`;
    }
  };

  const formatAuthors = (format: CitationFormat): string => {
    if (!citationData.authors || citationData.authors.length === 0) {
      return 'Anonymous';
    }

    const formatted = citationData.authors.map(author => formatAuthorName(author.name, format));

    if (format === 'apa' || format === 'harvard') {
      if (formatted.length === 1) return formatted[0];
      if (formatted.length === 2) return `${formatted[0]} & ${formatted[1]}`;
      return `${formatted.slice(0, -1).join(', ')}, & ${formatted[formatted.length - 1]}`;
    } else if (format === 'mla') {
      if (formatted.length === 1) return formatted[0];
      if (formatted.length === 2) return `${formatted[0]} and ${formatted[1]}`;
      if (formatted.length <= 3) return formatted.join(', ');
      return `${formatted[0]}, et al.`;
    } else if (format === 'chicago') {
      if (formatted.length === 1) return formatted[0];
      if (formatted.length === 2) return `${formatted[0]} and ${formatted[1]}`;
      if (formatted.length <= 10) return formatted.join(', ');
      return `${formatted[0]} et al.`;
    } else if (format === 'ieee') {
      if (formatted.length === 1) return formatted[0];
      if (formatted.length <= 6) return formatted.join(', ');
      return `${formatted[0]} et al.`;
    } else if (format === 'vancouver') {
      return formatted.join(', ');
    }

    return formatted.join(', ');
  };

  const formatDate = (format: CitationFormat): string => {
    const dateStr = citationData.publishedAt || citationData.submittedAt;
    if (!dateStr) return 'n.d.';

    const date = new Date(dateStr);
    const year = date.getFullYear();

    // All academic citation styles use only the year
    return year.toString();
  };

  const generateCitation = (format: CitationFormat): string => {
    const authors = formatAuthors(format);
    const date = formatDate(format);
    const title = citationData.title || 'Untitled';
    const journal = citationData.journal || 'Ghana National Resource System';
    const institution = citationData.institution || '';
    const doi = citationData.doi || '';
    const url = citationData.url || window.location.href;
    const volume = citationData.volume || '';
    const issue = citationData.issue || '';
    const pages = citationData.pages || '';

    switch (format) {
      case 'apa':
        // APA 7th Edition: Author, A. A., & Author, B. B. (Year). Title of article. Journal Title, Volume(Issue), pages. https://doi.org/xx
        const apaVolume = volume ? `, ${volume}` : '';
        const apaIssue = issue ? `(${issue})` : '';
        const apaPages = pages ? `, ${pages}` : '';
        return `${authors} (${date}). ${title}. *${journal}*${apaVolume}${apaIssue}${apaPages}.${doi ? ` https://doi.org/${doi}` : ''}`;

      case 'mla':
        // MLA 9th Edition: Last, First. "Title of Article." Journal Title, vol. #, no. #, Year, pp. pages. DOI
        const mlaVol = volume ? `, vol. ${volume}` : '';
        const mlaNo = issue ? `, no. ${issue}` : '';
        const mlaPages = pages ? `, pp. ${pages}` : '';
        return `${authors}. "${title}." *${journal}*${mlaVol}${mlaNo}, ${date}${mlaPages}${doi ? `. https://doi.org/${doi}` : ''}.`;

      case 'chicago':
        // Chicago Author-Date: Lastname, Firstname. Year. "Title of Article." Journal Title Volume, no. Issue: pages. DOI
        const chicagoVol = volume ? ` ${volume}` : '';
        const chicagoNo = issue ? `, no. ${issue}` : '';
        const chicagoPages = pages ? `: ${pages}` : '';
        return `${authors}. ${date}. "${title}." *${journal}*${chicagoVol}${chicagoNo}${chicagoPages}${doi ? `. https://doi.org/${doi}` : ''}.`;

      case 'harvard':
        // Harvard: Author, A. (Year) 'Title of Article', Journal Name, Volume(Issue), pp. pages.
        const harvardVol = volume && issue ? `, ${volume}(${issue})` : volume ? `, ${volume}` : '';
        const harvardPages = pages ? `, pp. ${pages}` : '';
        return `${authors} (${date}) '${title}', *${journal}*${harvardVol}${harvardPages}${doi ? `. Available at: https://doi.org/${doi} (Accessed: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })})` : ''}.`;

      case 'ieee':
        // IEEE: Author(s), "Title of article," Journal Title, vol. V, no. N, pp. start–end, Year. DOI
        const ieeeVol = volume ? `, vol. ${volume}` : '';
        const ieeeNo = issue ? `, no. ${issue}` : '';
        const ieeePages = pages ? `, pp. ${pages}` : '';
        return `${authors}, "${title}," *${journal}*${ieeeVol}${ieeeNo}${ieeePages}, ${date}${doi ? `. doi: ${doi}` : ''}.`;

      case 'vancouver':
        // Vancouver: Author(s). Title of article. Journal Name. Year;Volume(Issue):pages. DOI
        const vancouverVol = volume && issue ? `;${volume}(${issue})` : volume ? `;${volume}` : '';
        const vancouverPages = pages ? `:${pages}` : '';
        return `${authors}. ${title}. *${journal}*. ${date}${vancouverVol}${vancouverPages}${doi ? `. doi:${doi}` : ''}.`;

      case 'bibtex':
        const bibtexKey = authors.split(',')[0].replace(/\s+/g, '').toLowerCase() + date;
        return `@article{${bibtexKey},\n  author = {${citationData.authors.map(a => a.name).join(' and ')}},\n  title = {${title}},\n  journal = {${journal}},\n  year = {${date}},\n  ${volume ? `volume = {${volume}},\n  ` : ''}${issue ? `number = {${issue}},\n  ` : ''}${pages ? `pages = {${pages}},\n  ` : ''}${institution ? `institution = {${institution}},\n  ` : ''}${doi ? `doi = {${doi}},\n  ` : ''}url = {${url}}\n}`;

      case 'ris':
        return `TY  - JOUR\nTI  - ${title}\n${citationData.authors.map(a => `AU  - ${a.name}`).join('\n')}\nPY  - ${date}\nJO  - ${journal}\n${volume ? `VL  - ${volume}\n` : ''}${issue ? `IS  - ${issue}\n` : ''}${pages ? `SP  - ${pages.split('-')[0]}\nEP  - ${pages.split('-')[1] || pages.split('-')[0]}\n` : ''}${institution ? `PB  - ${institution}\n` : ''}${doi ? `DO  - ${doi}\n` : ''}UR  - ${url}\nER  -`;

      default:
        return '';
    }
  };

  const handleCopy = async (format: CitationFormat) => {
    const citation = generateCitation(format);
    try {
      await navigator.clipboard.writeText(citation);
      setCopiedFormat(format);
      toast.success('Citation copied to clipboard');
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (error) {
      toast.error('Failed to copy citation');
    }
  };

  const handleDownload = (format: CitationFormat) => {
    const citation = generateCitation(format);
    const blob = new Blob([citation], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `citation.${format === 'bibtex' ? 'bib' : format === 'ris' ? 'ris' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Citation downloaded');
  };

  const formatLabels: Record<CitationFormat, { label: string; icon: React.ReactNode; description: string }> = {
    apa: {
      label: 'APA',
      icon: <BookOpen size={16} />,
      description: 'American Psychological Association'
    },
    mla: {
      label: 'MLA',
      icon: <FileText size={16} />,
      description: 'Modern Language Association'
    },
    chicago: {
      label: 'Chicago',
      icon: <BookOpen size={16} />,
      description: 'Chicago Manual of Style'
    },
    harvard: {
      label: 'Harvard',
      icon: <GraduationCap size={16} />,
      description: 'Harvard Referencing'
    },
    ieee: {
      label: 'IEEE',
      icon: <Code size={16} />,
      description: 'Institute of Electrical and Electronics Engineers'
    },
    vancouver: {
      label: 'Vancouver',
      icon: <FileText size={16} />,
      description: 'Vancouver Style'
    },
    bibtex: {
      label: 'BibTeX',
      icon: <Code size={16} />,
      description: 'BibTeX Format'
    },
    ris: {
      label: 'RIS',
      icon: <Download size={16} />,
      description: 'Research Information Systems'
    }
  };

  const styles = `
    .citation-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .citation-modal {
      background: #FFFFFF;
      border-radius: 12px;
      width: 100%;
      max-width: 900px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .citation-modal__header {
      padding: 24px 32px;
      border-bottom: 1px solid #E7E5E4;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .citation-modal__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0;
    }

    .citation-modal__close {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      color: #78716C;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }

    .citation-modal__close:hover {
      background: #F5F5F4;
      color: #1C1917;
    }

    .citation-modal__body {
      flex: 1;
      overflow-y: auto;
      padding: 32px;
      display: flex;
      flex-direction: column;
    }

    .citation-modal__preview-section {
      order: 1;
      margin-bottom: 32px;
    }

    .citation-modal__format-section {
      order: 2;
    }

    .citation-modal__format-section-label {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.75rem;
      font-weight: 600;
      color: #78716C;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 16px;
      display: block;
    }

    .citation-modal__format-selector {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
    }

    .citation-modal__format-btn {
      padding: 14px 16px;
      border: 2px solid #E7E5E4;
      border-radius: 8px;
      background: #FFFFFF;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      text-align: center;
      position: relative;
      min-height: 90px;
      justify-content: center;
    }

    .citation-modal__format-btn:hover {
      border-color: #1E3A5F;
      background: #FAFAF9;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(30, 58, 95, 0.08);
    }

    .citation-modal__format-btn--active {
      border-color: #1E3A5F;
      background: #1E3A5F;
      color: #FFFFFF;
      box-shadow: 0 4px 16px rgba(30, 58, 95, 0.2);
    }

    .citation-modal__format-btn--active:hover {
      border-color: #2D4A6F;
      background: #2D4A6F;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(30, 58, 95, 0.25);
    }

    .citation-modal__format-btn--active .citation-modal__format-label {
      color: #FFFFFF;
    }

    .citation-modal__format-btn--active .citation-modal__format-icon {
      color: #FFFFFF;
    }

    .citation-modal__format-icon {
      color: #78716C;
      transition: color 0.2s ease;
      flex-shrink: 0;
    }

    .citation-modal__format-btn:hover .citation-modal__format-icon {
      color: #1E3A5F;
    }

    .citation-modal__format-btn--active .citation-modal__format-icon {
      color: #FFFFFF;
    }

    .citation-modal__format-btn--active:hover .citation-modal__format-icon {
      color: #FFFFFF;
    }

    .citation-modal__format-label {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      color: #1C1917;
      transition: color 0.2s ease;
    }

    .citation-modal__format-btn:hover .citation-modal__format-label {
      color: #1E3A5F;
    }

    .citation-modal__format-btn--active .citation-modal__format-label {
      color: #FFFFFF;
    }

    .citation-modal__format-btn--active:hover .citation-modal__format-label {
      color: #FFFFFF;
    }

    .citation-modal__format-desc {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.6875rem;
      color: #78716C;
      margin-top: -4px;
      transition: color 0.2s ease;
    }

    .citation-modal__format-btn:hover .citation-modal__format-desc {
      color: #57534E;
    }

    .citation-modal__format-btn--active .citation-modal__format-desc {
      color: rgba(255, 255, 255, 0.85);
    }

    .citation-modal__format-btn--active:hover .citation-modal__format-desc {
      color: rgba(255, 255, 255, 0.85);
    }

    .citation-modal__preview {
      background: #FFFFFF;
      border: 2px solid #E7E5E4;
      border-radius: 10px;
      padding: 28px;
      margin-bottom: 32px;
      position: relative;
      min-height: 120px;
    }

    .citation-modal__preview-label {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.75rem;
      font-weight: 600;
      color: #78716C;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 12px;
      display: block;
    }

    .citation-modal__preview-text {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      line-height: 1.8;
      color: #1C1917;
      white-space: pre-wrap;
      word-wrap: break-word;
      margin: 0;
    }

    .citation-modal__preview-text--code {
      font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
      font-size: 0.8125rem;
      background: #FAFAF9;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #E7E5E4;
      line-height: 1.7;
    }

    .citation-modal__actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .citation-modal__action-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border: 1px solid #E7E5E4;
      border-radius: 6px;
      background: #FFFFFF;
      color: #57534E;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .citation-modal__action-btn:hover {
      background: #F5F5F4;
      border-color: #D6D3D1;
    }

    .citation-modal__action-btn--primary {
      background: #1E3A5F;
      border-color: #1E3A5F;
      color: #FFFFFF;
    }

    .citation-modal__action-btn--primary:hover {
      background: #2D4A6F;
      border-color: #2D4A6F;
    }

    .citation-modal__action-btn--success {
      background: #10B981;
      border-color: #10B981;
      color: #FFFFFF;
    }

    .citation-modal__action-btn--success:hover {
      background: #059669;
      border-color: #059669;
    }

    @media (max-width: 768px) {
      .citation-modal {
        max-height: 95vh;
      }

      .citation-modal__header {
        padding: 20px 24px;
      }

      .citation-modal__body {
        padding: 24px;
      }

      .citation-modal__format-selector {
        grid-template-columns: repeat(2, 1fr);
      }

      .citation-modal__title {
        font-size: 1.25rem;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="citation-modal-overlay" onClick={onClose}>
        <div className="citation-modal" onClick={(e) => e.stopPropagation()}>
          <div className="citation-modal__header">
            <h2 className="citation-modal__title">Cite This Article</h2>
            <button className="citation-modal__close" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
          </div>

          <div className="citation-modal__body">
            {/* Citation Preview - Top */}
            <div className="citation-modal__preview-section">
              <div className="citation-modal__preview">
                <span className="citation-modal__preview-label">Citation Preview</span>
                <p
                  className={`citation-modal__preview-text ${selectedFormat === 'bibtex' || selectedFormat === 'ris' ? 'citation-modal__preview-text--code' : ''}`}
                >
                  {generateCitation(selectedFormat)}
                </p>
              </div>
            </div>

            {/* Format Selector - Bottom */}
            <div className="citation-modal__format-section">
              <label className="citation-modal__format-section-label">Select Citation Style</label>
              <div className="citation-modal__format-selector">
                {(Object.keys(formatLabels) as CitationFormat[]).map((format) => {
                  const formatInfo = formatLabels[format];
                  return (
                    <button
                      key={format}
                      className={`citation-modal__format-btn ${selectedFormat === format ? 'citation-modal__format-btn--active' : ''}`}
                      onClick={() => setSelectedFormat(format)}
                    >
                      <span className="citation-modal__format-icon">{formatInfo.icon}</span>
                      <span className="citation-modal__format-label">{formatInfo.label}</span>
                      <span className="citation-modal__format-desc">{formatInfo.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="citation-modal__actions">
              <button
                className={`citation-modal__action-btn ${copiedFormat === selectedFormat ? 'citation-modal__action-btn--success' : 'citation-modal__action-btn--primary'}`}
                onClick={() => handleCopy(selectedFormat)}
              >
                {copiedFormat === selectedFormat ? (
                  <>
                    <Check size={16} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy Citation
                  </>
                )}
              </button>
              <button
                className="citation-modal__action-btn"
                onClick={() => handleDownload(selectedFormat)}
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CitationModal;
