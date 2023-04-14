# PGP Key Manager

> **Warning**
> This is currently an unreleased preview. The API is subject to change.

## What is it?

This package deals with the handling of PGP keys in your web application. It aims to do so in a convenient, secure and performant way, exposing a simple API that does the heavy lifting for you.

## How does it work?

Under the hood, it uses web workers to isolate the keys and function executions from the main thread. This helps security by making it much harder for rogue dependencies in your code to intercept those keys. This package has no dependencies besides OpenPGP.

In code, you import decrypted keys into the key manager, which orchestrates the aforementioned web worker(s). You can then request jobs, like encryption and decryption, using a previously imported key by providing an ID reference. This is all wrapped up in a simple API which uses promises and TypeScript types to make it asynchronous and easy to use.

## What's Implemented?

### Features

|     Status      | Feature                            | Milestone |
| :-------------: | :--------------------------------- | :-------: |
| :yellow_circle: | Store keys                         |  `1.0.0`  |
| :yellow_circle: | Encrypt/decrypt jobs               |  `1.0.0`  |
| :yellow_circle: | Pooling (multiple workers/threads) |           |

### Platforms

|       Status       | Platform | Milestone |
| :----------------: | :------- | :-------: |
| :white_check_mark: | Browser  |  `1.0.0`  |
|   :construction:   | Node.js  |           |

### Frameworks

|       Status       | Framework | Milestone |
| :----------------: | :-------- | :-------: |
| :white_check_mark: | Svelte    |  `1.0.0`  |
|    :red_circle:    | Others... |           |

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

To get started:

```js
import { createKeyManager } from 'key-manager';

const keyManager = createKeyManager();
```

## Examples

TODO

## API Reference

TODO
