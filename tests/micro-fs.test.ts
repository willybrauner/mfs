import { it, describe, expect, beforeEach, beforeAll } from "vitest"
import * as FS from "../src/micro-fs"
import { resolve } from "path"

// reset tmp directory before each test
beforeEach(async () => {
  await FS.removeDir(resolve(__dirname, "./tmp"))
  await FS.createFile(resolve(__dirname, "./tmp/.gitkeep"))
})

it("shound return true if file exists", async () => {
  const exist = await FS.fileExists(resolve(__dirname, "./tmp/.gitkeep"))
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(true)
})

it("shound return false if file doesn't exists", async () => {
  const exist = await FS.fileExists(resolve(__dirname, "./tmp/.git"))
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(false)
})

it("should be able to create a file, write inside and read it", async () => {
  const path = resolve(__dirname, "./tmp/test.json")
  const content = `{"foo": "bar"}`
  await FS.createFile(path, content)
  const fileContent = await FS.readFile(path)
  expect(fileContent).toEqual(content)
})

it("should be able to remove a file", async () => {
  const path = resolve(__dirname, "./tmp/test.json")
  await FS.createFile(path)
  await FS.removeFile(path)
  const exist = await FS.fileExists(path)
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(false)
})

it("should be able to copy a file", async () => {
  const src = resolve(__dirname, "./tmp/test.json")
  const dest = resolve(__dirname, "./tmp/test-copy.json")
  const content = `{"foo": "bar"}`
  await FS.createFile(src, content)
  await FS.copyFile(src, dest)
  const exist = await FS.fileExists(dest)
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(true)
  const copyContent = await FS.readFile(dest)
  expect(copyContent).toEqual(content)
})

it("should be able to transform a file content before copy it", async () => {
  const src = resolve(__dirname, "./tmp/test.json")
  const dest = resolve(__dirname, "./tmp/test-copy.json")
  const content = `{"foo": "bar"}`
  await FS.createFile(src, content)
  await FS.copyFile(src, dest, {
    transform: (fileContent) =>
      new Promise((resolve) => {
        resolve(fileContent.replace("foo", "zoo").replace("bar", "bida"))
      }),
  })
  const copyContent = await FS.readFile(dest)
  expect(copyContent).toEqual(`{"zoo": "bida"}`)
})

it("should return true if dir exist", async () => {
  const exist = await FS.dirExists(resolve(__dirname, "./tmp"))
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(true)
})

it("should return false if dir doesn't exist", async () => {
  const exist = await FS.dirExists(resolve(__dirname, "./tmp/test"))
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(false)
})

it("should be able to read a dir", async () => {
  const path = resolve(__dirname, "./tmp")
  await FS.createFile(path + "/test.json")
  const files = await FS.readDir(path)
  expect(files).toBeTypeOf("object")
  expect(files).toHaveLength(2) // .gitkeep and test.json
  expect(files[1]).toContain("test.json")
})

it("should be able to create a dir", async () => {
  const path = resolve(__dirname, "./tmp/test")
  await FS.createDir(path)
  const exist = await FS.dirExists(path)
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(true)
})

it("should be able to remove a dir", async () => {
  const path = resolve(__dirname, "./tmp/test")
  await FS.createDir(path)
  await FS.removeDir(path)
  const exist = await FS.dirExists(path)
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(false)
})

it("should be able to copy a dir", async () => {
  const src = resolve(__dirname, "./tmp/test")
  await FS.createFile(src + "/test.json")
  const dest = resolve(__dirname, "./tmp/test-copy")
  await FS.createDir(src)
  await FS.copyDir(src, dest)

  const exist = await FS.dirExists(dest)
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(true)

  const files = await FS.readDir(dest)
  expect(files).toBeTypeOf("object")
  expect(files).toHaveLength(1)
  expect(files[0]).toContain("test.json")
})
