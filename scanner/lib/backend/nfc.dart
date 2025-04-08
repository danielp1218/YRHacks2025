import 'package:nfc_manager/nfc_manager.dart';
import 'package:scanner/util.dart';

Future<bool> isNfcAvailable() async {
  return await NfcManager.instance.isAvailable();
}

String scanNfc() {
  String data = "";
  try {
    NfcManager.instance.startSession(
      onDiscovered: (NfcTag tag) async {
        final Ndef? ndef = Ndef.from(tag);
        if (ndef == null) {
          data = "Tag not compatbile with NDEF";
          return;
        }
        final NdefMessage message = await ndef.read();
        if (message.records.length != 1) {
          data = "Tag does not have exactly 1 record";
          return;
        }
        data = String.fromCharCodes(message.records.first.payload.skip(message.records.first.payload.first + 1));
        return;
      }
    );
  NfcManager.instance.stopSession();
  return data;
  } catch (error) {
    debugPrint("Failed to scan tag - $error");
    return "Failed to scan tag";
  }
}