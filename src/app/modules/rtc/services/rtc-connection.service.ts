import { Injectable } from "@angular/core";

@Injectable()
export class RTCConnectionService {
  private readonly internetServers: RTCConfiguration = {
    iceServers: [
      // https://gist.github.com/mondain/b0ec1cf5f60ae726202e
      {
        urls: [
          "stun:stun.l.google.com:19302"
        ]
      },
      // https://gist.github.com/sagivo/3a4b2f2c7ac6e1b5267c2f1f59ac6c6b
      // {
      //   urls: ["turn:192.158.29.39:3478?transport=udp", "turn:192.158.29.39:3478?transport=tcp"],
      //   credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
      //   username: "28224511:1379330808"
      // },
      {
        urls: "turn:numb.viagenie.ca",
        credential: "muazkh",
        username: "webrtc@live.com"
      },
      {
        urls: ["turn:turn.anyfirewall.com:443?transport=tcp"],
        credential: "webrtc",
        username: "webrtc"
      }
    ]
  }

  public create() {
    return new RTCPeerConnection(this.internetServers);
  }
}
