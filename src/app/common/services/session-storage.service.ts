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

  public setItem(key: string, value: any): any {
    this.storage.setItem(key, JSON.stringify(value));
  }

  public deleteItem(array: string, id: string): any {
    this.storage.removeItem(`${array}/${id}`);
    const tmp: any[] = JSON.parse(this.storage.getItem(array));
    this.storage.setItem(array, JSON.stringify(tmp.filter(element => element._id !== id)));
  }
}
