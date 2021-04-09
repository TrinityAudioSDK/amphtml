---
$category@: media
formats:
  - websites
  - email
teaser:
  text: Displays a cloud-hosted Trinity Audio Text To Speech Player.
experimental: true
---

<!---
Copyright 2021 The AMP HTML Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS-IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

# amp-trinity-tts-player

<table>
  <tr>
    <td width="40%"><strong>Description</strong></td>
    <td>Displays a cloud-hosted Text To Speech <a href="https://trinityaudio.ai/" target="_blank">Trinity Audio Player</a></td>
  </tr>
  <tr>
    <td width="40%"><strong>Required Script</strong></td>
    <td><code>&lt;script async custom-element="amp-trinity-tts-player" src="https://cdn.ampproject.org/v0/amp-trinity-tts-player-0.1.js">&lt;/script></code></td>
  </tr>
  <tr>
    <td class="col-fourty"><strong><a href="https://amp.dev/documentation/guides-and-tutorials/develop/style_and_layout/control_layout">Supported Layouts</a></strong></td>
    <td>fixed-height</td>
  </tr>
  <tr>
    <td width="40%"><strong>Examples</strong></td>
    <td><a href="https://amp.dev/documentation/examples/components/amp-trinity-tts-player/">Annotated code example for amp-trinity-tts-player</a></td>
  </tr>
</table>

## Usage

```html
<amp-trinity-tts-player
  height="70"
  data-unit-id="XXXXXXX"
  data-page-url="https://example-publisher.com/article.html">
></amp-trinity-tts-player>
```

## Attributes

<table>
  <tr>
    <td width="40%"><strong>data-unit-id (required)</strong></td>
    <td>Trinity Audio unit Id <code>XXXXXXX</code></td>
  </tr>
  <tr>
    <td width="40%"><strong>data-page-url (required)</strong></td>
    <td>A URL of the canonical page which content matches to AMP version</td>
  </tr>
  <tr>
    <td width="40%"><strong>height (required)</strong></td>
    <td>The height of a player. Should be set to 70px for desktop and mobile</td>
  </tr>
  <tr>
    <td width="40%"><strong>data-params</strong></td>
    <td>The list of additional parameters in JSON format string</td>
  </tr>
</table>

## Analytics example

```html
<amp-analytics type="gtag" data-credentials="include">
  <script type="application/json">
    {
      "vars": {
        "gtag_id": "UA-XXXXXXXXXX-X",
        "config": {
          "UA-XXXXXXXXXX-X": { "groups": "default" }
        }
      },
      "triggers": {
        "trinityTTSPlayer": {
          "on": "amp-trinity-tts-event",
          "selector": "#trinity-tts-player",
          "vars": {
            "event_name": "custom",
            "event_action": "${eventAction}",
            "event_label": "trinity-tts"
          }
        }
      },
      "extraUrlParams": {
        "duration": "${duration}",  // for contentStarted event
        "src": "${src}",            // for contentStarted event
        "from": "${from}",          // for scrubbing event
        "to": "${to}"               // for scrubbing event
      }
    }
  </script>
</amp-analytics>

<amp-trinity-tts-player
  id="trinity-tts-player"
  height="70"
  data-unit-id="XXXXXXX"
  data-page-url="https://example-publisher.com/article.html">
></amp-trinity-tts-player>
```

# Additional params example (optional)

The ability to override default/cloud settings configuration. The full list of parameters is provided by Trinity Audio as part of the integration process.
This is to allow runtime overrides which are content specific VS the general unit config.

```html
<amp-trinity-tts-player
  height="70"
  data-unit-id="XXXXXXX"
  data-page-url="https://example-publisher.com/article.html"
>
  <script type="application/json">
    {
      "params": {
        "lang": "en",
        "voiceId": "Amy"
      }
    }
  </script>
</amp-trinity-tts-player>
```

## Validation

See [amp-trinity-tts-player rules](https://github.com/ampproject/amphtml/blob/master/extensions/amp-trinity-tts-player/validator-amp-trinity-tts-player.protoascii) in the AMP validator specification.

