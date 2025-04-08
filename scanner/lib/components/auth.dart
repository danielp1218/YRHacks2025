import 'package:flutter/material.dart';
import 'package:scanner/backend/auth.dart';

class AuthWidget extends StatefulWidget {
  const AuthWidget({super.key});

  @override
  AuthWidgetState createState() => AuthWidgetState();
}

class AuthWidgetState extends State<AuthWidget> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _loading = false;
  LoginError? _error;

  Future<void> _login() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    final email = _emailController.text.trim();
    final password = _passwordController.text;
    final error = await login(email, password);
    if (error == null) {
      Navigator.pushReplacementNamed(context, '/scanner');
    }
    setState(() => _error = error);
    setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (_error != null)
          Text(_error!.message, style: TextStyle(color: Colors.red)),
        TextField(
          controller: _emailController,
          decoration: InputDecoration(labelText: 'Email'),
        ),
        TextField(
          controller: _passwordController,
          decoration: InputDecoration(labelText: 'Password'),
        ),
        SizedBox(height: 20),
        ElevatedButton(
          onPressed: _loading ? null : _login,
          child:
              _loading
                  ? CircularProgressIndicator(color: Colors.blueGrey)
                  : Text('Login'),
        ),
      ],
    );
  }
}
