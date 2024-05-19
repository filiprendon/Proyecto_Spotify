

const getShows = async () => {
    const showsUrl = "https://api.spotify.com/v1/me/shows?offset=0&limit=20";
    const headers = new Headers({
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    });

    try {
        const response = await fetch(showsUrl, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Failed to fetch shows data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting shows:', error);
        throw error;
    }
};

const main = async () => {
    try {
        const showsData = await getShows();
        console.log('Shows Data:', showsData);

        document.getElementById('shows-data').innerText = JSON.stringify(showsData, null, 2);
    } catch (error) {
        console.error('Error in main function:', error);
    }
};

main();