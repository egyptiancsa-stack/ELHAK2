export function generateAfricanCountries() {
  const regions = ['North Africa', 'West Africa', 'Central Africa', 'East Africa', 'Southern Africa'];
  const countries = [
    { name: 'Algeria', region: 'North Africa' }, { name: 'Angola', region: 'Central Africa' },
    { name: 'Benin', region: 'West Africa' }, { name: 'Botswana', region: 'Southern Africa' },
    { name: 'Burkina Faso', region: 'West Africa' }, { name: 'Burundi', region: 'East Africa' },
    { name: 'Cabo Verde', region: 'West Africa' }, { name: 'Cameroon', region: 'Central Africa' },
    { name: 'Central African Republic', region: 'Central Africa' }, { name: 'Chad', region: 'Central Africa' },
    { name: 'Comoros', region: 'East Africa' }, { name: 'Democratic Republic of the Congo', region: 'Central Africa' },
    { name: 'Djibouti', region: 'East Africa' }, { name: 'Egypt', region: 'North Africa' },
    { name: 'Equatorial Guinea', region: 'Central Africa' }, { name: 'Eritrea', region: 'East Africa' },
    { name: 'Eswatini', region: 'Southern Africa' }, { name: 'Ethiopia', region: 'East Africa' },
    { name: 'Gabon', region: 'Central Africa' }, { name: 'Gambia', region: 'West Africa' },
    { name: 'Ghana', region: 'West Africa' }, { name: 'Guinea', region: 'West Africa' },
    { name: 'Guinea-Bissau', region: 'West Africa' }, { name: 'Ivory Coast', region: 'West Africa' },
    { name: 'Kenya', region: 'East Africa' }, { name: 'Lesotho', region: 'Southern Africa' },
    { name: 'Liberia', region: 'West Africa' }, { name: 'Libya', region: 'North Africa' },
    { name: 'Madagascar', region: 'East Africa' }, { name: 'Malawi', region: 'East Africa' },
    { name: 'Mali', region: 'West Africa' }, { name: 'Mauritania', region: 'West Africa' },
    { name: 'Mauritius', region: 'East Africa' }, { name: 'Morocco', region: 'North Africa' },
    { name: 'Mozambique', region: 'East Africa' }, { name: 'Namibia', region: 'Southern Africa' },
    { name: 'Niger', region: 'West Africa' }, { name: 'Nigeria', region: 'West Africa' },
    { name: 'Rwanda', region: 'East Africa' }, { name: 'Sao Tome and Principe', region: 'Central Africa' },
    { name: 'Senegal', region: 'West Africa' }, { name: 'Seychelles', region: 'East Africa' },
    { name: 'Sierra Leone', region: 'West Africa' }, { name: 'Somalia', region: 'East Africa' },
    { name: 'South Africa', region: 'Southern Africa' }, { name: 'South Sudan', region: 'East Africa' },
    { name: 'Sudan', region: 'North Africa' }, { name: 'Tanzania', region: 'East Africa' },
    { name: 'Togo', region: 'West Africa' }, { name: 'Tunisia', region: 'North Africa' },
    { name: 'Uganda', region: 'East Africa' }, { name: 'Zambia', region: 'East Africa' },
    { name: 'Zimbabwe', region: 'Southern Africa' }
  ];

  // Deterministic-ish random for smooth demo data
  return countries.map((c, i) => {
    // Generate realistic seeded data
    const baseScore = 30 + ((i * 17) % 50); // Scores between 30 and 80
    
    // Some are manually weighted for realism
    let adjustedScore = baseScore;
    if (['Mauritius', 'Botswana', 'Cabo Verde', 'South Africa', 'Ghana'].includes(c.name)) adjustedScore += 15;
    if (['Eritrea', 'Sudan', 'Somalia', 'South Sudan'].includes(c.name)) adjustedScore -= 20;
    
    // Clamp
    adjustedScore = Math.max(10, Math.min(95, adjustedScore));

    return {
      id: c.name.toLowerCase().replace(/ /g, '-'),
      name: c.name,
      region: c.region,
      isEvaluated: false,
      democracyScore: 0,
      indicators: {
        structural: 0,
        process: 0,
        outcome: 0,
        civilPolitical: 0,
        opinionExpression: 0,
        economicSocial: 0,
        vulnerableGroups: 0,
        assemblyOrganization: 0,
        justice: 0
      },
      historicalTrends: [
        { year: 2020, score: 0 },
        { year: 2021, score: 0 },
        { year: 2022, score: 0 },
        { year: 2023, score: 0 },
        { year: 2024, score: 0 }
      ]
    };
  });
}
