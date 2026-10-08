import 'package:flutter/material.dart';

import '../models/currency_field.dart';
import '../screens/currency_picker_screen.dart';
import '../screens/rate_details_screen.dart';

void openCurrencyPicker(BuildContext context, CurrencyField field) {
  Navigator.of(context).push(
    MaterialPageRoute<void>(
      builder: (_) => CurrencyPickerScreen(field: field),
    ),
  );
}

void openRateDetails(
  BuildContext context, {
  required String from,
  required String to,
}) {
  Navigator.of(context).push(
    MaterialPageRoute<void>(
      builder: (_) => RateDetailsScreen(from: from, to: to),
    ),
  );
}
