import 'package:flutter/material.dart';
import 'package:scanner/components/rounded_image.dart';
import 'package:scanner/student_data.dart';

class StudentInfo extends StatelessWidget {
  final StudentData studentData;

  const StudentInfo({super.key, required this.studentData});

  @override
  Widget build(BuildContext context) {
    return Column(
      spacing: 10,
      children: [
        RoundedImage(imageBytes: studentData.imageBytes, radius: 40),
        SizedBox(height: 10),
        Text(studentData.name, style: TextStyle(fontSize: 24)),
        Text("Grade ${studentData.grade.toString()}", style: TextStyle(fontSize: 24)),
      ],
    );
  }
}
