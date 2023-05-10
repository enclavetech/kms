<div align=center>

# [Enclave KMS](https://github.com/enclavetech/kms)

[![Build Status](https://github.com/enclavetech/key-manager/actions/workflows/build.yml/badge.svg)](https://github.com/enclavetech/key-manager/actions/workflows/build.yml) [![Known Vulnerabilities](https://snyk.io/test/github/enclavetech/key-manager/badge.svg)](https://snyk.io/test/github/enclavetech/key-manager) [![License](https://img.shields.io/github/license/enclavetech/key-manager)](LICENSE) <!-- TODO: uncomment once dist dirs no longer in repo [![Lines of code](https://img.shields.io/tokei/lines/github/enclavetech/key-manager)](https://github.com/enclavetech/kms) -->

</div>

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
| :white_check_mark: | Encrypt/decrypt jobs               |
| :white_check_mark: | Pooling (multiple workers/threads) |
| :white_check_mark: | Session import/export/destroy      |
| :white_check_mark: | Hybrid encryption support          |
| :white_check_mark: | Bring your own crypto library      |
|   :construction:   | Public key support                 |
|   :construction:   | Tests                              |

### Platform Support

|       Status       | Platform |
| :----------------: | :------- |
| :white_check_mark: | Browser  |
|   :construction:   | Node.js  |

### Library Support

Enclave KMS has been designed in a generic way to enable its use with virtually any crypto system. The following are officially supported, however others could also be supported by creating a library implementation.

<!-- TODO: provide library implementation docs -->

|       Status       | Library                               | Package                                            |
| :----------------: | :------------------------------------ | :------------------------------------------------- |
| :white_check_mark: | [OpenPGP.js](https://openpgpjs.org)   | [`@enclavetech/kms-openpgpjs`](packages/openpgpjs) |
|   :construction:   | [jose](https://github.com/panva/jose) |

## Installation

Install `@enclavetech/kms-core`, `@enclavetech/kms-openpgp`, and its peer dependency `openpgp`:

```sh
npm i https://gitpkg.now.sh/enclavetech/kms/packages/core https://gitpkg.now.sh/enclavetech/kms/packages/openpgp openpgp
```

If you are using TypeScript, you may need to install `@openpgp/web-stream-tools` as a devDependency too.

See: [openpgpjs#typescript](https://github.com/openpgpjs/openpgpjs#typescript).

```sh
npm i -D @openpgp/web-stream-tools
```

To get started:

```ts
import { KMS } from '@enclavetech/kms-core';
import { KmsCluster } from '@enclavetech/kms-openpgp';

const kms: KMS = new KmsCluster();
```

## API Reference

TODO
