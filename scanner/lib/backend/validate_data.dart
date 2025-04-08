bool isDataValidId(String data) {
  if (data.length != 9) {
    return false;
  }
  if (int.tryParse(data) == null) {
    return false;
  }
  return true;
}