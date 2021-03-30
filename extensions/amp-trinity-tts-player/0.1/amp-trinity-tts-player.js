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
import {getData} from '../../../src/event-helper';
import {isExperimentOn} from '../../../src/experiments';
import {triggerAnalyticsEvent} from '../../../src/analytics';
import {userAssert} from '../../../src/log';

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

    this.isExperimentOn_ = isExperimentOn(this.win, 'amp-trinity-tts-player');
  }

  /** @override */
  isLayoutSupported(layout) {
    return layout === Layout.FIXED_HEIGHT;
  }

  /** @override */
  buildCallback() {
    userAssert(this.isExperimentOn_, `Experiment ${TAG} is not turned on.`);

    this.unitId_ = this.getAttribute('data-unit-id');
    this.pageURL_ = this.getAttribute('data-page-url');
  }

  /** @override */
  layoutCallback() {
    userAssert(this.isExperimentOn_, `Experiment ${TAG} is not turned on.`);

    const readContentConfig = encodeURIComponent(
      JSON.stringify({
        url: this.pageURL_,
        dataType: 'html',
      })
    );
    const sdk = {
      platform: 'AMP',
      version: VERSION,
      appName: 'AMP',
      appVersion:
        AMP.win.document.children[0]?.attributes['amp-version']?.value,
    };

    const script = this.win.document.createElement('script');

    script.setAttribute(
      'src',
      `${TRINITY_URL}/player/trinity/${this.unitId_}/?readContentConfig=${readContentConfig}&SDKPlatform=${sdk.platform}&SDKVersion=${sdk.version}&SDKAppName=${sdk.appName}&SDKAppVersion=${sdk.appVersion}`
    );

    this.element.appendChild(script);

    return new Promise((resolve) => {
      window.addEventListener('message', (event) => {
        this.handleTrinityEvent(event, resolve);
      });
    });
  }

  /**
   *
   * @param {MessageEvent} event from the Trinity player iframe
   * @param {function} onPlayerReadyCallback
   */
  handleTrinityEvent(event, onPlayerReadyCallback) {
    const eventData = getData(event);

    if (eventData.type !== TRINITY_EVENT_TYPE) {
      return;
    }

    const {action, message} = eventData.value || {};

    if (action === 'playerReady') {
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
   * @param {string} name
   * @return {string} attribute value
   */
  getAttribute(name) {
    return userAssert(
      this.element.getAttribute(name),
      `${name} attribute must be specified for ${TAG}`
    );
  }
}

AMP.extension(TAG, VERSION, (AMP) => {
  AMP.registerElement(TAG, AmpTrinityTTSPlayer);
});
