import 'dart:convert';
import 'dart:typed_data';

import 'package:http/http.dart' as http;
import 'package:scanner/student_data.dart';
import 'package:scanner/util.dart';

  Uint8List base64ToImage(String dataUrl) {
    final base64String = dataUrl.split(',').last;
    return base64Decode(base64String);
  }

Future<StudentData?> fetchData() async {

  final response = await http.get(Uri.parse(serverUrl));
  if (response.statusCode == 200) {
    final json = jsonDecode(response.body);
    return StudentData(json['firstName'], json['lastName'], base64ToImage(json['image']));
  } else {
    debugPrint("Error fetching student data");
    return null;
  }
}