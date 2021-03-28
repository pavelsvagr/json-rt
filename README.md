<div align="center">

# JSON Rich text
Simple json format to represent and serialize your rich text.

![logo](https://i.imgur.com/WWFkKl0.png)


[![Build Status](https://travis-ci.com/pavelsvagr/json-rt.svg?branch=master)](https://travis-ci.com/pavelsvagr/json-rt)
[![Coverage Status](https://img.shields.io/coveralls/github/pavelsvagr/json-rt.svg?style=flat-square)](https://coveralls.io/github/pavelsvagr/json-rt?branch=master)
![GitHub](https://img.shields.io/github/license/pavelsvagr/json-rt)
[![Known Vulnerabilities](https://snyk.io/test/github/pavelsvagr/json-rt/badge.svg?targetFile=package.json)](https://snyk.io/test/github/pavelsvagr/json-rt?targetFile=package.json)
[![Dependencies](https://img.shields.io/david/pavelsvagr/json-rt.svg?style=flat-square)](https://david-dm.org/pavelsvagr/json-rt)
[![Dev dependencies](https://img.shields.io/david/dev/pavelsvagr/json-rt.svg?style=flat-square)](https://david-dm.org/pavelsvagr/json-rt)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

</div>

## 🚀 How to use
Just write a simple json like structure, that is readable:

```js
import { RichTextJson } from 'json-rt'

const myText: RichTextJson = [
  'This is my first', { text: 'beautiful', bold: true}, 'rich text!'
]
```

For string parsing use simply `JSON.parse` or `jsonSerializer.parse`:

```js
import { jsonSerializer } from 'json-rt'

const serializer = jsonSerializer()
const jsonRichText = serializer.parse("[\"hello\", {\"text\": \"world\", \"bold\":true}]")
```

## 📃 Html serializer
Serialize json object into html using htmlParser
```js
import { htmlSerializer } from 'json-rt'

const serializer = htmlSerializer()
const myText = [
  {text: 'JSON Rich text', line: true, header: 1},
  {text: 'Simple json format to represent and serialize your rich text.', line: true},
]
const html = serializer.convert(myText)
// <div><h1>JSON Rich text</h1></div>
// <div>Simple json format to represent and serialize your rich text.</div>
```
Use config to define your own serializers or to redefine default serializers.
```js
const serializer = htmlSerializer({
  customSerializers: {
    // Icon serializer - all content with 'icon' key will be serialized by this.
    // Receives inner content and value from format.
    icon: (content: HtmlContent, iconClass: string): HtmlContent => ({
        el: 'i',
        classes: new Map([[`fas fa-${iconClass}`, true]]),
        content
      })
  }
})
const myText = [
  'Rich text! ', { text: '', icon: 'pencil'}
]
const html = serializer.convert(myText)
// Rich text! <i class="fas fa-pencil"></i>
```

## 🎨 Predefined serializers
| Rich text key | Type of value | Effect      | Default HTML markup |
| ------------- |:-------------| :-----------|       :-----:|
| **bold**      | `boolean`     | Bold text   | `<strong>`  |
| *italic*      | `boolean`     | Italic text | `<em>`      |
| ~~strike~~ | `boolean`      |    Strikethrough | `<del>`  |
| header | `number` (level)     |    Header of given level | `<h{level}>`  |
| line | `boolean`      |   Makes content on new line | `<div>`  |


## ✅ TODO
- Do right json parsing with type checks
- htmlSerializer parse function

## 🔮 Planned features
- More supported markup by default: color, class...
- More serializers: Markdown, Phaser (game engine)
- Parsers from documents

## ⚖️ Licence
This project is under [MIT licence](./LICENCE.md).
