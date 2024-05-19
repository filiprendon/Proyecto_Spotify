// const fetch = require('node-fetch');
// const btoa = require('btoa');

// // const clientId = '3f1100a54f2549dcb2451025697915cd';
// // const clientSecret = '497bf12bd91d46e6bd57233a08cb6b61';

// const getToken = async () => {
//     const tokenUrl = 'https://accounts.spotify.com/api/token';
//     const headers = {
//         'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
//         'Content-Type': 'application/x-www-form-urlencoded'
//     };
//     const body = new URLSearchParams({
//         'grant_type': 'client_credentials'
//     });

//     try {
//         const response = await fetch(tokenUrl, {
//             method: 'POST',
//             headers: headers,
//             body: body.toString()
//         });

//         if (!response.ok) {
//             throw new Error('Failed to fetch token');
//         }

//         const data = await response.json();
//         return data.access_token;
//     } catch (error) {
//         console.error('Error getting token:', error);
//         throw error;
//     }
// };

// getToken().then(token => {
//     console.log('Access Token:', token);
// }).catch(error => {
//     console.error('Error:', error);
// });
