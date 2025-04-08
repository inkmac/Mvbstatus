import { app } from "electron";
import fs from "fs";
import path from 'path';
import CryptoJS from "crypto-js";

export default class Store<T extends Record<string, any>> {
  private readonly path: string
  private readonly name: string
  private readonly fileExtension: string
  private readonly encryptor: Encryptor | EmptyEncryptor
  private readonly filePath: string

  constructor(options: StoreOptions = {}) {
    this.path = options.path ?? app.getPath('userData')
    this.name = options.name ?? 'Software'
    this.fileExtension = options.fileExtension ? `.${options.fileExtension}` : ''

    this.encryptor = options.encryptionKey ?
      new Encryptor(options.encryptionKey) : new EmptyEncryptor()


    this.filePath = path.join(this.path, `${this.name}${this.fileExtension}`)
    this.ensureFileExists()
  }

  public set<K extends keyof T>(key: K, value: T[K]): void {
    const data = this.readData();
    data[key] = value;
    this.writeData(data);
  }

  public get<K extends keyof T>(key: K): T[K] {
    const data = this.readData();
    return data[key];
  }

  private readData(): T {
    const fileData = fs.readFileSync(this.filePath, 'utf-8')
    const decryptData = this.encryptor.decrypt(fileData)
    return JSON.parse(decryptData)
  }

  private writeData(data: T): void {
    const stringify = JSON.stringify(data, null, 2)
    const encryptData = this.encryptor.encrypt(stringify)
    fs.writeFileSync(this.filePath, encryptData, 'utf-8')
  }

  private ensureFileExists(): void {
    const dir = path.dirname(this.filePath)

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(this.filePath)) {
      const stringifyInitData = JSON.stringify({})
      const encryptInitData = this.encryptor.encrypt(stringifyInitData)
      fs.writeFileSync(this.filePath, encryptInitData, 'utf-8')
    }
  }
}

class Encryptor {
  private readonly encryptionKey: string;
  private readonly validPrefix: string = '@@VALID@@';

  public constructor(encryptionKey: string) {
    this.encryptionKey = encryptionKey
  }

  public encrypt(data: string): string {
    const markedData = `${this.validPrefix}${data}`;
    return CryptoJS.AES.encrypt(markedData, this.encryptionKey).toString();
  }

  public decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedData.startsWith(this.validPrefix)) {
      throw new Error('Decryption failed: data is corrupted or invalid');
    }

    return decryptedData.slice(this.validPrefix.length);
  }
}

class EmptyEncryptor {
  public encrypt(data: string): string {
    return data
  }

  public decrypt(encryptedData: string): string {
    return encryptedData
  }
}

interface StoreOptions {
  path?: string,
  name?: string,
  fileExtension?: string,
  encryptionKey?: string
}
