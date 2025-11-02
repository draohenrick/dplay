import puppeteer from "puppeteer-core";
import qrcode from "qrcode-terminal";

let clientBrowser;
let clientPage;

export async function initClient() {
  clientBrowser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  clientPage = await clientBrowser.newPage();
  await clientPage.goto("https://web.whatsapp.com");

  // Espera QR code aparecer
  const qrSelector = "canvas[aria-label='Scan me!']";
  await clientPage.waitForSelector(qrSelector);

  const qrCanvas = await clientPage.$(qrSelector);
  const qrData = await clientPage.evaluate((canvas) => {
    return canvas.toDataURL();
  }, qrCanvas);

  // Mostra QR code no terminal
  qrcode.generate(qrData, { small: true });

  console.log("QR code gerado! Escaneie no celular.");
}

export async function sendMessage(number, message) {
  if (!clientPage) throw new Error("Cliente não inicializado");

  const formattedNumber = number.replace(/\D/g, "");
  const url = `https://web.whatsapp.com/send?phone=${formattedNumber}&text=${encodeURIComponent(message)}`;

  await clientPage.goto(url);
  await clientPage.waitForTimeout(3000); // espera carregar

  const sendBtnSelector = "button[data-testid='compose-btn-send']";
  await clientPage.waitForSelector(sendBtnSelector);
  await clientPage.click(sendBtnSelector);

  console.log(`Mensagem enviada para ${number}: ${message}`);
}
