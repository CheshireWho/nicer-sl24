# nicer-sl24

Nicer UI for sprachenlernen24

## Installation

### Android

1. Use the Kiwi browser to get a Chrome that allows installng extensions just like the desktop Chrome does.
2. Download this project as Zip.
3. Open [chrome://extensions/](chrome://extensions/) in Kiwi.
4. With "Developer mode" enabled, click "+(from .zip/.crx.js/.user.js)". Then select the downloaded Zip file.
5. Open or reload your sprachenlernen24 tab in Kiwi to see the extension in action.

### Desktop

1. Clone / download this code.
2. Open [chrome://extensions/](chrome://extensions/) in Chrome.
3. With "Developer mode" enabled, click "Load unpacked". Then select this extension's folder.
4. Open or reload your sprachenlernen24 tab in Chrome to see the extension in action.

## Features

- Dark font colour for the orange CTAs for better colour contrast.
- More spacing at the bottom of the content, so that it can be scrolled properly.
- Increase font size.
- Add links to the following elements that open Google Translate in a new tab with the text:
  - verb trainer items
  - conversation trainer within the daily trainer (the one that teaches single items and has a random image at the bottom)
- Add an input field to the daily "Blitz" vocab trainer to allow practicing writing.
  - A button next to it triggers the blue lightbulb button directly. I.e. no need to manually hide the keyboard after typing and then click the blue button.
  - The comparison of the typed text and the translation handles many cases (e.g. single phrases, sentences, lists of phrases...). In general, the spelling must be accurate. Otherwise, the algorithm tries to be lenient. E.g. if the target text is a list of phrases, writing only some of them and in any order is considered a partial match as long as the spelling is correct.
- Hide several demotivating and irrelevant sections from the daily trainer end screen.
- Change colour of the button in the daily trainer for new vocabulary to be added directly to the long term mmemory section and move it a bit out of the way. This is to prevent accidental clicking it due to its similiarity to the regular vocab repetition button.

## Tests

Each source file that has tests includes a commented line at the very bottom that assigns the file's content to `globalThis`. The test files can only access variables defined in the source files if those are available in `globalThis`.

Uncomment that line.

Run `node .\tests\index.js`.
