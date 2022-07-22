import { it, describe, expect } from "vitest"
import * as FS from "../src/micro-fs"
import {resolve} from "path"

it("should be able to create a file", async (assert) => {
  const path = resolve("tests/test.txt")
  const content = "Hello World"
  await FS.writeFile(path, content)
  const fileContent = await FS.readFile(path)
  expect(fileContent).toEqual(content)
})
