import https from 'https';

export const handler = async (event) => {
    const start = performance.now();

    const lat = event.latitude || 57.7089;
    const lon = event.longitude || 11.9746;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    const getWeather = () => {
        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(JSON.parse(data)));
            }).on('error', reject);
        });
    };

    try {
        const response = await getWeather();
        const current = response.current_weather;

        const end = performance.now();
        const executionTime = end - start;
        return {
            statusCode: 200,
            body: JSON.stringify({
                temperature: current.temperature,
                windspeed: current.windspeed,
                execution: executionTime.toFixed(6),
            }),
          };
    } catch (error) {
        return {
            error: error.message,
            execution: (performance.now() - start).toFixed(6)
        };
    }
};
