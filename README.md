[![Build Status](https://travis-ci.org/advanced-rest-client/code-mirror-hint.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/code-mirror-hint)

Hint addons for CodeMirror.

## Usage

Inside the document

```html
<!-- Code mirror imports -->
<script src="../../../codemirror/lib/codemirror.js"></script>
<script src="../../../codemirror/addon/mode/loadmode.js"></script>
<script src="../../../codemirror/mode/meta.js"></script>

<!-- Imports from this repo. -->
<script src="node_modules/code-mirror-hint/headers-addon.js"></script>
<script src="node_modules/code-mirror-hint/show-hint.js"></script>
<script src="node_modules/code-mirror-hint/hint-http-headers.js"></script>
<script type="module" src="@advanced-rest-client/code-mirror/code-mirror.js"></script>
<script type="module" src="@advanced-rest-client/code-mirror-hint/code-mirror-hint.js"></script>

<code-mirror mode="http-headers" id="editor"></code-mirror>
```

To enable hints

```javascript
const editor = document.getElementById('editor');
editor.setOption('extraKeys', {
  'Ctrl-Space': function(cm) {
    CodeMirror.showHint(cm, CodeMirror.hint['http-headers'], {
      container: editor
    });
  }
});
```
