# mfs

`mfs` (micro-fs) is a nodejs fs wrapper that provides a collection of high-level functions for manipulating files and directories.

## Installation

```shell
npm install @wbe/mfs
```

## Usage

```js
import { * as mfs } from '@wbe/mfs';

(async () => {
  // create a new file in a non-existing directory
  await mfs.createFile('/test/foo.txt', 'Hello World');
  const content = await mfs.readFile('/test/foo.txt');
  console.log(content); // -> "Hello World"
})();
```

## API

### Async functions

- fileExists

```ts
function fileExists(path: string): Promise<boolean>
```

- createFile

```ts
function createFile(path: string, content?: string): Promise<void>
```

- readFile

```ts
function readFile(path: string): Promise<string>
```

- removeFile

```ts
function removeFile(path: string): Promise<boolean>
```

- copyFile

```ts
function copyFile(
  src: string,
  dest: string,
  {
    transform,
    force,
  }: { transform?: (content: string) => Promise<string>; force?: boolean }
): Promise<void>
```

- dirExists

```ts
function dirExists(path: string): Promise<boolean>
```

- readDir

```ts
function readDir(path: string, recursive = true): Promise<string[]>
```

- removeDir

```ts
function removeDir(path: string): Promise<void>
```

- createDir

```ts
function createDir(path: string): Promise<string | undefined>
```

- copyDir

```ts
function copyDir(
  src: string,
  dest: string,
  { force }: { force?: boolean } = {}
): Promise<void>
```


### Sync functions

- fileExistsSync

```ts
function fileExistsSync(path: string): boolean
```

- createFileSync

```ts
function createFileSync(path: string, content?: string): void
```

- readFileSync

```ts
function readFileSync(path: string): string
```

- removeFileSync

```ts
function removeFileSync(path: string): boolean
```

- copyFileSync

```ts
function copyFileSync(
  src: string,
  dest: string,
  {
    transform,
    force,
  }: { transform?: (content: string) => string; force?: boolean }
): void
```

- dirExistsSync

```ts
function dirExistsSync(path: string): boolean
```

- readDirSync

```ts
function readDirSync(path: string, recursive = true): string[]
```

- removeDirSync

```ts
function removeDirSync(path: string): void
```

- createDirSync

```ts
function createDirSync(path: string): string | undefined
```

- copyDirSync

```ts
function copyDirSync(src: string, dest: string, { force }: { force?: boolean } = {}): void
```

## License

MIT

## Credits

© Willy Brauner
