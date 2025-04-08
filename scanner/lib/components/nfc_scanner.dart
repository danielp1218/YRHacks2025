import 'package:flutter/material.dart';
import 'package:nfc_manager/nfc_manager.dart';
import 'package:scanner/fetch_data.dart';
import 'package:scanner/post_data.dart';
import 'package:scanner/components/student.dart';
import 'package:scanner/student_data.dart';
import 'package:scanner/validate_data.dart';

class NFCScanner extends StatefulWidget {
  const NFCScanner({super.key});

  @override
  NFCScannerState createState() => NFCScannerState();
}

class NFCScannerState extends State<NFCScanner> {

  String data = "Press button then scan tag";
  StudentData? studentData;

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

        final Ndef? ndef = Ndef.from(tag);
        if (ndef == null) {
          setState(() {
            data = "Tag is not compatible with NDEF";
          });
        } else {
          final NdefMessage message = await ndef.read();
          if (message.records.length != 1) {
            setState(() {
              data = "Tag does not have exactly 1 record!";
            });
          } else {

            setState(() {
              data = String.fromCharCodes(
                message.records.first.payload.skip(
                  message.records.first.payload.first + 1,
                ),
              ); // skip first n bytes (where n is defined by the first byte in the message) which defines the language such as "en"
            });
            if (isDataValidId(data)) {
              postData(data);
              final fetchedData = await fetchData(data);
              setState(() => studentData = fetchedData);
            } else {
              setState(() => studentData = null);
            }
          }
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
            studentData != null ? StudentInfo(studentData: studentData!,) : Placeholder(),
            Text(data, style: TextStyle(fontSize: 26)),
            SizedBox(height: 24),
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
