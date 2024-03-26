import * as fs from "fs/promises"
import * as fsSync from "fs"
import {dirname, join} from "path"
import {MakeDirectoryOptions} from "fs";

/**
 * Check if a file exists.
 */
export async function fileExists(path: string): Promise<boolean> {
    try {
        return (await fs.stat(path)).isFile()
    } catch (e) {
        return false
    }
}

/**
 * Create & write a file
 */
export async function createFile(path: string, content: string = "", options: MakeDirectoryOptions = {
    recursive: true,
    mode: 0o777
}): Promise<void> {
    try {
        await fs.mkdir(dirname(path), options)
        await fs.chmod(dirname(path), options.mode)
        await fs.writeFile(path, content)
    } catch (e) {
        console.error("writeFile error", e)
    }
}

/**
 * Remove a file.
 */
export async function removeFile(path: string): Promise<boolean> {
    const exist = await fileExists(path)
    if (!exist) {
        console.warn(`Can't remove file "${path}" because it doesn't exist. return.`)
        return
    }

    try {
        await fs.unlink(path)
    } catch (e) {
        return false
    }
}

/**
 * Read a file.
 */
export async function readFile(path: string): Promise<Promise<string> | undefined> {
    try {
        return await fs.readFile(path).then((res) => res.toString())
    } catch (e) {
        console.error("readFile error", e)
    }
}

/**
 * Copy a file.
 * @param src Source path of the file to copy. ex: "src/index.ts"
 * @param dest Destination path of the file to copy. ex: "dist/index.ts" (specify the file name)
 * @param options
 * @returns
 */
export async function copyFile(
    src: string,
    dest: string,
    {
        transform,
        force,
    }: { transform?: (content: string) => Promise<string>; force?: boolean } = {}
): Promise<void> {
    if (!force) {
        const exist = await fileExists(dest)
        if (exist) {
            console.warn(
                `Can't copy file "${dest}" because it already exist on this destination. return.`
            )
            return
        }
    }
    if (transform) {
        let content = await fs.readFile(src).then((res) => res.toString())
        content = await transform(content)
        await createFile(dest, content)
    } else {
        await fs.mkdir(dirname(dest), {recursive: true})
        await fs.copyFile(src, dest)
    }
}

/**
 * Check if a directory exists.
 */
export async function dirExists(path: string): Promise<boolean> {
    try {
        return (await fs.stat(path)).isDirectory()
    } catch (e) {
        return false
    }
}

/**
 * Read a directory.
 */
export async function readDir(path: string, recursive = true): Promise<string[]> {
    const ents = await fs.readdir(path, {withFileTypes: true})
    const results = await Promise.all(
        ents.map((ent) => {
            if (ent.isDirectory() && recursive) {
                return readDir(join(path, ent.name), recursive)
            } else {
                return join(path, ent.name)
            }
        })
    )
    return [...(results || [])].flat()
}

/**
 * Remove a directory.
 */
export async function removeDir(path: string): Promise<void> {
    const exist = await dirExists(path)
    if (!exist) {
        console.warn(`Can't remove "${path}" because it doesn't exist. return`)
        return
    }
    return await fs.rm(path, {recursive: true})
}

/**
 * Create a directory.
 */
export async function createDir(path: string): Promise<string | undefined> {
    return await fs.mkdir(path, {recursive: true})
}

/**
 *
 * @param src Source path of the directory to copy. ex: "src/compoents"
 * @param dest Destination path of the directory to copy. ex: "dist/compoents" (specify the directory name)
 * @param options
 */
export async function copyDir(
    src: string,
    dest: string,
    {force}: { force?: boolean } = {}
): Promise<void> {
    if (!force) {
        const exist = await dirExists(dest)
        if (exist) {
            console.error(
                `Can't copy folder "${dest}" because it already exist on destination. return`
            )
            return
        }
    }

    try {
        if (!(await fs.stat(src)).isDirectory()) throw new Error()
    } catch (e) {
        console.error("copyDir error", e)
    }

    const files = await readDir(src)
    await Promise.all(files.map((file) => copyFile(file, file.replace(src, dest))))
}


// -------------------------------------------------------------------------------- SYNC

/**
 * Check if a file exists.
 */
export function fileExistsSync(path: string): boolean {
    return fsSync.existsSync(path)
}

/**
 * Create & write a file
 */
export function createFileSync(path: string, content: string = "", options: MakeDirectoryOptions = {
    recursive: true,
    mode: 0o777
}): void {
    fsSync.mkdirSync(dirname(path), options)
    fsSync.chmodSync(dirname(path), options.mode)
    fsSync.writeFileSync(path, content)
}

/**
 * Remove a file.
 */
export function removeFileSync(path: string): boolean {
    const exist = fileExistsSync(path);
    if (!exist) {
        console.warn(`Can't remove file "${path}" because it doesn't exist. return.`)
        return
    }
    fsSync.unlinkSync(path)
    return true
}


/**
 * Read a file.
 */
export function readFileSync(path: string): string | undefined {
  return fsSync.readFileSync(path).toString()
}


/**
 * Copy a file.
 */
export function copyFileSync(
    src: string,
    dest: string,
    {
        transform,
        force,
    }: { transform?: (content: string) => string; force?: boolean } = {}
  ): void {
    if (!force) {
      const exist = fileExistsSync(dest)
      if (exist) {
        console.warn(
            `Can't copy file "${dest}" because it already exist on this destination. return.`
        )
        return
      }
    }
    if (transform) {
      let content = fsSync.readFileSync(src).toString()
      content = transform(content)
      createFileSync(dest, content)
    } else {
      fsSync.mkdirSync(dirname(dest), {recursive: true})
      fsSync.copyFileSync(src, dest)
    }
}

/**
 * Check if a directory exists.
 */
export function dirExistsSync(path: string): boolean {
  return fsSync.existsSync(path)
}

/**
 * Read a directory.
 */
export function readDirSync(path: string, recursive = true): string[] {
  const ents = fsSync.readdirSync(path, {withFileTypes: true})
  const results = ents.map((ent) => {
    if (ent.isDirectory() && recursive) {
      return readDirSync(join(path, ent.name), recursive)
    } else {
      return join(path, ent.name)
    }
  })
  return [...(results || [])].flat()
}

/**
 * Remove a directory.
 */
export function removeDirSync(path: string): void {
  const exist = dirExistsSync(path)
  if (!exist) {
    console.warn(`Can't remove "${path}" because it doesn't exist. return`)
    return
  }
  fsSync.rmSync(path, {recursive: true, force: true})
}

/**
 * Create a directory.
 */
export function createDirSync(path: string): string | undefined {
  return fsSync.mkdirSync(path, {recursive: true})
}

/**
 * Copy a directory.
 */
export function copyDirSync(
    src: string,
    dest: string,
    {force}: { force?: boolean } = {}
): void {
    if (!force) {
      const exist = dirExistsSync(dest)
      if (exist) {
        console.error(
            `Can't copy folder "${dest}" because it already exist on destination. return`
        )
        return
      }
    }

    if (!fsSync.existsSync(src)) throw new Error()

    const files = readDirSync(src)
    files.forEach((file) => copyFileSync(file, file.replace(src, dest)))
}























