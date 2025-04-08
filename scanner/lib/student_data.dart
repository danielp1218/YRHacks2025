import 'dart:typed_data';

class StudentData {

  final String firstName;
  final String lastName;
  final int grade;
  final Uint8List imageBytes;
  final String status;
  final List<dynamic> classes;

  StudentData(this.grade, this.imageBytes, this.classes, this.firstName, this.lastName, this.status);

  String get name => "$firstName $lastName";

}
