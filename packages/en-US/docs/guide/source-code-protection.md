# Source Code Protection

::: tip NOTE
Source code protection feature is available since electron-vite 1.0.9.
:::

We all know that Electron uses javascript to build desktop applications, which makes it very easy for hackers to unpack our applications, modify logic to break commercial restrictions, repackage, and redistribute cracked versions.

## Solutions

To really solve the problem, in addition to putting all the commercial logic on the server side, we need to harden the code to avoid unpacking, tampering, repackaging, and redistributing.

The mainstream plan:

1. **Uglify / Obfuscator:** Minimize the readability of JS code by uglifying and obfuscating it.
2. **Native encryption:** Encrypt the bundle via XOR or AES, encapsulated into Node Addon, and decrypted by JS at runtime.
3. **ASAR encryption:** Encrypt the Electron ASAR file, modify the Electron source code, decrypt the ASAR file before reading it, and then run it.
4. **V8 bytecode:** The `vm` module in the Node standard library can generate its cache data from script objects ([see](https://nodejs.org/api/vm.html#vm_script_createcacheddata)). The cached data can be interpreted as v8 bytecode, which is distributed to achieve source code protection.

Scheme comparison:

| -               | Obfuscator | Native encryption | ASAR encryption | V8 bytecode |
| :-------------: | :--------: | :---------------: | :-------------: | :---------: |
| **Unpack**      | Easy       | High              |  High           | High        |
| **Tampering**   | Easy       | Easy              |  Middle         | High        |
| **Readability** | Easy       | Easy              |  Easy           | High        |
| **Repackaging** | Easy       | Easy              |  Easy           | Easy        |
| **Access cost** | Low        | High              |  High           | Middle      |
| **Overall protection**  | Low        | Middle            |  Middle         | High        |


For now, the solution with v8 bytecode seems to be the best one.

Read more:

- [Electron code protection solution based on Node.js Addon and V8 bytecode](https://www.mo4tech.com/electron-code-protection-solution-based-on-node-js-addon-and-v8-bytecode.html)

## What is V8 Bytecode

As we can understand, V8 bytecode is a serialized form of JavaScript parsed and compiled by the V8 engine, and it is often used for performance optimization within the browser. So if we run the code through V8 bytecode, we can not only protect the code, but also improve performance.

electron-vite inspired by [bytenode](https://github.com/bytenode/bytenode), the specific implementation:

- Implement a plugin `bytecodePlugin` to parse the bundles, and determines whether to compile to bytecode.
- Start the Electron process to compile the bundles into `.jsc` files and ensure that the generated bytecode can run in Electron's Node environment.
- Generate a bytecode loader to enable Electorn applications to load bytecode modules.
- Support developers to freely decide which chunks to compile.

In addition, electron-vite also solves some problems that `bytenode` can't solve:

- Fixed the issue where async arrow functions could crash Electron apps.

::: warning Warning
The `Function.prototype.toString` is not supported, because the source code does not follow the bytecode distribution, so the source code for the function is not available.
:::

## Enable Bytecode to Protect Your Electron Source Code

Use the plugin `bytecodePlugin` to enable it:

```js
import { defineConfig, bytecodePlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [bytecodePlugin()]
  },
  preload: {
    plugins: [bytecodePlugin()]
  },
  renderer: {
    // ...
  }
})
```

::: tip NOTE
`bytecodePlugin` only works in production and supports main process and preload scripts.

It is important to note that the preload script needs to disable the `sandbox` to support the bytecode, because the bytecode is based on the Node's `vm` module. Since Electron 20, renderers will be sandboxed by default, so if you want to use bytecode to protect preload scripts you need to set `sandbox: false`.
:::

##  `bytecodePlugin` Options

### chunkAlias

- Type: `string | string[]`

Set chunk alias to instruct the bytecode compiler to compile the associated bundles. Usually needs to be used with the option `build.rollupOptions.output.manualChunks`.

### transformArrowFunctions

- Type: `boolean`
- default: `false`

Set `true` to transform arrow functions to normal functions.

### removeBundleJS

- Type: `boolean`
- default: `true`

Set `false` to keep bundle files which compiled as bytecode files.

## Customizing Protection

For example, only protect `src/main/foo.ts`:

```{5}
.
├──src
│  ├──main
│  │  ├──index.ts
│  │  ├──foo.ts
│  │  └──...
└──...
```

You can modify your config file like this:

```js
import { defineConfig, bytecodePlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [bytecodePlugin({ chunkAlias: 'foo' })],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id): string | void {
            if (id.includes('foo')) {
              return 'foo'
            }
          }
        }
      }
    }
  },
  preload: {
    // ...
  },
  renderer: {
    // ...
  }
})
```

## Examples

You can learn more by playing with the [example](https://github.com/alex8088/electron-vite-bytecode-example).

## Limitations of V8 Bytecode

V8 bytecode does not protect strings, so if we write some database keys and other information in JS code, we can still see the string contents directly by reading V8 bytecode as a string.

## QA

### Impact on code organization and writing?

The only effect that bytecode schemes have found on code so far is `Function.prototype.toString()`Method does not work because the source code does not follow the bytecode distribution, so the source code for the function is not available.

### Does it affect application performance?

There is no impact on code execution performance and a slight improvement.

### Impact on program volume?

For bundles of only a few hundred KILobytes, there is a significant increase in bytecode size, but for 2M+ bundles, there is no significant difference in bytecode size.

### How strong is the code protection?

Currently, there are no tools available to decompile V8 bytecode, so this solution is reliable and secure.