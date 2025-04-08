import 'dart:typed_data';

import 'package:flutter/material.dart';

class RoundedImage extends StatelessWidget {

  final Uint8List imageBytes;
  final double radius;
  const RoundedImage({super.key, required this.imageBytes, required this.radius});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(radius),
      child: Image.memory(
        imageBytes,
        fit: BoxFit.cover,
      )
    );
  }

}