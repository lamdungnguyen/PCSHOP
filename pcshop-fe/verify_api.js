
fetch('http://localhost:8080/api/products')
    .then(res => res.json())
    .then(data => {
        console.log('Is Array:', Array.isArray(data));
        console.log('Length:', data.length);
        if (data.length > 0) console.log('First Item:', data[0]);
    })
    .catch(err => console.error(err));
