<div align=center>

# [Enclave KMS](https://github.com/enclavetech/kms)

[![Build Status](https://github.com/enclavetech/kms/actions/workflows/build.yml/badge.svg)](https://github.com/enclavetech/kms/actions/workflows/build.yml) [![Known Vulnerabilities](https://snyk.io/test/github/enclavetech/kms/badge.svg)](https://snyk.io/test/github/enclavetech/kms) [![License](https://img.shields.io/github/license/enclavetech/kms)](LICENSE)

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

|                 Status                 | Feature                            |
| :------------------------------------: | :--------------------------------- |
| [:white_check_mark:](## 'Implemented') | Import keys                        |
| [:white_check_mark:](## 'Implemented') | Symmetric encrypt/decrypt          |
| [:white_check_mark:](## 'Implemented') | Asymmetric encrypt/decrypt         |
| [:white_check_mark:](## 'Implemented') | Hybrid encrypt/decrypt             |
|     [:construction:](## 'Planned')     | Signing/verifying                  |
| [:white_check_mark:](## 'Implemented') | Session import/export/destroy      |
| [:white_check_mark:](## 'Implemented') | Pooling (multiple workers/threads) |
| [:white_check_mark:](## 'Implemented') | Bring your own crypto library      |
|     [:construction:](## 'Planned')     | Tests                              |

### Platform Support

|                Status                | Platform |
| :----------------------------------: | :------- |
| [:white_check_mark:](## 'Supported') | Browser  |
|    [:construction:](## 'Planned')    | Node.js  |

### Library Support

Enclave KMS has been designed in a generic way to enable its use with virtually any crypto system simply by creating an adapter. The following are officially supported or planned:

<!-- TODO: provide adapter docs -->

|                Status                | Library                               | Adapter Package                                         |
| :----------------------------------: | :------------------------------------ | :------------------------------------------------------ |
| [:white_check_mark:](## 'Supported') | [OpenPGP.js](https://openpgpjs.org)   | [`@enclavetech/kms-openpgp`](packages/adapters/openpgp) |
|    [:construction:](## 'Planned')    | [jose](https://github.com/panva/jose) |

## Installation

Install `@enclavetech/kms-core`, `@enclavetech/kms-openpgp`, and its peer dependency `openpgp`:

```sh
npm i https://gitpkg.now.sh/enclavetech/kms/packages/core https://gitpkg.now.sh/enclavetech/kms/packages/adapters/openpgp openpgp
```

### TypeScript

If you are using TypeScript, you may need to install `@openpgp/web-stream-tools` as a devDependency too.

See: <https://github.com/openpgpjs/openpgpjs#typescript>.

```sh
npm i -D @openpgp/web-stream-tools
```

## Usage

To get started, instantiate `KMS` from the library adapter package.

```js
import { KMS } from '@enclavetech/kms-openpgp';

const kms = new KMS();
```

### Configuration

The KMS instance can be configured by passing a [`KmsConfig`](packages/core/src/primary/interfaces/kms-config.ts) object during instantiation:

```js
import { KMS } from '@enclavetech/kms-openpgp';

const config = {
  clusterSize: 2,
};

const kms = new KMS(config);
```

## API Reference

TODO
