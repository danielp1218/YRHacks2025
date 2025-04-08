import 'package:flutter/material.dart';
import 'package:scanner/student_data.dart';

class StudentInfo extends StatelessWidget {
  final StudentData studentData;

  const StudentInfo({super.key, required this.studentData});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Image.memory(studentData.imageBytes),
        Text("${studentData.firstName} ${studentData.lastName}"),
      ],
    );
  }
}
