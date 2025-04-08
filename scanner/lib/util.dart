import 'package:flutter/foundation.dart';

const serverUrl = "http://10.0.0.153:3000/api/data";

void debugPrint(Object? object) {
  if (kDebugMode) {
    print(object);
  }
}