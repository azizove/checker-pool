import { v4 as uuidv4 } from 'uuid';
import { getIdFromAddress } from '../helpers';
const SEPARATOR = '|';

export class Profile {
  private _id: number;
  private _status: string;
  private _details: string;

  constructor(status: string, details: string) {
    this._id = getIdFromAddress(uuidv4());
    this._status = status;
    this._details = details;
  }

  
  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
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
    return `${this._id}${SEPARATOR}${this._status}${SEPARATOR}${this._details}`
  }

  static getProfileFromString(profileString: string): Profile {
    const profileElementsArray = profileString.split(SEPARATOR);
    const profile = new Profile(profileElementsArray[1], profileElementsArray[2]);
    profile.id = parseInt(profileElementsArray[0]);
    return profile;
  }
}
