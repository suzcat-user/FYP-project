const { Pool } = require('pg');

const config = {
    user: "avnadmin",
    password: "AVNS_84LTE7z9ctG7QdcKO9P",
    host: "pg-194a9ae2-myrp-fypp.h.aivencloud.com",
    port: 23353,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
MIIEUDCCArigAwIBAgIUEvbQFXeJA0ZeY8SJJcmui/deqvkwDQYJKoZIhvcNAQEM
BQAwQDE+MDwGA1UEAww1NjljMTI3YmItYTViYi00Y2YwLTk1YjAtODM3MjY4OTZj
MTU5IEdFTiAxIFByb2plY3QgQ0EwHhcNMjYwMTIyMDkwNDIyWhcNMzYwMTIwMDkw
NDIyWjBAMT4wPAYDVQQDDDU2OWMxMjdiYi1hNWJiLTRjZjAtOTViMC04MzcyNjg5
NmMxNTkgR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
AYoCggGBALditoB0vouSOHnlLH2dBJNxbQotAb9W7hfF/QXtzWeEj3uNPK1VFwXi
AcAG4Lk5vaiwNYYliw9zp2rjGqUqTd4ZejAC7dDchtcHoK94ObT0f6hUii2TeugJ
/uRY7FZMWYjoLST6Ev4INBFkqbOhJK9r3T9hXAjpPANH1hNRVGYVzvMe8CtzT/Rz
sswkHeUWV3+xcBlRyaEwTInDWqh3Fk5HoBlbt2rgdvS8CjKo8wCEjKP1gkC8sUVB
Bl3mYeK76z+FjLsDslX5/ukNSXHKOnD/Nhozvjqe3ZU3RNXQRyngMEl4SuyfO2Kb
SnH0pJMEk3JAqp7td63n8YcdbwCbSQNGS0sbEWQ4QdX6uz2ILDDr8jbsDM4NRwVs
UEgFetJXFiCyz5BDmc05d1Di6XcZUsmkR9ydL19dM70Z5BNFO3oBJCD+faipSLh5
c4ejnCk3qCYw3YA95ywW/VhK7Qqwz13uXnzPQ0AnWGriZMItyXz8x9YTIWq1bOjq
4qiOu6kbBQIDAQABo0IwQDAdBgNVHQ4EFgQUU3VI+9w5vzFsuzNsmY7z/LcMB1kw
EgYDVR0TAQH/BAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQAD
ggGBABmZHaUmkx1WrjNzP5k+rkY2HxPgrgugpS5nzxiOYRwVM08wXnRSbG18eVS6
yGkr/BYL7CJ/BQtM7NqJzIUTfelScsX8QPIYd2s717IRnNm26hq9x4YPaB3dZv6r
njxR17zPW/GjNTcD8Fl5nwOEg/72E6cE030aN0tJz9cQJYPLBcl78Wba99GQbLLl
8Vwp1krZ1ShOkhzEmIb6x1U7Zcvnp28KWakSeY9Mhiyen0Nje+yDqd2RSL5NwVak
ED5LDNeQQGc/X88F6dr1HqgA45PVNT+RG+Nr6/obdsaTD+dTxeOjg6h/J/LcTNDI
Rg6tmkIV2kb14v0QmMuhoyq3pYTvSC5TsZynxErcvqfWMK8l8iHbKKYq3FpaWZNQ
dQaRaRSAeX5R0QuHfA3pRsz60fBAmQmrXKne0NhhH+kI0t1rjbcpuYBR6NUSLU1Q
ITfSDC3nyJ3PLcd2aDbL6olDj3Wy9etJJxofUakzE76J6KvbPYaC0NabaC8RZFm7
6whB1Q==
-----END CERTIFICATE-----`,
    },
};

// Create a connection pool
const pool = new Pool(config);

// Test connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error connecting to Aiven PostgreSQL:', err.stack);
    } else {
        console.log('✅ Connected to Aiven PostgreSQL database');
        release();
    }
});

module.exports = pool;
