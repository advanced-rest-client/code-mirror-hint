import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/paper-styles/shadow.js';
/**
 * `code-mirror-hint-container`
 * UI element for hint display.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class CodeMirrorHintContainer extends PolymerElement {
  static get template() {
    return html`
    <style>
    :host {
      @apply --shadow-elevation-4dp;
    }
    </style>
    <div class="container">
      <slot></slot>
    </div>
`;
  }

  static get is() {
    return 'code-mirror-hint-container';
  }
}
window.customElements.define(CodeMirrorHintContainer.is, CodeMirrorHintContainer);
