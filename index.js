// Import modules
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

// Initialize dotenv
dotenv.config();

// Check required environment variables
const { EMAIL, EMAIL_APP_PASSWORD, EMAILS_TO_FORWARD, PORT } = process.env;
if (!EMAIL || !EMAIL_APP_PASSWORD || !EMAILS_TO_FORWARD) {
  console.error("Missing required environment variables");
  process.exit(1);
}

// Set up Express app
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: true }));

// Send index.html for any non-API GET request
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Email sending handler
app.post("/sendemail", async (req, res) => {
  try {
    await sendEmail(req.body);
    res.sendFile(path.join(__dirname, "gracias.html"));
  } catch (error) {
    console.error("Failed to send email:", error);
    res.status(500).send("Email could not be sent");
  }
});

// Start server
const serverPort = PORT || 3000;
app.listen(serverPort, () => {
  console.log(
    `Server listening on port ${serverPort} in ${app.settings.env} mode`
  );
});

function createEmailMessage(user) {
  if (!user) throw new Error("User data is required.");
  const name = user.name || "Unknown name";
  const city = user.ciudad || "Unknown city"; 
  const email = user.email || "No email provided";
  const phone = user.telefono || "No phone number provided"; 
  const message = user.message || "No message provided";
  return `
    Una persona solicitó información por la página web, ponerse en contacto inmediatamente:
    Nombre: ${name}
    Ciudad: ${city}
    Email: ${email}
    Teléfono: ${phone}
    Mensaje: ${message}
  `;
}

// Asynchronous function to send an email
async function sendEmail(body) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: EMAIL, pass: EMAIL_APP_PASSWORD },
  });
  const text = createEmailMessage(body.user);

  const message = {
    from: EMAIL,
    to: EMAILS_TO_FORWARD,
    subject: "Solicitud de informacion",
    text: text,
  };

  return transporter.sendMail(message);
}
