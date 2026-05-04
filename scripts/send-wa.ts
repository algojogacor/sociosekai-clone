import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode-terminal';

const AUTH_DIR = './wa_auth';
const TARGET = process.argv[2];
const MESSAGE = process.argv.slice(3).join(' ');

if (!TARGET || !MESSAGE) {
  console.error('Usage: npx tsx scripts/send-wa.ts <target@g.us> <message>');
  process.exit(1);
}

async function sendOnce() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  let sock = makeWASocket({ auth: state });
  let sent = false;

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async ({ qr, connection, lastDisconnect }) => {
    if (qr) {
      console.log('\n📱 Scan this QR with WhatsApp:\n');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'open') {
      console.log('✅ Connected to WhatsApp!');
      if (!sent) {
        sent = true;
        try {
          await sock.sendMessage(TARGET, { text: MESSAGE });
          console.log('✅ Message sent to', TARGET);
        } catch (e: any) {
          console.error('❌ Send failed:', e.message);
        }
        await sock.logout();
        process.exit(0);
      }
    }

    if (connection === 'close') {
      const code = (lastDisconnect?.error as Boom)?.output?.statusCode;
      if (code === DisconnectReason.loggedOut) {
        console.log('Logged out. Restart to scan new QR.');
        process.exit(1);
      } else if (!sent) {
        console.log('Reconnecting...');
        setTimeout(async () => {
          sock.ev.removeAllListeners();
          await sendOnce();
        }, 3000);
      }
    }
  });
}

sendOnce().catch(e => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
