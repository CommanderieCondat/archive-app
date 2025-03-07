import jwt from "jsonwebtoken";

const SECRET_KEY = "your-secret-key";

export default async function POST(req) {
    const body = await req.json();
    const { username, password } = body;

    if (username === "admin" && password === "password") {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
        return new Response(JSON.stringify({ token }), { status: 200 });
    } else {
        return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
    }
}
