import { htmlSerializer } from '../lib/serializers/html'
import { Serializer } from '../lib/interfaces'
import { testData } from './data/htmlSerializer'

let serializer: Serializer<string>

const includeConfigTests = () =>
  testData.forEach(testCase => {
    test(testCase.name, () => {
      const result = serializer.convert(testCase.data)
      expect(result).toMatchSnapshot()
    })
  })

describe('Serializer (HTML)', () => {
  describe('Simple tests', () => {
    beforeAll(() => {
      serializer = htmlSerializer()
    })
    test('Hello world string', () => {
      const result = serializer.convert([{ text: 'hello world' }])
      expect(result).toMatch('hello world')
    })
    test('Nested expresion', () => {
      const result = serializer.convert([
        { text: 'hello ' },
        { text: { text: 'world' } },
      ])
      expect(result).toMatch('hello world')
    })
    test('Bold text', () => {
      const result = serializer.convert([
        { text: 'hello', bold: true },
        { text: 'world' },
      ])
      expect(result).toMatch('<strong>hello</strong>world')
    })
  })
  describe('Default config', () => {
    beforeAll(() => {
      serializer = htmlSerializer({ spaceBetween: true })
    })
    test('Space between', () => {
      const result = serializer.convert([{ text: 'hello' }, { text: 'world' }])
      expect(result).toMatch('hello world')
    })
    test('Nested styling', () => {
      const result = serializer.convert([
        {
          text: [{ text: 'Header', italic: true }, 'one'],
          header: 1,
        },
        { text: { text: { text: 'strike' } }, strike: true },
        { text: 'bold', bold: true },
      ])
      expect(result).toMatch(
        '<h1><em>Header</em> one</h1> <del>strike</del> <strong>bold</strong>'
      )
    })

    includeConfigTests()
  })

  describe('Use default class serializers', () => {
    beforeAll(() => {
      serializer = htmlSerializer({
        defaultSerializers: {
          bold: 'text-bold',
          italic: 'text-italic',
          strike: 'strike',
          line: 'container',
        },
      })
    })

    test('Bold with span class', () => {
      const result = serializer.convert([{ text: 'bold text', bold: true }])
      expect(result).toMatch('<span class="text-bold">bold text</span>')
    })

    includeConfigTests()
  })

  describe('Rewrite default serializers', () => {
    beforeAll(() => {
      serializer = htmlSerializer({
        defaultSerializers: {
          bold: content => ({
            el: 'div',
            classes: new Map([['bold-div', true]]),
            content,
          }),
          header: (level, content) => ({
            el: 'section',
            classes: new Map([[`header-${level}`, true]]),
            content,
          }),
        },
      })
    })

    test('Section header', () => {
      const result = serializer.convert([
        { text: 'header', header: 1 },
        { text: 'header', header: 2 },
      ])
      expect(result).toMatch(
        '<section class="header-1">header</section><section class="header-2">header</section>'
      )
    })

    includeConfigTests()
  })

  describe('Custom serializers', () => {
    beforeAll(() => {
      serializer = htmlSerializer({
        serializers: {
          card: (content, info: { name: string; text: string }) => ({
            el: 'div',
            classes: new Map([['card', true]]),
            content: [
              content,
              {
                el: 'div',
                classes: new Map([['card-preview', true]]),
                content: [
                  {
                    el: 'h1',
                    content: info.name,
                    classes: new Map(),
                  },
                  {
                    el: 'p',
                    content: info.text,
                    classes: new Map(),
                  },
                ],
              },
            ],
          }),
        },
      })
    })

    test('Card test', () => {
      const result = serializer.convert([
        {
          text: 'card',
          card: { name: 'Card header', text: 'Card text' },
        },
      ])
      expect(result).toMatch(
        '<div class="card">card<div class="card-preview"><h1>Card header</h1><p>Card text</p></div></div>'
      )
    })
  })
})
