import 'package:flutter/material.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';
import 'package:nfc_manager/nfc_manager.dart';
import 'package:scanner/backend/fetch_data.dart';
import 'package:scanner/backend/post_data.dart';
import 'package:scanner/components/student.dart';
import 'package:scanner/backend/student_data.dart';
import 'package:scanner/backend/validate_data.dart';

class ScannerScreen extends StatefulWidget {
  const ScannerScreen({super.key});

  @override
  ScannerScreenState createState() => ScannerScreenState();
}

class ScannerScreenState extends State<ScannerScreen> {
  String data = "Press button then scan tag";
  StudentData? studentData;
  static final String initialServerUrl = "http://10.240.162.31:3000/api/";
  String serverUrl = initialServerUrl;

  Future<void> startNFC() async {
    setState(() => studentData = null);

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
                postData(data, serverUrl);
                setState(() => studentData = null);
                final fetchedData = await fetchData(data, serverUrl);
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
          children: [
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              spacing: 18,
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(
                    vertical: 20,
                    horizontal: 40,
                  ),
                  child: TextFormField(
                    style: TextStyle(fontSize: 20),
                    initialValue: initialServerUrl,
                    onChanged: (value) {
                      setState(() => serverUrl = value);
                      debugPrint(serverUrl);
                    },
                  ),
                ),
                SizedBox(height: 10),
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
          ],
        ),
      ),
    );
  }
}
