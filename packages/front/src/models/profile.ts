import { v4 as uuidv4 } from 'uuid';

export class Profile {
  private _id: string;
  private _status: string;
  private _details: string;

  constructor(status: string, details: string) {
    this._id = uuidv4();
    this._status = status;
    this._details = details;
  }

  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
  }

  public get status(): string {
    return this._status;
  }
  public set status(value: string) {
    this._status = value;
  }

  public get details(): string {
    return this._details;
  }
  public set details(value: string) {
    this._details = value;
  }

  public getStringData() {
    return `${this._id}|${this._status}|${this._details}`
  }
}
