import 'dart:convert';
import 'dart:typed_data';

import 'package:http/http.dart' as http;
import 'package:scanner/student_data.dart';
import 'package:scanner/util.dart';

Uint8List base64ToImage(String dataUrl) {
  final base64String = dataUrl.split(',').last;
  return base64Decode(base64String);
}

Future<StudentData?> fetchData(String id, String serverUrl) async {
  final response = await http.get(Uri.parse("${serverUrl}students/$id"));
  if (response.statusCode == 200) {
    debugPrint(response.body);
    final json = jsonDecode(response.body);
    return StudentData(
      json['grade'],
      base64ToImage(json['profile_photo']),
      json['classes'],
      json['first_name'],
      json['last_name'],
      json['status'],
    );
  } else {
    debugPrint("Error fetching student data ${response.statusCode} - ${response.body}");
    return null;
  }
}
