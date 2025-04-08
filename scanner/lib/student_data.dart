import 'dart:typed_data';

class StudentData {

  final String name;
  final int grade;
  final Uint8List imageBytes;
  final List<dynamic> classes;

  StudentData(this.name, this.grade, this.imageBytes, this.classes);

}
