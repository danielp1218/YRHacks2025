import 'package:flutter/material.dart';
import 'package:scanner/components/auth.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<StatefulWidget> createState() {
    return _LoginScreenState();
  }

}

class _LoginScreenState extends State<LoginScreen> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Login')),
      body: Center(
        child: Column(
          children: [
            SizedBox(height: 180),
            Padding(
              padding: const EdgeInsets.all(40.0),
              child: AuthWidget(),
            ),
          ],
        )
      ),
    );
  }

}