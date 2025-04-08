import 'package:flutter/material.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';
import 'package:scanner/backend/nfc.dart';
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
  String serverUrl = "http://10.0.0.153:3000/api/";

  Future<void> startNFC() async {
    setState(() => studentData = null);

    if (!await isNfcAvailable()) {
      setState(() {
        data = "NFC is not available on this device";
      });
      return;
    }

    setState(() => data = "Scan tag");

    setState(() => data = scanNfc());

    if (isDataValidId(data)) {
      postData(data, serverUrl);
      setState(() => studentData = null);
      final fetchedData = await fetchData(data, serverUrl);
      setState(() => studentData = fetchedData);
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
                    initialValue: "http://10.240.162.31:3000/api/",
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
