import 'package:flutter/material.dart';
import 'package:nfc_manager/nfc_manager.dart';
import 'package:scanner/post_data.dart';

void main() {
  runApp(const App());
}

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NFC Scanner',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blueGrey, brightness: Brightness.dark),
      ),
      home: const NFCScanner(),
    );
  }
}

class NFCScanner extends StatefulWidget {
  const NFCScanner({super.key});

  @override
  NFCScannerState createState() => NFCScannerState();
}

class NFCScannerState extends State<NFCScanner> {
  String data = "Press button then scan tag";

  Future<void> startNFC() async {
    bool isAvailable = await NfcManager.instance.isAvailable();
    if (!isAvailable) {
      setState(() {
        data = "NFC is not available on this device";
      });
      return;
    }
    setState(() {
      data = "Scan tag";
    });
    NfcManager.instance.startSession(
      onDiscovered: (NfcTag tag) async {
        Ndef? ndef = Ndef.from(tag);
        if (ndef == null) {
          setState(() {
            data = "Tag is not compatible with NDEF";
          });
        } else {
          var message = await ndef.read();
          setState(() {
            if (message.records.length != 1) {
              data = "Tag does not have exactly 1 record!";
            } else {
              data = String.fromCharCodes(
                message.records.first.payload.skip(
                  message.records.first.payload.first + 1,
                ),
              ); // skip first n bytes (where n is defined by the first byte in the message) which defines the language such as "en"
              postData(data);
            }
          });
        }
        NfcManager.instance.stopSession();
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("NFC Scanner")),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(data, style: TextStyle(fontSize: 26)),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: startNFC,
              child: Text("Scan", style: TextStyle(fontSize: 28)),
            ),
          ],
        ),
      ),
    );
  }
}
