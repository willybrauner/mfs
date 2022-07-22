import * as Fs from "../src/micro-fs.js"
import { resolve } from "path"

;(async () => {

   console.log("-----------------------------------")

  const r = await Fs.dirExists("src/rm/bla")
  console.log('exist',r)

})()
