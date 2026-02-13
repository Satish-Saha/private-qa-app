/**
 * Splits text into logical chunks.
 * Prioritizes structural breaks (paragraphs) over character limits
 * to preserve the "identity" of sections like Name/Role/Skills.
 */
export function chunkText(text, targetSize = 300, overlap = 20) {
    if (!text) return [];

    // 1. First split by logical paragraphs
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const chunks = [];

    for (let para of paragraphs) {
        para = para.trim();

        // 2. If a paragraph is small enough, keep it as one chunk (preserves meaning better)
        if (para.length <= targetSize + overlap) {
            chunks.push(para);
        } else {
            // 3. Fallback to sliding window for very long paragraphs
            let i = 0;
            while (i < para.length) {
                let end = i + targetSize;

                if (end < para.length) {
                    const nextSpace = para.indexOf(' ', end);
                    if (nextSpace !== -1 && nextSpace < end + 20) {
                        end = nextSpace;
                    }
                } else {
                    end = para.length;
                }

                chunks.push(para.slice(i, end).trim());
                i = end - overlap;
                if (i >= para.length || end >= para.length) break;
            }
        }
    }

    return chunks;
}
