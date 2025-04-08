import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:scanner/util.dart';

Future<void> postData(String data) async {
  debugPrint(data);

  final body = jsonEncode({
    'id': data,
    'time': DateTime.now().millisecondsSinceEpoch
  });

  final response = await http.post(
    Uri.parse(serverUrl),
    headers: {
      'Content-Type': 'application/json',
    },
    body: body,
  );

  if (response.statusCode == 200) {
    debugPrint('Success: ${response.body}');
  } else {
    debugPrint('Failed: ${response.statusCode} - ${response.body}');
  }

}