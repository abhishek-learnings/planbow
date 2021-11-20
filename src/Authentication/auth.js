import jwt from 'jsonwebtoken'

const TOKEN_KEY = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAKmtiCFis3U6LdVIZmZfstxVVZp2ei4Rm4t6MoIEx0FB5fVc7dumjWnLd+Ofes/yojjIVKTHlBCv5/COR3QFC99fL6FPF0M"
+ "ltE6809obQ7G1OISXAwJPQxY1M0tR0zQZchNLzE/5D1Oy+coXNY77NpJAYk6buZy/nG9/NHrQSDC5AgMBAAECgYBYHYgeXlV3wVjf9BNJgtUt2xrzdieJGRe/3Ruxra2UVBaJz1KuyNWTZVjDWqS6r"
+ "PRVrKNYV1SrPc6jfB/bPmulIMYxblgRCy+DLmp0PL5BHDUQhqu21rbj49iR/cgTmi9ER6kR/3Uhv8D6lX44YDbC8O+nkRNXY/8faUkdm+aHqQJBAOkDSvtqq3Aq0N+ESolov+sPQafVpqZS5+ku4J/nD"
+ "LB18yGF91K0HLehbKEgjVeHRhRy5ud0i2cbFC+PHpW6ZMcCQQC6arjjwJNKuNjCcgGT2jVc5ZqkOi3VVZ3Tc/Pcjlh3RRl6jaQuQNlXuTq8lhFm6hR3ft+z8nGdqF6h+gFAWD5/AkANYCUDvaHNtId87"
+ "SkiLiMmKSAJtFf2oDezyP8X7rlpv7uPJxOFadVkLR4BOc8jQR6iud3LV4NRDdrgyARnb+WtAkB2zSjDTKkRx7esQ8epmDjF2TWyT7mB6axJY+4Xs0fByvGv3rCxIXbhpxQ9t02jzq34cYzTO0EY/oJAq/k8"
+ "LoC1AkEApE8SzXC1XzuMt17ozhwpMjhxTGajRv0pMr4GOVN21XQN66OM+q1UWZ9EsyUrpiSvkiS5ZGVeOarJLHmfebgN0w==";

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

export default verifyToken;