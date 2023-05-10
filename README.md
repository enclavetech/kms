<div align=center>

# [Enclave KMS](https://github.com/enclavetech/kms)

[![Build Status](https://github.com/enclavetech/key-manager/actions/workflows/build.yml/badge.svg)](https://github.com/enclavetech/key-manager/actions/workflows/build.yml) [![Known Vulnerabilities](https://snyk.io/test/github/enclavetech/key-manager/badge.svg)](https://snyk.io/test/github/enclavetech/key-manager) [![License](https://img.shields.io/github/license/enclavetech/key-manager)](LICENSE) <!-- TODO: uncomment once dist dirs no longer in repo [![Lines of code](https://img.shields.io/tokei/lines/github/enclavetech/key-manager)](https://github.com/enclavetech/kms) -->

</div>

<!-- TODO: table of contents -->

## About

This package deals with the handling of cryptographic keys in your frontend web app. It aims to do so in a convenient, secure and performant way, by exposing a simple, strongly typed API that does the heavy lifting.

In addition, the core package has been designed to be extensible rather than being tied to a single encryption/signing library. See [Library Support](#library-support).

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

### Instantiation

```js
import { KmsCluster, KmsWorker } from '@enclavetech/kms-openpgp';

// multiple worker threads
const kmsCluster = new KmsCluster();

// or one worker thread only
const kmsWorker = new KmsWorker();
```

`KmsCluster` is an implementation that will orchestrate jobs across multiple worker threads (defaults to 4, as most consumer CPUs these days have at least 4 threads available.) If you only use a single worker thread in your app, you can instantiate a `KmsWorker` instead to save slightly on overhead. Under the hood, `KmsCluster` is managing multiple `KmsWorker` instances. Both, however, extend the same `KMS` abstract class.

#### TypeScript

If you are using TypeScript, use the abstract class `KMS` from the core package as the type:

```ts
import type { KMS } from '@enclavetech/kms-core';
import { KmsCluster } from '@enclavetech/kms-openpgp';

const kms: KMS = new KmsCluster();
```

#### Config

The KMS instance can be configured by passing a [`KmsConfig`](packages/core/src/interfaces/configs/kms-config.ts) object during instantiation:

```js
import { KmsCluster } from '@enclavetech/kms-openpgp';

const kmsConfig = {
  clusterSize: 2,
};

const kms = new KmsCluster(kmsConfig);
```

##### Config Options

|   Property    |   type   | Description                                                              |
| :-----------: | :------: | :----------------------------------------------------------------------- |
| `clusterSize` | `number` | Number of worker threads to use. Only applies to clusters. Must be >= 1. |

See: [kms-config.ts](packages/core/src/interfaces/configs/kms-config.ts).

## API Reference

TODO
