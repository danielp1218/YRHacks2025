import 'package:flutter/material.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';
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

    try {
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
                setState(() => studentData = null);
                final fetchedData = await fetchData(data);
                setState(() => studentData = fetchedData);
              }
            }
          }
          NfcManager.instance.stopSession();
        },
      );
    } catch (error) {
      debugPrint("Failed to scan tag $error");
      setState(() => data = "Failed to scan tag");
      setState(() => studentData = null);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("NFC Scanner")),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          spacing: 18,
          children: [
            studentData != null
                ? StudentInfo(studentData: studentData!)
                : Column(
                  children: [
                    LoadingAnimationWidget.inkDrop(
                      color: Colors.blueGrey,
                      size: 120,
                    ),
                    SizedBox(height: 20),
                  ],
                ),
            Text(data, style: TextStyle(fontSize: 26)),
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
