import { toPng, toJpeg } from 'html-to-image';

export interface ExportImageOptions {
  fileName?: string;
  format?: 'png' | 'jpeg';
  quality?: number;
  scale?: number;
}

export const exportElementAsImage = async (
  elementId: string,
  options: ExportImageOptions = {}
): Promise<string> => {
  const node = document.getElementById(elementId);
  if (!node) {
    throw new Error(`Element with id "${elementId}" not found.`);
  }

  const {
    fileName = `TD_Invoice_${new Date().toISOString().replace(/[:.]/g, '-')}`,
    format = 'png',
    quality = 0.95,
    scale = 2.5, // High resolution for crisp printing
  } = options;

  // Temporarily ensure background is white for crisp export
  const originalBg = node.style.backgroundColor;
  node.style.backgroundColor = '#ffffff';

  try {
    let dataUrl: string;
    const filter = (domNode: HTMLElement) => {
      // Exclude action buttons, helper placeholders, or interactive tools
      if (domNode.classList) {
        if (domNode.classList.contains('no-export') || domNode.classList.contains('no-print')) {
          return false;
        }
      }
      return true;
    };

    const renderOptions = {
      quality,
      pixelRatio: scale,
      backgroundColor: '#ffffff',
      filter,
      skipFonts: true,
      cacheBust: false,
    };

    if (format === 'jpeg') {
      dataUrl = await toJpeg(node, renderOptions);
    } else {
      dataUrl = await toPng(node, renderOptions);
    }

    // Trigger instant download to user's computer
    const link = document.createElement('a');
    link.download = `${fileName}.${format === 'jpeg' ? 'jpg' : 'png'}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    link.remove();

    return dataUrl;
  } finally {
    node.style.backgroundColor = originalBg;
  }
};
