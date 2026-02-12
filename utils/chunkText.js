/**
 * Splits text into chunks of approximately targetSize with overlap.
 */
export function chunkText(text, targetSize = 500, overlap = 50) {
    if (!text) return [];

    const chunks = [];
    let i = 0;

    while (i < text.length) {
        // Find end of chunk
        let end = i + targetSize;

        // If not at the end of text, try to find a natural break (period or space)
        if (end < text.length) {
            const nextSpace = text.indexOf(' ', end);
            if (nextSpace !== -1 && nextSpace < end + 20) {
                end = nextSpace;
            }
        } else {
            end = text.length;
        }

        const chunk = text.slice(i, end).trim();
        if (chunk.length > 0) {
            chunks.push(chunk);
        }

        // Move pointer forward, but subtract overlap
        i = end - overlap;

        // Safety check to prevent infinite loop
        if (i >= text.length || end >= text.length) break;
        if (i <= 0 && i !== 0) i = 0; // Should not happen with positive targetSize > overlap
    }

    return chunks;
}
