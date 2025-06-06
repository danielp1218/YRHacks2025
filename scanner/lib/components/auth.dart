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

  bool _obscurePassword = true;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (_error != null)
          Text(_error!.message, style: TextStyle(color: Colors.red)),
        TextField(
          controller: _emailController,
          decoration: InputDecoration(labelText: 'Email'),
          style: TextStyle(fontSize: 22),
        ),
        TextField(
          controller: _passwordController,
          obscureText: _obscurePassword,
          decoration: InputDecoration(
            labelText: 'Password',
            suffixIcon: IconButton(
              icon:
                  _obscurePassword
                      ? const Icon(Icons.visibility_off)
                      : const Icon(Icons.visibility),
              onPressed:
                  () => setState(() => _obscurePassword = !_obscurePassword),
            ),
          ),
          style: TextStyle(fontSize: 22),
        ),
        SizedBox(height: 24),
        SizedBox(
          width: 108,
          height: 48,
          child: ElevatedButton(
            onPressed: _loading ? null : _login,
            child:
                _loading
                    ? CircularProgressIndicator(color: Colors.blueGrey)
                    : Text('Login', style: TextStyle(fontSize: 24)),
          ),
        ),
      ],
    );
  }
}
