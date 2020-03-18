import { Injectable } from '@angular/core';

import { marksList, students, subjectsList } from '../constants/';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  private readonly storage: Storage;

  constructor() {
    this.storage = window.sessionStorage;
    marksList.forEach((elem) => {
      this.setItem(elem.subject, JSON.stringify(elem));
    });
    this.setItem('subjectsList', JSON.stringify(subjectsList));
    this.setItem('students', JSON.stringify(students));
  }

  get length(): number {
    return this.storage.length;
  }

  public clear(): void {
    this.storage.clear();
  }

  public getItem(key: string): string | null {
    return this.storage.getItem(key);
  }

  public key(index: number): string | null {
    return this.storage.key(index);
  }

  public removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  public setItem(key: string, value: string): void {
    this.storage.setItem(key, value);
  }
}
