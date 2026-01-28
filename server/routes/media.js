const express = require('express');

const DEFAULT_EMOJIS = [
  '😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','😉',
  '😍','😘','😜','🤪','😎','🥳','🤩','😴','🤔','🫡','😤','😭',
  '😮','😱','😬','😷','🤒','🤕','🥶','🥵','🤗','🙃','😵‍💫','😡',
  '🙌','👏','🫶','🙏','🤝','👍','👎','💪','✌️','🤘','👌','🤙',
  '🔥','✨','💥','💫','🌟','🌈','⚡','☀️','🌙','🌧️','❄️','🌊',
  '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💖','💘','💯',
  '🎉','🎊','🎈','🎁','🎂','🎯','🏆','🏅','🎮','🎨','🎵','🎬',
  '📌','📣','📢','📷','📸','🧠','💡','📚','✏️','📝','🧩','🛠️',
  '🚀','🛸','🏝️','🗺️','🍀','🌸','🌻','🍕','🍔','🍟','🍣','☕',
  '🍩','🍪','🍰','🍫','🍿','🥤','🧋','🍹','🍺','🥂','🍎','🍉',
  '🍓','🍒','🍇','🍍','🥑','🥦','🥕','🌽','🌮','🌯','🥗',
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐸',
  '🐵','🐥','🐧','🐦','🦄','🐢','🐠','🐬','🦋','🐝','🌼','🌺',
  '🏀','⚽','🏈','⚾','🎾','🏐','🏓','🎳','🛼','🚴','🏃','🧘',
  '⌛','⏰','📍','🧭','🧳','🎒','🛍️','🎧','📱','💻','🖥️','🖱️',
  '🔮','🧿','💎','🪄','🧸','🪅','🪩','🎀','🧵','🧶','🧷','🪡',
  '✅','❌','⚠️','❗','❓','➕','➖','➗','✖️','🔔','🔒','🔑'
];

const DEFAULT_GIFS = [
  "https://media1.tenor.com/m/ULDjjjbmgt4AAAAd/yeyeskies-cynthia-erivo.gif",
  "https://media1.tenor.com/m/pwgQhX123s4AAAAC/cynthia-erivo-shocked.gif",
  "https://media1.tenor.com/m/uxC9pNjuaAIAAAAd/ariana-grande-hair-flip.gif",
  "https://media1.tenor.com/m/Wt1mxxqzC1gAAAAC/phatearl.gif",
  "https://media1.tenor.com/m/dhwxCmcCKAUAAAAd/stan-twitter-nurse-britney.gif",
  "https://media1.tenor.com/m/-t4PlsIvMjkAAAAC/kill-me-shoot-me.gif",
  "https://media1.tenor.com/m/t-Imk589wNcAAAAC/stan-twitter.gif",
  "https://media1.tenor.com/m/T5xyQ6PNiEcAAAAd/stan-twitter.gif",
  "https://media1.tenor.com/m/6COMq6z3l5oAAAAC/bosnov-67.gif",
  "https://media1.tenor.com/m/O-MmXat9u54AAAAC/benson-boone-coachella.gif",
  "https://media1.tenor.com/m/MuL00oOUHpAAAAAC/wicked-glinda-wicked-for-good.gif",
  "https://media1.tenor.com/m/rxjtdE-oKtMAAAAC/little-mermaid-laughing.gif"
];

module.exports = (db) => {
  const router = express.Router();

  router.get('/emojis', async (req, res) => {
    try {
      const [catalogRows] = await db.execute('SELECT items FROM media_catalog WHERE catalog_type = ? LIMIT 1', ['emoji']);
      if (catalogRows.length) {
        const raw = catalogRows[0].items;
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (Array.isArray(parsed) && parsed.length) {
          return res.json({ emojis: parsed });
        }
      }

      const [rows] = await db.execute('SELECT emoji FROM emoji_catalog ORDER BY emoji_id');
      if (!rows.length) {
        return res.json({ emojis: DEFAULT_EMOJIS });
      }
      res.json({ emojis: rows.map(r => r.emoji) });
    } catch (err) {
      console.error('Database error:', err);
      return res.json({ emojis: DEFAULT_EMOJIS });
    }
  });

  router.get('/gifs', async (req, res) => {
    try {
      const [catalogRows] = await db.execute('SELECT items FROM media_catalog WHERE catalog_type = ? LIMIT 1', ['gif']);
      if (catalogRows.length) {
        const raw = catalogRows[0].items;
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (Array.isArray(parsed) && parsed.length) {
          return res.json({ gifs: parsed });
        }
      }

      const [rows] = await db.execute('SELECT url FROM gif_catalog ORDER BY gif_id');
      if (!rows.length) {
        return res.json({ gifs: DEFAULT_GIFS });
      }
      res.json({ gifs: rows.map(r => r.url) });
    } catch (err) {
      console.error('Database error:', err);
      return res.json({ gifs: DEFAULT_GIFS });
    }
  });

  return router;
};
