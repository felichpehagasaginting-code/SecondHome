/**
 * Proses foto asli Second Home Coffee (upload user) + aset branding PWA/OG.
 * Output ke public/images/, public/icons/, public/og.jpg, src/app/apple-icon.png
 *
 * Catatan kualitas:
 * - 4 foto produk dari user hanya 190x247 (thumbnail) -> di-upscale 2x lanczos
 *   + sharpen ringan supaya aman ditampilkan di galeri (bukan di slot besar).
 * - Screenshot Google Maps (eksterior malam) di-crop dari chrome browser.
 * - Interior 725x841 di-crop dari border hitam tepi screenshot.
 */
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const UP = "/home/z/my-project/upload";
const IMG = "/home/z/my-project/public/images";
const ICON = "/home/z/my-project/public/icons";
const APP = "/home/z/my-project/src/app";

const LOGO = path.join(IMG, "logo.png");
const BRAND_RED = "#c8102e";
const INK = "#141010";
const CREAM = "#f6f1e7";

async function productPhoto(src, out, width = 380) {
  // Upscale 2x lembut + sharpen ringan; JPEG q82 biar ringan
  const img = sharp(path.join(UP, src)).resize({
    width,
    kernel: "lanczos3",
  });
  await img
    .sharpen({ sigma: 0.8, m1: 0.6, m2: 2.2 })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(IMG, out));
  const m = await sharp(path.join(IMG, out)).metadata();
  console.log(`${out}: ${m.width}x${m.height}`);
}

async function cropPhoto(src, out, extract, opts = {}) {
  let img = sharp(path.join(UP, src)).extract(extract);
  if (opts.width) img = img.resize({ width: opts.width, kernel: "lanczos3" });
  await img.jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(IMG, out));
  const m = await sharp(path.join(IMG, out)).metadata();
  console.log(`${out}: ${m.width}x${m.height}`);
}

async function pwaIcon(size) {
  // Logo dipusatkan di kanvas persegi cream (maskable-safe), logo 76% area
  const inner = Math.round(size * 0.62);
  const logoBuf = await sharp(LOGO)
    .resize(inner, inner, { fit: "inside" })
    .png()
    .toBuffer();
  const meta = await sharp(logoBuf).metadata();
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: CREAM,
    },
  })
    .composite([
      {
        input: logoBuf,
        left: Math.round((size - meta.width) / 2),
        top: Math.round((size - meta.height) / 2),
      },
    ])
    .png()
    .toFile(path.join(ICON, `icon-${size}.png`));
  console.log(`icon-${size}.png ok`);
}

async function appleIcon() {
  await sharp(path.join(ICON, "icon-512.png"))
    .resize(180, 180)
    .png()
    .toFile(path.join(APP, "apple-icon.png"));
  console.log("apple-icon.png ok");
}

async function ogImage() {
  const W = 1200;
  const H = 630;
  // Logo kiri-tengah bawah headline; teks atas, alamat bawah
  const logoBuf = await sharp(LOGO).resize({ height: 260 }).png().toBuffer();
  const lm = await sharp(logoBuf).metadata();

  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <rect width="${W}" height="${H}" fill="${INK}"/>
  <rect x="0" y="0" width="14" height="${H}" fill="${BRAND_RED}"/>
  <rect x="${W - 14}" y="0" width="14" height="${H}" fill="${BRAND_RED}"/>
  <circle cx="${W - 150}" cy="110" r="230" fill="${BRAND_RED}" opacity="0.14"/>
  <circle cx="120" cy="${H - 60}" r="180" fill="${BRAND_RED}" opacity="0.10"/>
  <text x="${W / 2}" y="140" text-anchor="middle" font-family="Liberation Sans" font-weight="bold" font-size="66" letter-spacing="2" fill="${CREAM}">PREMIUM TASTE,</text>
  <text x="${W / 2}" y="228" text-anchor="middle" font-family="Liberation Sans" font-weight="bold" font-size="66" letter-spacing="2" fill="${BRAND_RED}">POCKET FRIENDLY PRICE</text>
  <text x="${W / 2}" y="${H - 42}" text-anchor="middle" font-family="Liberation Sans" font-weight="bold" font-size="28" letter-spacing="6" fill="${CREAM}" opacity="0.75">Jl. Raya Setu, Cibitung — Bekasi · Buka s/d 23.00</text>
</svg>`;

  await sharp({
    create: { width: W, height: H, channels: 4, background: INK },
  })
    .composite([
      {
        input: Buffer.from(
          svg.replace(
            "</svg>",
            `<image x="${Math.round(W / 2 - lm.width / 2)}" y="272" width="${lm.width}" height="${lm.height}" xlink:href="data:image/png;base64,${logoBuf.toString("base64")}"/></svg>`
          )
        ),
      },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile("/home/z/my-project/public/og.jpg");
  console.log("og.jpg ok");
}

(async () => {
  fs.mkdirSync(ICON, { recursive: true });

  // 1) Foto produk (190x247 -> 380px)
  await productPhoto("pasted_image_1792247308108.png", "real-gula-aren.jpg");
  await productPhoto("pasted_image_1792247198513.png", "real-matcha.jpg");
  await productPhoto("pasted_image_1792247294233.png", "real-spark.jpg");
  await productPhoto("pasted_image_1792247322950.png", "real-cup-tangan.jpg");

  // 2) Interior bar (725x841, buang border hitam tepi)
  await cropPhoto(
    "pasted_image_1792247500215.png",
    "real-interior-bar.jpg",
    { left: 8, top: 6, width: 709, height: 826 },
    { width: 900 }
  );

  // 3) Eksterior malam (screenshot 1920x1080 -> crop area foto saja)
  //    Foto di x~314-1526, y~102-1025; popup atribusi y102-207 -> crop mulai y210
  //    (hindari watermark "Google Maps" di y~992+)
  await cropPhoto(
    "pasted_image_1792247452173.png",
    "real-eksterior.jpg",
    { left: 314, top: 210, width: 1212, height: 770 },
    { width: 1100 }
  );

  // 4) Icon PWA + apple + OG
  await pwaIcon(192);
  await pwaIcon(512);
  await appleIcon();
  await ogImage();

  console.log("SELESAI");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
