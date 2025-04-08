import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:scanner/util.dart';

Future<void> postData(String data) async {
  debugPrint(data);

  const url = "http://10.0.0.153:3000/api/data";
  
  if (data.length != 9) {
    return;
  }

  if (int.tryParse(data) == null) {
    return;
  }

  final body = jsonEncode({
    'id': data,
    'time': DateTime.now().millisecondsSinceEpoch
  });

  final response = await http.post(
    Uri.parse(url),
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