import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {
  public get(key: string): any {
    let item = window.localStorage.getItem(key);

    if (!item) {
      return undefined;
    }

    let result;

    try {
      result = JSON.parse(item);
    } catch(e) {
      result = item;
    }

    return result;
  }

  public set(key: string, value: any): void {
    let result = value;

    if (['[object Object]', '[object Array]'].indexOf(Object.prototype.toString.call(value)) > -1) {
      result = JSON.stringify(value);
    }

    window.localStorage.setItem(key, result);
  }
}