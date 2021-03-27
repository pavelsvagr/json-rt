<div align="center">

# JSON Rich text
Simple json format to represent and serialize your rich text.

</div>

## 🚀 How to use
Just write a simple json structure, that is readable:

```js
import { RichTextJson } from 'json-rt'

const myText: RichTextJson = [
  'This is my first', { text: 'beautiful', bold: true}, 'rich text!'
]
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


## 🔮 Planned features
- More supported markup by default: color, class...
- More serializers: Markdown, Phaser (game engine)
- Parsers from documents

## ⚖️ Licence
This project is under [MIT licence](./LICENCE.md).
