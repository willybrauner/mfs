import {it, expect, beforeEach, afterAll} from "vitest"
import * as mfs from "../src"
import { resolve } from "path"

// reset tmp directory before each test
beforeEach(() => {
  mfs.removeDirSync(resolve(__dirname, "./tmp-sync"))
  mfs.createFileSync(resolve(__dirname, "./tmp-sync/.gitkeep"))
})

it("shound return true if file exists", () => {
  const exist = mfs.fileExistsSync(resolve(__dirname, "./tmp-sync/.gitkeep"))
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(true)
})

it("should return false if file doesn't exists",() => {
  const exist = mfs.fileExistsSync(resolve(__dirname, "./tmp-sync/.git"))
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(false)
})

it("should be able to create a file, write inside and read it", () => {
  const path = resolve(__dirname, "./tmp-sync/test.json")
  const content = `{"foo": "bar"}`
   mfs.createFileSync(path, content)
  const fileContent = mfs.readFileSync(path)
  expect(fileContent).toEqual(content)
})

it("should be able to remove a file", () => {
  const path = resolve(__dirname, "./tmp-sync/test.json")
  mfs.removeFileSync(path)
  mfs.removeFileSync(path)
  const exist = mfs.fileExistsSync(path)
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(false)
})

it("should be able to copy a file", () => {
  const src = resolve(__dirname, "./tmp-sync/test.json")
  const dest = resolve(__dirname, "./tmp-sync/test-copy.json")
  const content = `{"foo": "bar"}`
  mfs.createFileSync(src, content)
  mfs.copyFileSync(src, dest)
  const exist = mfs.fileExistsSync(dest)
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(true)
  const copyContent = mfs.readFileSync(dest)
  expect(copyContent).toEqual(content)
})

it("should be able to transform a file content before copy it", () => {
  const src = resolve(__dirname, "./tmp-sync/test.json")
  const dest = resolve(__dirname, "./tmp-sync/test-copy.json")
  const content = `{"foo": "bar"}`
  mfs.createFileSync(src, content)
  mfs.copyFileSync(src, dest, {
    transform: (fileContent) => fileContent.replace("foo", "zoo").replace("bar", "bida")
  })
  const copyContent = mfs.readFileSync(dest)
  expect(copyContent).toEqual(`{"zoo": "bida"}`)
})

it("should return true if dir exist", () => {
  const exist = mfs.dirExistsSync(resolve(__dirname, "./tmp-sync"))
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(true)
})

it("should return false if dir doesn't exist", () => {
  const exist = mfs.dirExistsSync(resolve(__dirname, "./tmp-sync/test"))
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(false)
})

it("should be able to read a dir", () => {
  const path = resolve(__dirname, "./tmp-sync")
  mfs.createFileSync(path + "/test.json")
  const files = mfs.readDirSync(path)
  expect(files).toBeTypeOf("object")
  expect(files).toHaveLength(2) // .gitkeep and test.json
  expect(files[1]).toContain("test.json")
})

it("should be able to create a dir", () => {
  const path = resolve(__dirname, "./tmp-sync/test")
  mfs.createDirSync(path)
  const exist = mfs.dirExistsSync(path)
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(true)
})

it("should be able to remove a dir", () => {
  const path = resolve(__dirname, "./tmp-sync/test")
  mfs.createDirSync(path)
  mfs.removeDirSync(path)
  const exist = mfs.dirExistsSync(path)
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(false)
})

it("should be able to copy a dir", () => {
  const src = resolve(__dirname, "./tmp-sync/test")
  mfs.createFileSync(src + "/test.json")
  const dest = resolve(__dirname, "./tmp-sync/test-copy")
  mfs.createDirSync(src)
  mfs.copyDirSync(src, dest)

  const exist = mfs.dirExistsSync(dest)
  expect(exist).toBeTypeOf("boolean")
  expect(exist).toBe(true)

  const files = mfs.readDirSync(dest)
  expect(files).toBeTypeOf("object")
  expect(files).toHaveLength(1)
  expect(files[0]).toContain("test.json")
})
