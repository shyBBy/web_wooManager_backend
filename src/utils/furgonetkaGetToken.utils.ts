import axios from 'axios';

export const getToken = async () => {
  const clientId = 'woofloow-a8504b324036935db1e205159e112418';
  const clientSecret =
    '528fbcdb19eaeaee718f5370ae43c774a9038635d1aac11bf83a40744614e8b5';
  const username = 'przesylkibigsewciu@gmail.com';
  const password = 'l3g8JJCoYInrvpZ';
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const url = 'https://konto.furgonetka.pl/oauth/token';

  try {
    const response = await axios.post(
      url,
      'grant_type=password&scope=api&username=' +
        encodeURIComponent(username) +
        '&password=' +
        encodeURIComponent(password),
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Nie można uzyskać tokena dostępu.', error);
  }
};
