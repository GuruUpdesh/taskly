export function removeMarkdown(mdString: string) {
    const cleanString = mdString
        .replace(/(\*\*|__)(.*?)\1/g, '$2')   // Bold
        .replace(/(\*|_)(.*?)\1/g, '$2')      // Italics
        .replace(/`(.*?)`/g, '$1')            // Inline code
        .replace(/<u>(.*?)<\/u>/g, '$1')      // Underline
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')   // Links
        .replace(/#+\s?(.*)/g, '$1')          // Headers
        .replace(/!\[.*?\]\(.*?\)/g, '')      // Images
        .replace(/\*\*\*/g, '')               // Divider
        .replace(/^\s+|\s+$/gm, '')           // Trim each line
        .replace(/\n{2,}/g, '\n')             // Replace multiple newlines with a single newline
        .replace(/\s+/g, ' ');                // Replace multiple spaces with a single space

    return cleanString.trim();
}