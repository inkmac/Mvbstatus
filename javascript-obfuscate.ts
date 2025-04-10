import { obfuscate, ObfuscatorOptions } from "javascript-obfuscator";
import * as fs from "fs";
import * as path from "path";


interface ObfuscateTarget {
  dirPath: string
  obfuscateConfig: ObfuscatorOptions
}


const main: ObfuscateTarget = {
  dirPath: path.join('out', 'main'),
  obfuscateConfig: {
    optionsPreset: 'default'
  }
}

const preload: ObfuscateTarget = {
  dirPath: path.join('out', 'preload'),
  obfuscateConfig: {
    optionsPreset: 'default'
  }
}

const renderer: ObfuscateTarget = {
  dirPath: path.join('out', 'renderer', 'assets'),
  obfuscateConfig: {
    optionsPreset: 'default'
  }
}


async function obfuscateTarget(target: ObfuscateTarget) {
  const entries = await fs.promises.readdir(target.dirPath, { withFileTypes: true })

  const jsFiles = entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.js'))
    .map(entry => path.join(target.dirPath, entry.name))

  for (const filePath of jsFiles) {
    try {
      console.log(`🔧 Obfuscating: ${filePath}`)
      const code = await fs.promises.readFile(filePath, 'utf-8')
      const result = obfuscate(code, target.obfuscateConfig)
      await fs.promises.writeFile(filePath, result.getObfuscatedCode(), 'utf-8')
      console.log(`✅ Obfuscated: ${filePath}`)
    } catch (err) {
      console.error(`❌ Failed to obfuscate: ${filePath}`, err)
    }
  }
}


obfuscateTarget(main)
obfuscateTarget(preload)
obfuscateTarget(renderer)
