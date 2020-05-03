import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  private readonly storage: Storage;

  constructor() {
    this.storage = window.sessionStorage;
  }

  get length(): number {
    return this.storage.length;
  }

  public clear(): void {
    this.storage.clear();
  }

  public getItem<T>(key: string): T {
    return JSON.parse(this.storage.getItem(key));
  }

  public setItem<T>(key: string, value: T): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  public deleteItem<T extends {_id: string}>(array: string, id: string): void {
    this.storage.removeItem(`${array}/${id}`);
    const tmp: T[] = JSON.parse(this.storage.getItem(array));
    this.storage.setItem(array, JSON.stringify(tmp.filter((element: T) => element._id !== id)));
  }
}
