import { jsonSerializer } from '../lib/serializers/json'
import { RichTextJson, Serializer } from '../lib/interfaces'

let serializer: Serializer<string>

const testConvert = (data: RichTextJson, expectString: string) => {
  const convert = serializer.convert(data)
  expect(convert).toMatch(expectString)

  if (serializer.parse) {
    const parse = serializer.parse(convert)
    expect(parse).toStrictEqual(data)
  }
}

describe('Serializer (JSON)', () => {
  beforeAll(() => {
    serializer = jsonSerializer()
  })
  test('Hello world string', () => {
    const data: RichTextJson = [{ text: 'hello world' }]
    testConvert(data, '[{"text":"hello world"}]')
  })
  test('Nested bold text', () => {
    const data: RichTextJson = [
      { text: 'hello ' },
      { text: { text: 'world', bold: true } },
    ]
    testConvert(
      data,
      '[{"text":"hello "},{"text":{"text":"world","bold":true}}]'
    )
  })
})
