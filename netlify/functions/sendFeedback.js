// /netlify/functions/sendFeedback.js
const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Méthode non autorisée',
    };
  }

  const data = JSON.parse(event.body);

  const message = `
🧠 Nouveau feedback utilisateur SQL Optimizer:

⭐ Note: ${data.rating}/5
👍 Aimé: ${data.liked}
📉 Manques: ${data.missing}
❓ Incompréhensions: ${data.confused}
💡 Fonctionnalité souhaitée: ${data.feature}
📢 Recommande: ${data.recommend}
🗣️ Remarques libres: ${data.free_comment}
⏰ Reçu le: ${data.timestamp}
  `;

  // Configure le transporteur SMTP (ici avec Gmail)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.FEEDBACK_EMAIL,       // email d'envoi (ex: gmail)
      pass: process.env.FEEDBACK_EMAIL_PASS   // mot de passe ou app password
    }
  });

  try {
    await transporter.sendMail({
      from: `"SQL Optimizer" <${process.env.FEEDBACK_EMAIL}>`,
      to: "dialloolivier264@gmail.com",
      subject: "📬 Nouveau feedback SQL Optimizer",
      text: message
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Erreur email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur envoi email' }),
    };
  }
};
