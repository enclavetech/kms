# PGP Key Manager

> **Warning**
> This is currently an unreleased preview. The API is subject to change.

<div align=center>

[![Build Status](https://github.com/enclavetech/key-manager/actions/workflows/build.yml/badge.svg)](https://github.com/enclavetech/key-manager/actions/workflows/build.yml) [![Known Vulnerabilities](https://snyk.io/test/github/enclavetech/key-manager/badge.svg)](https://snyk.io/test/github/enclavetech/key-manager) ![License](https://img.shields.io/github/license/enclavetech/key-manager) <!-- ![Lines of code](https://img.shields.io/tokei/lines/github/enclavetech/key-manager) -->

</div>

## What is it?

This package deals with the handling of PGP keys in your web application. It aims to do so in a convenient, secure and performant way, exposing a simple API that does the heavy lifting for you.

## How does it work?

Under the hood, it uses web workers to isolate the keys and function executions from the main thread. This helps security by making it much harder for rogue dependencies in your code to intercept those keys. This package has no dependencies besides OpenPGP.

In code, you import decrypted keys into the key manager, which orchestrates the aforementioned web worker(s). You can then request jobs, like encryption and decryption, using a previously imported key by providing an ID reference. This is all wrapped up in a simple API which uses promises and TypeScript types to make it asynchronous and easy to use.

## What's Implemented?

### Features

|       Status       | Feature                            | Milestone |
| :----------------: | :--------------------------------- | :-------: |
| :white_check_mark: | Import keys                        |  `1.0.0`  |
|  :yellow_circle:   | Encrypt/decrypt jobs               |  `1.0.0`  |
| :white_check_mark: | Pooling (multiple workers/threads) |  `1.0.0`  |
|  :yellow_circle:   | Session import/export/destroy      |  `1.0.0`  |
|   :construction:   | Custom defined ID generators       |           |

### Platforms

|       Status       | Platform | Milestone |
| :----------------: | :------- | :-------: |
| :white_check_mark: | Browser  |  `1.0.0`  |
|   :construction:   | Node.js  |           |

### Frameworks

|       Status       | Framework | Milestone |
| :----------------: | :-------- | :-------: |
| :white_check_mark: | Svelte    |  `1.0.0`  |
|        :x:         | Others... |           |

## How to install?

With NPM:

```sh
npm i "enclavetech/key-manager#preview"
```

This will install from the tip of the preview branch here on GitHub. This is recommended for now, however you could substitute `preview` for another branch name, like `main` or `v1`, if you wish.

Also, ensure the peer dependency `openpgp` is installed:

```sh
npm i openpgp
```

If you are using TypeScript, you may need to install `@openpgp/web-stream-tools` as a devDependency too.

See: [openpgpjs#typescript](https://github.com/openpgpjs/openpgpjs#typescript).

```sh
npm i -D @openpgp/web-stream-tools
```

To get started:

```js
import { createKeyManager } from 'key-manager';

const keyManager = createKeyManager();
```

## Known Issues

- In order to track callbacks, there is an auto-incrementing job counter - a simple JavaScript `number` - per worker. There is, theoretically, an upper limit to this, but it is very unlikely to be a problem for most applications. The callbacks are removed once resolved, so previous job IDs could be reused.

- We are considering making the `destroySession` job more aggressive by replacing class members rather than just resetting them. This may, however, interfere with the callback system and create issues.

## Examples

TODO

## API Reference

TODO
