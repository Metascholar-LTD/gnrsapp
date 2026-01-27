/**
 * Smart file parser utility - extracts text from various file formats
 * Similar to how ChatGPT handles file uploads
 */

/**
 * Extract text from PDF files using pdfjs-dist
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set worker source
    if (typeof window !== 'undefined') {
      const baseUrl = import.meta.env.BASE_URL || '/';
      const workerPath = `${baseUrl.replace(/\/$/, '')}/pdf.worker.min.js`;
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath;
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      verbosity: 0,
      useSystemFonts: false,
      useWorkerFetch: false,
      isEvalSupported: false
    });
    
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    
    let fullText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine text items from the page
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n\n';
    }
    
    await pdf.destroy();
    
    return fullText.trim();
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error('Failed to extract text from PDF. Please ensure the file is not corrupted.');
  }
}

/**
 * Extract text from Word (.docx) files using mammoth
 */
export async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (result.messages.length > 0) {
      console.warn('Mammoth warnings:', result.messages);
    }
    
    return result.value.trim();
  } catch (error) {
    console.error('Error extracting DOCX text:', error);
    throw new Error('Failed to extract text from Word document. Please ensure the file is a valid .docx file.');
  }
}

/**
 * Extract text from PowerPoint (.pptx) files using JSZip
 */
export async function extractTextFromPPTX(file: File): Promise<string> {
  try {
    const JSZip = (await import('jszip')).default;
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    
    // PPTX files contain slides in ppt/slides/slide*.xml
    const slideFiles = Object.keys(zip.files).filter(name => 
      name.startsWith('ppt/slides/slide') && name.endsWith('.xml')
    );
    
    let fullText = '';
    
    // Extract text from each slide
    for (const slidePath of slideFiles.sort()) {
      const slideFile = zip.files[slidePath];
      if (slideFile) {
        const slideContent = await slideFile.async('string');
        
        // Extract text from XML (simple regex-based extraction)
        // PPTX stores text in <a:t> tags
        const textMatches = slideContent.match(/<a:t[^>]*>([^<]*)<\/a:t>/g);
        if (textMatches) {
          const slideText = textMatches
            .map(match => match.replace(/<[^>]*>/g, ''))
            .filter(text => text.trim().length > 0)
            .join(' ');
          
          if (slideText.trim()) {
            fullText += slideText + '\n\n';
          }
        }
      }
    }
    
    return fullText.trim() || 'No text content found in PowerPoint file.';
  } catch (error) {
    console.error('Error extracting PPTX text:', error);
    throw new Error('Failed to extract text from PowerPoint file. Please ensure the file is a valid .pptx file.');
  }
}

/**
 * Extract text from plain text files
 */
export async function extractTextFromTXT(file: File): Promise<string> {
  try {
    return await file.text();
  } catch (error) {
    console.error('Error reading text file:', error);
    throw new Error('Failed to read text file.');
  }
}

/**
 * Main function to extract text from any supported file type
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  
  // Determine file type and extract accordingly
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return await extractTextFromPDF(file);
  }
  
  if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    return await extractTextFromDOCX(file);
  }
  
  if (
    fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    fileName.endsWith('.pptx')
  ) {
    return await extractTextFromPPTX(file);
  }
  
  if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
    return await extractTextFromTXT(file);
  }
  
  // For older formats (.doc, .ppt) that are harder to parse
  if (fileName.endsWith('.doc') || fileName.endsWith('.ppt')) {
    throw new Error(
      'Older file formats (.doc, .ppt) are not supported. ' +
      'Please convert your file to .docx or .pptx format, or paste the text content directly.'
    );
  }
  
  // Unknown file type
  throw new Error(
    `Unsupported file type: ${fileType || 'unknown'}. ` +
    'Supported formats: PDF, Word (.docx), PowerPoint (.pptx), and Text (.txt)'
  );
}
