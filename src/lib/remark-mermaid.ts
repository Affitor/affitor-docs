import { visit } from 'unist-util-visit';

export interface RemarkMermaidOptions {
  lang?: string;
}

export function remarkMermaid({ lang = 'mermaid' }: RemarkMermaidOptions = {}) {
  return (tree: any) => {
    visit(tree, 'code', (node: any, idx, parent: any) => {
      if (
        node.lang !== lang ||
        !node.value ||
        typeof idx !== 'number' ||
        !parent
      ) {
        return;
      }

      const code = node.value;
      const raw = JSON.stringify(code);

      parent.children[idx] = {
        type: 'mdxJsxFlowElement',
        name: 'Mermaid',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'chart',
            value: {
              type: 'mdxJsxAttributeValueExpression',
              value: raw,
              data: {
                estree: {
                  type: 'Program',
                  sourceType: 'module',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'Literal',
                        value: code,
                        raw,
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
        children: [],
      };
    });
  };
}
