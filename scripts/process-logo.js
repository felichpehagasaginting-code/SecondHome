/**
 * Proses logo Second Home Coffee:
 * 1. Hapus background putih -> transparan (soft threshold di tepi biar halus)
 * 2. Trim whitespace
 * 3. Simpan ke public/images/logo.png (buat navbar & footer)
 * 4. Buat favicon square 256x256 di src/app/icon.png (auto-favicon Next.js)
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = "/home/z/my-project/upload/pasted_image_1792239695404.png";
const OUT_LOGO = "/home/z/my-project/public/images/logo.png";
const OUT_ICON = "/home/z/my-project/src/app/icon.png";

async function removeWhiteBg(inputBuffer) {
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const out = Buffer.from(data);

  const isWhiteish = (i) => {
    const r = out[i * 4], g = out[i * 4 + 1], b = out[i * 4 + 2];
    return Math.min(r, g, b) >= 215;
  };

  // Flood-fill dari semua piksel tepi: hanya area putih yang TERHUBUNG ke
  // luar yang dijadikan transparan. Teks & biji kopi putih di dalam rumah
  // tidak terhubung ke tepi -> tetap opaque.
  const total = width * height;
  const marked = new Uint8Array(total);
  const queue = new Int32Array(total);
  let qHead = 0, qTail = 0;

  const push = (i) => {
    if (!marked[i] && isWhiteish(i)) {
      marked[i] = 1;
      queue[qTail++] = i;
    }
  };

  for (let x = 0; x < width; x++) {
    push(x);                      // baris atas
    push((height - 1) * width + x); // baris bawah
  }
  for (let y = 0; y < height; y++) {
    push(y * width);              // kolom kiri
    push(y * width + width - 1);  // kolom kanan
  }

  while (qHead < qTail) {
    const i = queue[qHead++];
    const x = i % width;
    const y = (i / width) | 0;
    if (x > 0) push(i - 1);
    if (x < width - 1) push(i + 1);
    if (y > 0) push(i - width);
    if (y < height - 1) push(i + width);
  }

  // Terapkan alpha: area marked -> transparan (gradasi di tepi antialias)
  for (let i = 0; i < total; i++) {
    if (!marked[i]) continue;
    const r = out[i * 4], g = out[i * 4 + 1], b = out[i * 4 + 2];
    const min = Math.min(r, g, b);
    let alpha = 0;
    if (min < 248) {
      alpha = Math.round(255 * ((248 - min) / (248 - 215)) ** 1.4);
    }
    out[i * 4 + 3] = alpha;
  }

  return sharp(out, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

(async () => {
  const raw = fs.readFileSync(SRC);

  // 1) buang background putih
  const transparent = await removeWhiteBg(raw);

  // 2) trim sisa ruang kosong lalu simpan logo utama (maks 512px)
  await sharp(transparent)
    .trim({ threshold: 10 })
    .resize(512, 512, { fit: "inside", withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(OUT_LOGO);
  console.log("OK logo ->", OUT_LOGO);

  // 3) favicon square: kanvas transparan, logo di tengah dengan padding
  const trimmed = await sharp(transparent)
    .trim({ threshold: 10 })
    .resize(230, 230, { fit: "inside" })
    .png()
    .toBuffer();
  const meta = await sharp(trimmed).metadata();
  await sharp({
    create: {
      width: 256,
      height: 256,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: trimmed,
        left: Math.round((256 - meta.width) / 2),
        top: Math.round((256 - meta.height) / 2),
      },
    ])
    .png()
    .toFile(OUT_ICON);
  console.log("OK favicon ->", OUT_ICON);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
