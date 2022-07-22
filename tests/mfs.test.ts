import { it, expect, beforeEach } from "vitest"
import * as mfs from "../src/mfs"
import { resolve } from "path"

// reset tmp directory before each test
beforeEach(async () => {
  await mfs.removeDir(resolve(__dirname, "./tmp"))
  await mfs.createFile(resolve(__dirname, "./tmp/.gitkeep"))
})

it("shound return true if file exists", async () => {
  const exist = await mfs.fileExists(resolve(__dirname, "./tmp/.gitkeep"))
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(true)
})

it("shound return false if file doesn't exists", async () => {
  const exist = await mfs.fileExists(resolve(__dirname, "./tmp/.git"))
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(false)
})

it("should be able to create a file, write inside and read it", async () => {
  const path = resolve(__dirname, "./tmp/test.json")
  const content = `{"foo": "bar"}`
  await mfs.createFile(path, content)
  const fileContent = await mfs.readFile(path)
  expect(fileContent).toEqual(content)
})

it("should be able to remove a file", async () => {
  const path = resolve(__dirname, "./tmp/test.json")
  await mfs.createFile(path)
  await mfs.removeFile(path)
  const exist = await mfs.fileExists(path)
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(false)
})

it("should be able to copy a file", async () => {
  const src = resolve(__dirname, "./tmp/test.json")
  const dest = resolve(__dirname, "./tmp/test-copy.json")
  const content = `{"foo": "bar"}`
  await mfs.createFile(src, content)
  await mfs.copyFile(src, dest)
  const exist = await mfs.fileExists(dest)
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(true)
  const copyContent = await mfs.readFile(dest)
  expect(copyContent).toEqual(content)
})

it("should be able to transform a file content before copy it", async () => {
  const src = resolve(__dirname, "./tmp/test.json")
  const dest = resolve(__dirname, "./tmp/test-copy.json")
  const content = `{"foo": "bar"}`
  await mfs.createFile(src, content)
  await mfs.copyFile(src, dest, {
    transform: (fileContent) =>
      new Promise((resolve) => {
        resolve(fileContent.replace("foo", "zoo").replace("bar", "bida"))
      }),
  })
  const copyContent = await mfs.readFile(dest)
  expect(copyContent).toEqual(`{"zoo": "bida"}`)
})

it("should return true if dir exist", async () => {
  const exist = await mfs.dirExists(resolve(__dirname, "./tmp"))
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(true)
})

it("should return false if dir doesn't exist", async () => {
  const exist = await mfs.dirExists(resolve(__dirname, "./tmp/test"))
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(false)
})

it("should be able to read a dir", async () => {
  const path = resolve(__dirname, "./tmp")
  await mfs.createFile(path + "/test.json")
  const files = await mfs.readDir(path)
  expect(files).toBeTypeOf("object")
  expect(files).toHaveLength(2) // .gitkeep and test.json
  expect(files[1]).toContain("test.json")
})

it("should be able to create a dir", async () => {
  const path = resolve(__dirname, "./tmp/test")
  await mfs.createDir(path)
  const exist = await mfs.dirExists(path)
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(true)
})

it("should be able to remove a dir", async () => {
  const path = resolve(__dirname, "./tmp/test")
  await mfs.createDir(path)
  await mfs.removeDir(path)
  const exist = await mfs.dirExists(path)
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(false)
})

it("should be able to copy a dir", async () => {
  const src = resolve(__dirname, "./tmp/test")
  await mfs.createFile(src + "/test.json")
  const dest = resolve(__dirname, "./tmp/test-copy")
  await mfs.createDir(src)
  await mfs.copyDir(src, dest)

  const exist = await mfs.dirExists(dest)
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(true)

  const files = await mfs.readDir(dest)
  expect(files).toBeTypeOf("object")
  expect(files).toHaveLength(1)
  expect(files[0]).toContain("test.json")
})
