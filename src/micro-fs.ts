import * as fs from "fs/promises"
import { dirname, join } from "path"

/**
 * Check if a file exists.
 */
export async function fileExists(path: string): Promise<Promise<boolean> | undefined> {
  try {
    return (await fs.stat(path)).isFile()
  } catch (e) {
    console.error("fileExists error", e)
  }
}

/**
 * Write a file.
 */
export async function writeFile(path: string, content: string): Promise<void> {
  try {
    fs.mkdir(dirname(path), { recursive: true })
    fs.writeFile(path, content)
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
  if (exist) fs.unlink(path)
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
): Promise<boolean> {
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
    await writeFile(dest, content)
  } else {
    await fs.mkdir(dirname(dest), { recursive: true })
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
    console.error("dirExists error", e)
  }
}

/**
 * Read a directory.
 */
export async function readDir(path: string, recursive = true): Promise<string[]> {
  const ents = await fs.readdir(path, { withFileTypes: true })
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
  return await fs.rm(path, { recursive: true })
}

/**
 * Create a directory.
 */
export async function createDir(path: string): Promise<string | undefined> {
  return await fs.mkdir(path, { recursive: true })
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
  { force }: { force?: boolean } = {}
): Promise<void> {
  if (!force) {
    const exist = await dirExists(dest)
    if (exist) {
      console.warn(
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
