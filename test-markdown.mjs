import React from 'react';
import ReactMarkdown from 'react-markdown';
import { renderToString } from 'react-dom/server';

const markdown = `
Here is \`inline code\`.

\`\`\`
Block without language
\`\`\`

\`\`\`js
Block with language
\`\`\`
`

const html = renderToString(
  React.createElement(ReactMarkdown, {
    components: {
      pre(props) {
        // children is typically a single React Element of type <code>
        const codeElement = props.children;
        const codeProps = codeElement?.props || {};
        const className = codeProps.className || '';
        const match = /language-(\w+)/.exec(className);
        const language = match ? match[1] : '';
        const codeText = String(codeProps.children).replace(/\n$/, '');

        console.log("PRE block. Lang =", language, "Text =", codeText.substring(0, 10));

        return React.createElement('pre', { className: 'my-custom-pre' },
          React.createElement('div', { className: 'my-header' }, language || 'text'),
          codeElement
        );
      },
      code(props) {
        // For block code, this is rendered INSIDE `pre` and passed as `children` above!
        // But the `pre` renders it again.
        // For inline code, this is rendered directly without `pre`.
        const match = /language-(\w+)/.exec(props.className || '');
        const isBlock = false; // We don't know here, but pre handles block wrapper.
        return React.createElement('code', { className: props.className }, props.children);
      }
    }
  }, markdown)
);
console.log(html);
