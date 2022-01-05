import express, { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const PORT = 3000;
const app = express();

const SECRET = "brunowbbs";

app.use(express.json());

function verifyJWT(request: Request, response: Response, next: NextFunction) {
  const token = request.headers["authorization"]?.split(" ")[1];

  const index = blackList.findIndex((item: string) => item === token);

  if (index !== -1) return response.status(401).end();

  jwt.verify(token, SECRET, (error, decoded: JwtPayload) => {
    if (error) return response.status(401).end();
    request.userId = decoded.userId;

    next();
  });
}

app.get("/", (request, response) => {
  return response.json({ message: "Hello World" });
});

app.post("/login", (request, response) => {
  if (request.body.user === "wesley" && request.body.password === "123") {
    const token = jwt.sign({ userId: 1 }, SECRET, { expiresIn: 300 });

    return response.json({ auth: true, token });
  }

  response.status(401).end();
});

app.get("/clientes", verifyJWT, (request, response) => {
  console.log(request.userId);

  return response.json([{ id: 1, nome: "Wesley" }]);
});

const blackList: any = [];

app.post("/logout", (request, response) => {
  const token = request.headers["authorization"]?.split(" ")[1];

  blackList.push(token);
  response.end();
});

app.listen(PORT, () =>
  console.log(`Server started http://localhost://${PORT}`)
);
