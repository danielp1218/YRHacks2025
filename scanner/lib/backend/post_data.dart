import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:scanner/util.dart';

Future<void> postData(String data, String serverUrl) async {
  debugPrint(data);

  final body = jsonEncode({
    'id': data,
    'time': DateTime.now().millisecondsSinceEpoch
  });

  final response = await http.post(
    Uri.parse("${serverUrl}data"),
    headers: {
      'Content-Type': 'application/json',
    },
    body: body,
  );

  if (response.statusCode == 200) {
    debugPrint('Post Success: ${response.body}');
  } else {
    debugPrint('Post Failed: ${response.statusCode} - ${response.body}');
  }

}