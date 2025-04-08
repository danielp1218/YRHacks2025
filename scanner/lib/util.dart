import 'package:flutter/foundation.dart';

const serverUrl = "http://10.0.0.153:3000/api/";
const postUrl = "${serverUrl}data/";
const studentDataUrl = "${serverUrl}students/";

void debugPrint(Object? object) {
  if (kDebugMode) {
    print(object);
  }
}