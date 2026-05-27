const { getSignedCookies } = require ("@aws-sdk/cloudfront-signer") 

const cloudfrontDistributionDomain = "https://d14qd4bgnyowyp.cloudfront.net";
const s3ObjectKey = "Paper2/Paper2[23-06-2025].pdf";
const url = `${cloudfrontDistributionDomain}/${s3ObjectKey}`;
const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDw345e84Jgmd0h
Fh46ZlgyF7dRs3D2KRhXxVYc01C+iQIklGrlaMiNrKxNigw/cpd4CCIHJ3i/qbcR
mp7rAaOhegETnVM6NqFYQge4qDuLxt3GXZldUaCAnHgmAFPjVcoa/Bw1DYle4Hox
y+L42X/AWOpdjNuc9fuZ9LwuUai3TQGWpryw9iyRDJM5qzu5wo3x51sGotwwnQHA
XeJSePL/iaATuOSLSDwG/MHK6vDUlmbYv0m6RS+A901sIQe+puCMp9ramj+mVFZm
RtTfFJAMpNn2zVDfl1KCQnJ5dOZBbm8H98fuw3dm5hdNTj6WtYPsiGIi6yxkbKT/
J8TqpGwVAgMBAAECggEADlWTefw+TkQ3IrStAayHrkV3M+4R4x2gyfpfofFZDQRc
w7NZutjAlJ50a4czVuREINEaa01n9BSkD8YL6TAss3DuAaOQvsuzpYEFHMdVhyou
FlO0IIJOzaXiHYrSndpZX7/l6CoBJTZbzJJVqcRRxASBP/t1sfJ5Ma6HiK8fM0yM
5O9VMnhxNLFuL+05M5ng4oa58IQOLomAwr412/WjCYNnVJTsPN2unGuwJFyYTGPI
cXZOsGRYEgq2l2r0niZHKd4Xt0TlKyYj4dSuItba73cyrAVjM91T2WwDhCyZ7tib
ED0/SuS9p3cvLdV134DHlrDESY/TmogdecFM/7ItkQKBgQD6YYxvtJf7hfJMgQH7
fmXaUjjTG4age85EWLRyKwuLPFtqXaxS6tIJQLPo1usQO7nGb68PD7hfLVYwoiZY
cqLtZjDW03HhLJpCGVSTvDOZ9mN58Pygth8ZU1aBjC9auStkWQzQDOGI3yieX6sp
gDLcsjGnHp7CST5+pZfoIxEJJQKBgQD2R2KHSWXX6vJadJZ4NOb9JXmxes/qCJhq
GmDqgCaH+eUf+A4UWHc9OI3wo+ohETIfSsgXnM1GO979rZp6AzYmJ1QpPQCS2l80
ZRCVBbw+xzYG3UBgLKxMwqWqwbZI9fLY1Ed60vxSO/V25Gqc/d/iATFNDeg/nSNJ
NSFXaTk8MQKBgAsUTfaTczY6EyK3grLyQOeMQ99zlF19nP8BPdrfdL9QiGsIghuZ
MHogVtWyzOwG+I2DW6e69lmf0/SK+E9pozQGFZsr+BoSszDBljCDX3UspfI7a7Jg
3LduLKHG5kGJeBYUqrB6IXDBDzcS3KwVdCq35+KRRE0smItaIIKxKovRAoGBAMrp
w/9tdRDyjl4DA1rlU5AtiVe2tYnBLTr2ovVzQsv0FFlDuu3+ebgiWah0lVpLXb20
kqoJ0oPUnoTqvYVcEghbjRcxIMDeVWTJBGGUSSZ8YkJDl1/mTswr7+2CD1uL8Vu/
g2lqXuSubC9aQZE6B3Whv+oZ1EpdgQ43TVJE6xhxAoGBAL6JNruSQC0VfMpnMKWI
Q+anExCrhryL7jiNPTE9pwYrZJdWF2tcHwlgWFr8wHQ8NRdYTRTnXijqWJb1UuLT
4viyCGyTdDNyZuhg7JgejwmJKmSD8JQBKOhslgUCL/q9KSTKPpWoO+FaYNCF1tbI
Slpj8OwWkjAOI3lk2HfpNYt5
-----END PRIVATE KEY-----
`;
const keyPairId = "K1XJIHS7M87BM3";
const dateLessThan = "2026-01-01";

const policy = {
    Statement: [
        {
            Resource: url,
            Condition: {
                DateLessThan: {
                    "AWS:EpochTime": new Date(dateLessThan).getTime() / 1000, // time in seconds
                },
            },
        },
    ],
};

const policyString = JSON.stringify(policy);

const cookies = getSignedCookies({
    keyPairId,
    privateKey,
    policy: policyString,
});
