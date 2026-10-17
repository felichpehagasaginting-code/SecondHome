import { NextResponse } from "next/navigation";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amount = Number(body.amount);

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Nominal pembayaran (amount) tidak valid." },
        { status: 400 }
      );
    }

    const apiKey = process.env.MAYAR_API_KEY?.trim();
    const env = process.env.MAYAR_ENV?.toLowerCase() === "production" ? "production" : "sandbox";
    const baseUrl = env === "production" ? "https://api.mayar.id" : "https://api.mayar.io";

    // Jika API Key Mayar tersedia, panggil Mayar Headless API
    if (apiKey) {
      try {
        const response = await fetch(`${baseUrl}/hl/v1/qrcode/create`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Math.round(amount),
          }),
        });

        const data = await response.json();

        if (response.ok && data?.data?.url) {
          return NextResponse.json({
            success: true,
            isDemo: false,
            mode: env,
            amount: Math.round(amount),
            qrisUrl: data.data.url,
            transactionId: data.data.id || `mayar_${Date.now()}`,
            createdAt: new Date().toISOString(),
          });
        }

        console.warn("Mayar API error response:", data);
        // Jika API menolak (misal token salah), beri pesan jelas
        return NextResponse.json(
          {
            success: false,
            message: data?.messages || data?.message || "Gagal membuat QRIS di Mayar.",
            detail: data,
          },
          { status: response.status || 500 }
        );
      } catch (err: any) {
        console.error("Gagal terhubung ke Mayar API:", err);
        return NextResponse.json(
          {
            success: false,
            message: "Gagal menghubungi server Mayar. Periksa koneksi atau API Key.",
            error: err.message,
          },
          { status: 502 }
        );
      }
    }

    // Fallback Simulator Mode (Jika pengguna belum memasukkan API Key di .env)
    // Menghasilkan QR Code SVG dinamis siap-scan untuk pengujian visual
    const mockTransactionId = `demo_sh_${Date.now()}`;
    const demoQrText = `00020101021226670014ID.LINKAJA.WWW01189360091100223344550215${mockTransactionId}51440014ID.CO.QRIS.WWW0215ID10200000000000303UMI520458145303360540` +
      `${amount}5802ID5919Second Home Coffee6006Bekasi61051752062190115${mockTransactionId}6304ABCD`;

    // Gunakan public API pembuat QR gambar terpercaya agar QR nyata dan bisa discan
    const demoQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(
      demoQrText
    )}&margin=10`;

    return NextResponse.json({
      success: true,
      isDemo: true,
      mode: "sandbox-demo",
      amount: Math.round(amount),
      qrisUrl: demoQrUrl,
      transactionId: mockTransactionId,
      message:
        "Berjalan dalam mode Simulator Demo. Masukkan MAYAR_API_KEY di file .env untuk menghubungkan ke akun Mayar asli.",
      createdAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server saat memproses QRIS.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
