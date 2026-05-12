export default async function handler(req, res) {
  try {
    const { DateTime } = await import('luxon');
    const vedic = await import('vedic-astro');

    // Default values
    const dateStr = req.query.date || '2000-01-01';
    const timeStr = req.query.time || '12:00';
    const lat = parseFloat(req.query.lat) || 28.6139; // Default New Delhi
    const lon = parseFloat(req.query.lon) || 77.2090;

    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, minute] = timeStr.split(':').map(Number);

    const tz = req.query.tz || 'Asia/Kolkata';
    
    const dateTime = DateTime.fromObject(
      { year, month, day, hour, minute },
      { zone: tz }
    ).toUTC();

    const datetimeParams = { iso: dateTime.toISO() };
    const locationParams = { latitude: lat, longitude: lon };

    const positions = await vedic.getPlanetaryPositions(datetimeParams, locationParams, { ayanamsha: 'lahiri' });
    const kundali = vedic.getKundali(positions);

    res.status(200).json({
      status: 'success',
      data: {
        birth_details: {
          date: dateStr,
          time: timeStr,
          latitude: lat,
          longitude: lon,
          timezone: tz
        },
        positions: positions,
        kundali: kundali
      }
    });
  } catch (error) {
    console.error('Kundali API Error:', error);
    res.status(500).json({ error: 'Failed to calculate Kundali', details: error.message });
  }
}
