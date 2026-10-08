class RateSnapshot {
  const RateSnapshot({
    required this.base,
    required this.rates,
    required this.updatedAt,
    required this.provider,
  });

  final String base;
  final Map<String, double> rates;
  final String updatedAt;
  final String provider;
}
