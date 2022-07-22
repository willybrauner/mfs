# mfs

`mfs` (micro-fs) is a nodejs fs wrapper that provides some hight level functions collection
for manipulating files and directories.

## Installation

```shell
npm install @wbe/mfs
```

## Usage

```js
import { * as mfs } from '@wbe/mfs';

(async () => {
  await mfs.createFile('foo.txt', 'Hello World');
  const content = await mfs.readFile('foo.txt');
  console.log(content); // Hello World
})();
```

## API

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

## License

MIT

## Credits

© Willy Brauner
