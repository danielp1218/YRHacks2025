
import 'package:supabase_flutter/supabase_flutter.dart';

Future<Iterable<String>> fetchClasses() async {
  final List<dynamic> dyn = (await Supabase.instance.client
          .from('Teachers')
          .select('classes')
          .eq('teacherid', Supabase.instance.client.auth.currentUser!.id)
          .single())
      .values.first;
  final Iterable<String> ret = dyn.map((e) => e.toString(),).toList(growable: false);
  return ret;
}
