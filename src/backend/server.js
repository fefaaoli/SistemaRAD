import express from "express";
import cors from "cors";
import { authenticate } from "ldap-authentication";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/auth", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await authenticate({
      ldapOpts: { url: "ldap://ad.fearp.usp.br" },
      userDn: `${username}@fea-rp.local`,
      userPassword: password,
      userSearchBase: "DC=fea-rp,DC=local",
      usernameAttribute: "sAMAccountName",
      username,
      attributes: [
        "dn",
        "sn",
        "cn",
        "employeeID",
        "mail",
        "givenName",
        "memberOf"
      ]
    });

    res.json({ success: true, user });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.listen(3002, () => console.log("API LDAP rodando na porta 3002"));
