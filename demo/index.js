import { html } from 'lit-html';
import { ArcDemoPage } from '@advanced-rest-client/arc-demo-helper/ArcDemoPage.js';
import '@anypoint-web-components/anypoint-styles/colors.js';
import '@advanced-rest-client/code-mirror/code-mirror.js';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
window.MockInteractions = MockInteractions;
import '../code-mirror-headers-hint.js';

/* global CodeMirror */

class ApiDemo extends ArcDemoPage {
  constructor() {
    super();

    // this.initObservableProperties([]);

    this.componentName = 'code-mirror-hint';

    setTimeout(() => {
      const editor = document.getElementById('editor');
      editor.setOption('extraKeys', {
        'Ctrl-Space': function(cm) {
          CodeMirror.showHint(cm, CodeMirror.hint['http-headers'], {
            container: editor
          });
        }
      });
    }, 120);
  }

  _demoTemplate() {
    return html`<section class="documentation-section">
      <h2>Demo</h2>
      <p>
        This demo lets you preview the hints module for CodeMirror.
        Write headers part of the HTTP message.
      </p>

      <code-mirror mode="http-headers" id="editor"></code-mirror>
    </section>`;
  }

  contentTemplate() {
    return html`
      ${this._demoTemplate()}
    `;
  }
}
const instance = new ApiDemo();
instance.render();
window.demoInstance = instance;
