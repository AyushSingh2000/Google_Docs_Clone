import 'package:google_docs_clone/constants.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

class SocketClient {
  io.Socket? socket;
  static SocketClient? _instance;

  SocketClient._internal() {
    socket = io.io(
        host,
        io.OptionBuilder()
            .setTransports(['websocket']) // for Flutter or Dart VM
            .disableAutoConnect() // disable auto-connection
            .build());
    socket?.connect();
  }
  static SocketClient get instance {
    _instance ??= SocketClient._internal();
    return _instance!;
  }
}
