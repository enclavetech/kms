<div align=center>

# [Enclave KMS](https://github.com/enclavetech/kms)

[![Build Status](https://github.com/enclavetech/key-manager/actions/workflows/build.yml/badge.svg)](https://github.com/enclavetech/key-manager/actions/workflows/build.yml) [![Known Vulnerabilities](https://snyk.io/test/github/enclavetech/key-manager/badge.svg)](https://snyk.io/test/github/enclavetech/key-manager) [![License](https://img.shields.io/github/license/enclavetech/key-manager)](LICENSE) <!-- TODO: uncomment once dist dirs no longer in repo [![Lines of code](https://img.shields.io/tokei/lines/github/enclavetech/key-manager)](https://github.com/enclavetech/kms) -->

</div>

<!-- TODO: table of contents -->

## About

This package deals with the handling of cryptographic keys in your frontend web app. It aims to do so in a convenient, secure and performant way, by exposing a simple, strongly typed API that does the heavy lifting.

In addition, the [core package](packages/core) has been designed to be extensible rather than being tied to a single encryption/signing library. See [Library Support](#library-support).

The core package itself has [no direct dependencies](packages/core/package.json).

## How does it work?

Under the hood, it uses web workers to isolate the keys and function executions from the main thread. This helps security by making it much harder for rogue dependencies in your code to intercept those keys.

## What's Implemented?

### Features

|       Status       | Feature                            |
| :----------------: | :--------------------------------- |
| :white_check_mark: | Import private keys                |
|   :construction:   | Import public keys & key pairs     |
|   :construction:   | Symmetric encrypt/decrypt          |
| :white_check_mark: | Asymmetric encrypt/decrypt         |
| :white_check_mark: | Hybrid encrypt/decrypt             |
| :white_check_mark: | Session import/export/destroy      |
| :white_check_mark: | Pooling (multiple workers/threads) |
| :white_check_mark: | Bring your own crypto library      |
|   :construction:   | Tests                              |

### Platform Support

|       Status       | Platform |
| :----------------: | :------- |
| :white_check_mark: | Browser  |
|   :construction:   | Node.js  |

### Library Support

Enclave KMS has been designed in a generic way to enable its use with virtually any crypto system by creating an adapter. The following are officially supported or planned:

<!-- TODO: provide adapter docs -->

|       Status       | Library                               | Package                                        |
| :----------------: | :------------------------------------ | :--------------------------------------------- |
| :white_check_mark: | [OpenPGP.js](https://openpgpjs.org)   | [`@enclavetech/kms-openpgp`](packages/openpgp) |
|   :construction:   | [jose](https://github.com/panva/jose) |

## Installation

Install `@enclavetech/kms-core`, `@enclavetech/kms-openpgp`, and its peer dependency `openpgp`:

```sh
npm i https://gitpkg.now.sh/enclavetech/kms/packages/core https://gitpkg.now.sh/enclavetech/kms/packages/openpgp openpgp
```

If you are using TypeScript, you may need to install `@openpgp/web-stream-tools` as a devDependency too.

See: <https://github.com/openpgpjs/openpgpjs#typescript>.

```sh
npm i -D @openpgp/web-stream-tools
```

## Usage

The recommended way to get started with no configuration is to instantiate `KmsCluster` from the library adapter package.

```js
import { KmsCluster, KmsWorker } from '@enclavetech/kms-openpgp';

// multiple worker threads
const kmsCluster = new KmsCluster();

// or one worker thread only
const kmsWorker = new KmsWorker();
```

- **`KmsCluster`:** _(recommended)_ Orchestrates multiple `KmsWorker` instances (defaults to 4 in the browser as most consumer CPUs these days have at least 4 threads available.)

- **`KmsWorker`:** Controls a single web worker. If you are only making light use of KMS and use a single worker thread in your app, you can instantiate `KmsWorker` (instead of `KmsCluster`) to save on overhead.

Both `KmsCluster` and `KmsWorker` implement the `KMS` abstract class, which defines the public API.

### TypeScript

If you are using TypeScript, use `KMS` from the core package as the type:

```ts
import type { KMS } from '@enclavetech/kms-core';
import { KmsCluster } from '@enclavetech/kms-openpgp';

const kms: KMS = new KmsCluster();
```

### Configuration

The KMS instance can be configured by passing a [`KmsConfig`](packages/core/src/interfaces/configs/kms-config.ts) object during instantiation:

```js
import { KmsCluster } from '@enclavetech/kms-openpgp';

const kmsConfig = {
  clusterSize: 2,
};

const kms = new KmsCluster(kmsConfig);
```

#### Options

|   Property    |   Type   | Default | Description                                                                  |
| :-----------: | :------: | :-----: | :--------------------------------------------------------------------------- |
| `clusterSize` | `number` |   `4`   | Number of worker threads to use. Only applies to KMS Clusters. Must be >= 1. |

See: [kms-config.ts](packages/core/src/interfaces/configs/kms-config.ts).

## API Reference

TODO
