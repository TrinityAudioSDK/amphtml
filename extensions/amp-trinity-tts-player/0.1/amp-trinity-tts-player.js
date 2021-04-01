/**
 * Copyright 2021 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Layout} from '../../../src/layout';
import {dict} from '../../../src/utils/object';
import {getChildJsonConfig} from '../../../src/json';
import {getData} from '../../../src/event-helper';
import {isExperimentOn} from '../../../src/experiments';
import {triggerAnalyticsEvent} from '../../../src/analytics';
import {user, userAssert} from '../../../src/log';

const TAG = 'amp-trinity-tts-player';
const VERSION = '0.1';
const TRINITY_URL = 'https://trinitymedia.ai';
const TRINITY_EVENT_TYPE = 'TRINITY_TTS';

export class AmpTrinityTTSPlayer extends AMP.BaseElement {
  /** @param {!AmpElement} element */
  constructor(element) {
    super(element);

    /** @private {string} */
    this.unitId_ = '';

    /** @private {string} */
    this.pageURL_ = '';

    /** @private {!JsonObject} */
    this.params_ = '';

    this.isExperimentOn_ = isExperimentOn(this.win, 'amp-trinity-tts-player');
  }

  /** @override */
  isLayoutSupported(layout) {
    return layout === Layout.FIXED_HEIGHT;
  }

  /** @override */
  buildCallback() {
    userAssert(this.isExperimentOn_, `Experiment ${TAG} is not turned on.`);

    this.unitId_ = this.getAttribute_('data-unit-id', true);
    this.pageURL_ = this.getAttribute_('data-page-url', true);
    this.params_ = this.getParams_();
  }

  /** @override */
  layoutCallback() {
    userAssert(this.isExperimentOn_, `Experiment ${TAG} is not turned on.`);

    const queryParams = new URLSearchParams({
      ...this.params_,
      readContentConfig: JSON.stringify({
        url: this.pageURL_,
        dataType: 'html',
      }),
      platform: 'AMP',
      version: VERSION,
      appName: 'AMP',
      appVersion:
        AMP.win.document.children[0]?.attributes['amp-version']?.value,
    }).toString();

    const src = `${TRINITY_URL}/player/trinity-iframe/${this.unitId_}/?${queryParams}`;

    this.iframe_ = this.win.document.createElement('iframe');
    this.iframe_.setAttribute('src', src);
    this.iframe_.setAttribute('hidden', true);
    this.iframe_.setAttribute('frameborder', '0');
    this.iframe_.setAttribute('allowfullscreen', 'true');

    this.applyFillContent(this.iframe_);
    this.element.appendChild(this.iframe_);

    return new Promise((resolve) => {
      window.addEventListener('message', (event) => {
        this.handleTrinityEvent_(event, resolve);
      });
    });
  }

  /**
   *
   * @private
   * @param {MessageEvent} event from the Trinity player iframe
   * @param {function} onPlayerReadyCallback
   */
  handleTrinityEvent_(event, onPlayerReadyCallback) {
    const eventData = getData(event);

    if (eventData.type !== TRINITY_EVENT_TYPE) {
      return;
    }

    const {action, message} = eventData.value || {};

    if (!action) {
      return;
    }

    if (action === 'playerReady') {
      this.iframe_.removeAttribute('hidden');
      onPlayerReadyCallback();
    }

    const {duration, from, to, src} = message || {};

    triggerAnalyticsEvent(
      this.element,
      TRINITY_EVENT_TYPE,
      dict({
        'eventAction': action,
        'duration': duration,
        'from': from,
        'to': to,
        'src': src,
      })
    );
  }

  /**
   *
   * @private
   * @param {string} name
   * @param {boolean} required false by default
   * @return {string} attribute value
   */
  getAttribute_(name, required = false) {
    if (required) {
      return userAssert(
        this.element.getAttribute(name),
        `${name} attribute must be specified for ${TAG}`
      );
    } else {
      return this.element.getAttribute(name);
    }
  }

  /**
   *
   * @private
   * @return {!JsonObject}
   */
  getParams_() {
    const {children} = this.element;
    if (children.length == 1) {
      try {
        return getChildJsonConfig(this.element)?.params || {};
      } catch (error) {
        user().error(TAG, error);
        return {};
      }
    } else if (children.length > 1) {
      user().error(TAG, 'The tag should contain only one <script> child.');
    }
  }
}

AMP.extension(TAG, VERSION, (AMP) => {
  AMP.registerElement(TAG, AmpTrinityTTSPlayer);
});
