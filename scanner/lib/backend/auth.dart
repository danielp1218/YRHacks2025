import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:supabase_auth_ui/supabase_auth_ui.dart';

Future<void> initAuth() async {
  Supabase.initialize(
    url: dotenv.get('SUPABASE_URL'),
    anonKey: dotenv.get('SUPABASE_ANON_KEY'),
  );
}

class LoginError {
  String message;
  LoginError(this.message);
}

Future<LoginError?> login(String email, String password) async {
  try {
    final response = await Supabase.instance.client.auth.signInWithPassword(
      email: email,
      password: password,
    );
    if (response.session != null) {
      return null;
    } else {
      return LoginError("Invalid Credentials");
    }
  } on AuthException catch (error) {
    return LoginError(error.message);
  } catch (error) {
    return LoginError("Unexpected error occurred");
  }
}
