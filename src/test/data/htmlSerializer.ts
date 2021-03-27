import { RichTextJson } from '../../lib/interfaces'

export const testData: Array<{ name: string; data: RichTextJson }> = [
  {
    name: 'Single nested structure',
    data: [
      {
        text: { text: { text: { text: 'test' }, italic: true }, header: 1 },
        bold: true,
      },
    ],
  },
  {
    name: 'String sentence',
    data: ['This', 'is', 'a simple', 'test.'],
  },
  {
    name: 'Multiline sentence',
    data: [
      { text: ['First line.'], line: true },
      { text: ['Line', '2.'], line: true },
    ],
  },
  {
    name: 'Rich text - Prague',
    data: [
      { text: [{ text: 'P', bold: true }, 'rague'], line: true, header: 1 },
      {
        text: [
          { text: 'Prague', bold: true },
          'is a political, cultural and economic centre of',
          { text: 'central Europe', italic: true },
          'complete with a',
          { text: 'big', strike: true },
          'rich history.',
        ],
        line: true,
      },
    ],
  },
]
