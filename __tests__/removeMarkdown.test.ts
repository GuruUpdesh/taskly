import {removeMarkdown} from '../src/utils/removeMarkdown';

test('removes markdown from a string', () => {
    const mdString = `
### test

adadad

**test**

*adad*

<u>ad</u>

\`test\`

[test](https://platform.openai.com/docs/models/gpt-4 "openai")

***
    `;
    const expectedString = 'test\nadadad\ntest\nadad\nad\ntest\ntest';
    expect(removeMarkdown(mdString)).toBe(expectedString);
});

test('removes bold markdown', () => {
    expect(removeMarkdown('**bold**')).toBe('bold');
});

test('removes italic markdown', () => {
    expect(removeMarkdown('*italic*')).toBe('italic');
});

test('removes inline code markdown', () => {
    expect(removeMarkdown('`code`')).toBe('code');
});

test('removes underline markdown', () => {
    expect(removeMarkdown('<u>underlined</u>')).toBe('underlined');
});

test('removes links markdown', () => {
    expect(removeMarkdown('[link](https://example.com "title")')).toBe('link');
});

test('removes headers markdown', () => {
    expect(removeMarkdown('### header')).toBe('header');
});

test('removes dividers markdown', () => {
    expect(removeMarkdown('***')).toBe('');
});

test('handles complex markdown string', () => {
    const mdString = `
## Title
Some **bold** text, some *italic* text, and a [link](https://example.com).

More text with <u>underline</u> and \`inline code\`.
    
***
    `;
    const expectedString = 'Title\nSome bold text, some italic text, and a link.\n\nMore text with underline and inline code.';
    expect(removeMarkdown(mdString)).toBe(expectedString);
});