import archiver from 'archiver'
import * as fs from 'fs-extra'

export function createDirectoryIfNotExists(directoryPath: string) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true })
  }
}

export function deleteDirectory(directory: string) {
  if (fs.existsSync(directory)) {
    fs.rmdirSync(directory, { recursive: true })
  }
}

export async function copyDirectoryToNewLocation(srcDir: string, targetDir: string) {
  try {
    await fs.emptyDir(targetDir)
    await fs.copy(srcDir, targetDir)
  } catch (err) {
    console.error('Error copying directory:', err)
  }
}

export async function updateOrAddJsonProperty(jsonFile: string, propertyName: string, newValue: any) {
  const data: string = fs.readFileSync(jsonFile, 'utf8')
  const jsonContent: Record<string, any> = JSON.parse(data)

  jsonContent[propertyName] = newValue
  const updatedJson: string = JSON.stringify(jsonContent, null, 2)

  fs.writeFileSync(jsonFile, updatedJson, 'utf8')
}

export async function zipDirectory(source: string, out: string): Promise<void> {
  const archive = archiver('zip', { zlib: { level: 9 } })
  const stream = fs.createWriteStream(out)

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', (err) => reject(err))
      .pipe(stream)

    stream.on('close', () => resolve())
    archive.finalize()
  })
}
