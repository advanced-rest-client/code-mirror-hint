import { assert, fixture, html } from '@open-wc/testing';
import sinon from 'sinon/pkg/sinon-esm.js';
import { getKeywords, getHints } from '../HintHttpHeaders.js';
import suggestions from '../HintHeadersSuggestions.js';
import '../hint-http-headers.js';
import '../code-mirror-headers-hint.js';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';

/* global CodeMirror */

describe('hint-http-headers', function() {
  describe('getKeywords()', () => {
    it('returns an array', () => {
      const result = getKeywords(suggestions);
      assert.typeOf(result, 'array');
    });

    it('item has text property', () => {
      const result = getKeywords(suggestions);
      assert.typeOf(result[0].text, 'string');
    });

    it('item has hint property', () => {
      const result = getKeywords(suggestions);
      assert.typeOf(result[0].hint, 'function');
    });

    it('hint callback calls replaceRange() on CM instance', () => {
      const result = getKeywords(suggestions);
      const cm = {
        replaceRange: () => {}
      };
      const data = {
        from: {},
        to: {}
      };
      const completion = {
        text: 'test'
      };
      const spy = sinon.spy(cm, 'replaceRange');
      result[0].hint(cm, data, completion);
      assert.isTrue(spy.called);
    });

    it('hint callback calls signal() on global CM', () => {
      const result = getKeywords(suggestions);
      const cm = {
        replaceRange: () => {}
      };
      const data = {
        from: {},
        to: {}
      };
      const completion = {
        text: 'test'
      };
      const spy = sinon.spy(CodeMirror, 'signal');
      result[0].hint(cm, data, completion);
      CodeMirror.signal.restore();
      assert.isTrue(spy.called);
    });
  });

  describe('getHints()', () => {
    async function basicFixture() {
      return await fixture(html`<textarea></textarea>`);
    }

    let ctSuggestion;

    before(() => {
      ctSuggestion = suggestions.find((item) => item.key === 'Content-Type');
    });

    let editor;
    let area;
    beforeEach(async () => {
      area = await basicFixture();
      editor = CodeMirror.fromTextArea(area, {
        mode: 'http-headers'
      });
    });

    it('returns an object', () => {
      const result = getHints(editor);
      assert.typeOf(result, 'object');
    });

    it('returns hints for empty editor', () => {
      const result = getHints(editor);
      assert.typeOf(result.list, 'array');
      assert.lengthOf(result.list, suggestions.length);
    });

    it('returns hints for partial name', () => {
      editor.setValue('content-typ');
      editor.setCursor(0, 10);
      const result = getHints(editor);
      assert.lengthOf(result.list, 1, 'has single result');
      assert.equal(result.list[0].text, 'Content-Type', 'Has text value');
      assert.typeOf(result.list[0].hint, 'function', 'Has callback function');
    });

    it('returns hints for value - no space', () => {
      editor.setValue('content-type:');
      editor.setCursor(0, 13);
      const result = getHints(editor);
      assert.lengthOf(result.list, ctSuggestion.values.length, 'has all suggestions');
      assert.equal(result.list[0].text, 'application/json', 'First one is application/json');
      assert.typeOf(result.list[0].hint, 'function', 'Has callback function');
    });

    it('returns hints for value - with space', () => {
      editor.setValue('content-type: ');
      editor.setCursor(0, 14);
      const result = getHints(editor);
      assert.lengthOf(result.list, ctSuggestion.values.length, 'has all suggestions');
      assert.equal(result.list[0].text, 'application/json', 'First one is application/json');
      assert.typeOf(result.list[0].hint, 'function', 'Has callback function');
    });

    it('returns hints for value - partial value', () => {
      editor.setValue('content-type: text');
      editor.setCursor(0, 18);
      const result = getHints(editor);
      assert.lengthOf(result.list, 3, 'has 3 results');
      assert.equal(result.list[0].text, 'text/plain', 'First one is text/plain');
      assert.typeOf(result.list[0].hint, 'function', 'Has callback function');
    });

    it('returns hints for value - after coma', () => {
      editor.setValue('content-type: text/plain,');
      editor.setCursor(0, 29);
      const result = getHints(editor);
      assert.lengthOf(result.list, ctSuggestion.values.length, 'has all suggestions');
    });

    it('inserts suggestion into the editor on click', () => {
      editor.setValue('content');
      editor.setCursor(0, 7);
      CodeMirror.showHint(editor, CodeMirror.hint['http-headers']);
      const nodes = document.querySelectorAll('anypoint-item');
      MockInteractions.tap(nodes[0]);
      assert.equal(editor.getValue(), 'Content-MD5: ');
    });

    it('inserts suggestion into the editor on enter', () => {
      editor.setValue('content-type: ');
      editor.setCursor(0, 14);
      CodeMirror.showHint(editor, CodeMirror.hint['http-headers']);
      MockInteractions.keyDownOn(editor.getInputField(), 40, [], 'ArrowDown');
      MockInteractions.keyDownOn(editor.getInputField(), 13, [], 'Enter');
      assert.equal(editor.getValue(), 'content-type: application/xml');
    });

    it('inserts suggestion with params', () => {
      editor.setValue('Authorization: ');
      editor.setCursor(0, 15);
      CodeMirror.showHint(editor, CodeMirror.hint['http-headers']);
      MockInteractions.keyDownOn(editor.getInputField(), 40, [], 'ArrowDown');
      MockInteractions.keyDownOn(editor.getInputField(), 13, [], 'Enter');
      assert.equal(editor.getValue(), 'Authorization: Bearer {OAuth2 bearer}');
    });

    it('inserts suggestion with * param', () => {
      editor.setValue('Cookie: ');
      editor.setCursor(0, 9);
      CodeMirror.showHint(editor, CodeMirror.hint['http-headers']);
      MockInteractions.keyDownOn(editor.getInputField(), 13, [], 'Enter');
      assert.equal(editor.getValue(), 'Cookie: {cookie name}={cookie value}');
    });
  });
});
