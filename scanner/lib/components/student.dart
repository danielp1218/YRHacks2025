import 'package:flutter/material.dart';
import 'package:scanner/components/rounded_image.dart';
import 'package:scanner/student_data.dart';

class StudentInfo extends StatelessWidget {
  final StudentData studentData;

  const StudentInfo({super.key, required this.studentData});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        RoundedImage(imageBytes: studentData.imageBytes, radius: 16),
        SizedBox(height: 18),
        Text(studentData.name, style: TextStyle(fontSize: 24)),
      ],
    );
  }
}
