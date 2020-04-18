import { Injectable } from "@angular/core";
import { KeyValue } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";

@Injectable()
export class RTCRoomsService {

  constructor (private http: HttpClient) { }

  public list() {
    return this.http.get<KeyValue<string, string>[]>(`${environment.serverHost}/rooms`);
  }
}
