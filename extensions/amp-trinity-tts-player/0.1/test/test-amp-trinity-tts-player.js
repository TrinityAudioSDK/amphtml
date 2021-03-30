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

import '../amp-trinity-tts-player';
import {createElementWithAttributes} from '../../../../src/dom';
import {toggleExperiment} from '../../../../src/experiments';

describes.realWin(
  'amp-trinity-tts-player',
  {
    amp: {
      extensions: ['amp-trinity-tts-player'],
    },
  },
  (env) => {
    let win, doc;
    let element;

    beforeEach(() => {
      win = env.win;
      doc = win.document;

      toggleExperiment(win, 'amp-trinity-tts-player', true);

      element = createElementWithAttributes(doc, 'amp-trinity-tts-player', {
        'data-unit-id': '2900004035',
        'data-page-url': 'https://demo.trinityaudio.ai/general-demo/demo.html',
        'height': 70,
      });

      doc.body.appendChild(element);
    });

    it('should render the iframe', async () => {
      await element.buildInternal();
      element.layoutCallback(); // do not await because will not be resolved. In the fake iframe player will not be rendered therefore playerReady event not firing

      const {src} = element.querySelector('script').attributes;
      expect(src.value).to.eq(
        'https://trinitymedia.ai/player/trinity/2900004035/?readContentConfig=%7B%22url%22%3A%22https%3A%2F%2Fdemo.trinityaudio.ai%2Fgeneral-demo%2Fdemo.html%22%2C%22dataType%22%3A%22html%22%7D&SDKPlatform=AMP&SDKVersion=0.1&SDKAppName=AMP&SDKAppVersion=undefined'
      );
    });
  }
);
