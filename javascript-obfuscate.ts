import { obfuscate, ObfuscatorOptions } from "javascript-obfuscator";
import * as fg from "fast-glob";
import * as fs from "fs";
import * as path from "path";


interface ObfuscateTarget {
  dirPath: string
  filter: string
  obfuscateConfig: ObfuscatorOptions
}


const main: ObfuscateTarget = {
  dirPath: path.join('out', 'main'),
  filter: '**/*.js',
  obfuscateConfig: {
    optionsPreset: 'default'
  }
}

const preload: ObfuscateTarget = {
  dirPath: path.join('out', 'preload'),
  filter: '**/*.js',
  obfuscateConfig: {
    optionsPreset: 'default'
  }
}

const renderer: ObfuscateTarget = {
  dirPath: path.join('out', 'renderer'),
  filter: '**/*.js',
  obfuscateConfig: {
    optionsPreset: 'default'
  }
}


async function obfuscateTarget(target: ObfuscateTarget) {
  const filePaths = await fg(target.filter, {
    cwd: target.dirPath,
    absolute: true,
  })

  for (const filePath of filePaths) {
    const relativePath = path.relative(process.cwd(), filePath)

    try {
      console.log(`🔧 Obfuscating: ${relativePath}`)
      const code = await fs.promises.readFile(filePath, 'utf-8')
      const result = obfuscate(code, target.obfuscateConfig)
      await fs.promises.writeFile(filePath, result.getObfuscatedCode(), 'utf-8')
      console.log(`✅ Obfuscated: ${relativePath}`)
    } catch (err) {
      console.error(`❌ Failed to obfuscate: ${relativePath}`, err)
    }
  }
}


obfuscateTarget(main)
obfuscateTarget(preload)
obfuscateTarget(renderer)
