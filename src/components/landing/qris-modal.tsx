"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRp } from "./cart-store";
import {
  CheckCircle2,
  Clock,
  Download,
  QrCode,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Share2,
} from "lucide-react";

type QrisModalProps = {
  isOpen: boolean;
  onClose: () => void;
  amount: number; // Dalam ribuan (0.01 = Rp10, 15 = Rp15.000)
  itemsSummary?: string[];
  customerName?: string;
  orderType?: string;
  onPaymentSuccess?: () => void;
};

type QrisData = {
  success: boolean;
  isDemo: boolean;
  mode: string;
  amount: number;
  qrisUrl: string;
  transactionId: string;
  message?: string;
};

export function QrisModal({
  isOpen,
  onClose,
  amount,
  itemsSummary = [],
  customerName = "Pelanggan",
  orderType = "Dine-in",
  onPaymentSuccess,
}: QrisModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrisData, setQrisData] = useState<QrisData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success">("pending");
  const [timeLeft, setTimeLeft] = useState(900); // 15 menit

  const nominalRupiah = Math.round(amount * 1000);

  // Buat QRIS saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setPaymentStatus("pending");
      setError(null);
      setTimeLeft(900);
      fetchQris();
    }
  }, [isOpen, amount]);

  // Hitung mundur waktu kadaluarsa QRIS
  useEffect(() => {
    if (!isOpen || paymentStatus === "success" || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, paymentStatus, timeLeft]);

  const fetchQris = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/mayar/qris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: nominalRupiah }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setQrisData(data);
      } else {
        setError(data.message || "Gagal membuat kode QRIS.");
      }
    } catch (err: any) {
      setError("Gagal menghubungi server untuk membuat QRIS.");
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleSimulateSuccess = () => {
    setPaymentStatus("success");
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-cream text-foreground border-stone-300 p-0 overflow-hidden shadow-2xl">
        {/* Header Branding */}
        <div className="bg-brand text-cream p-5 pb-4 text-center relative">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="font-anton tracking-wider text-xl">QRIS</span>
            <span className="text-xs bg-cream/20 text-cream px-2 py-0.5 rounded-full font-medium">
              Mayar Gateway
            </span>
          </div>
          <DialogTitle className="text-lg font-bold text-cream">
            Second Home Coffee
          </DialogTitle>
          <DialogDescription className="text-cream/80 text-xs mt-0.5">
            Jl. Raya Setu Cibuntu, Cibitung, Bekasi
          </DialogDescription>

          {qrisData?.isDemo && (
            <div className="mt-2 inline-flex items-center gap-1 text-[11px] bg-amber-400 text-stone-900 font-semibold px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Mode Simulator Sandbox
            </div>
          )}
        </div>

        <div className="p-6 pt-4">
          {paymentStatus === "success" ? (
            /* Tampilan Sukses */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-anton text-stone-900">
                  PEMBAYARAN BERHASIL!
                </h3>
                <p className="text-sm text-stone-600 mt-1">
                  Terima kasih, pesanan kamu sudah kami terima dan siap diproses barista.
                </p>
              </div>

              <div className="bg-stone-100 rounded-xl p-4 text-left text-xs space-y-2 border border-stone-200">
                <div className="flex justify-between">
                  <span className="text-stone-500">Total Dibayar:</span>
                  <span className="font-bold text-brand text-sm">{formatRp(amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Nama Pemesan:</span>
                  <span className="font-medium text-stone-800">{customerName || "Tamu"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Metode:</span>
                  <span className="font-medium text-stone-800">{orderType}</span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-2 text-[10px] text-stone-400">
                  <span>ID Transaksi:</span>
                  <span>{qrisData?.transactionId}</span>
                </div>
              </div>

              <Button
                onClick={onClose}
                className="w-full bg-brand hover:bg-brand-deep text-cream font-medium"
              >
                Selesai & Tutup
              </Button>
            </div>
          ) : (
            /* Tampilan Kode QRIS */
            <div className="space-y-4 text-center">
              {/* Nominal Pembayaran */}
              <div className="bg-white rounded-xl p-3 border border-stone-200 shadow-sm">
                <p className="text-xs text-stone-500 uppercase tracking-wider font-medium">
                  Total Tagihan
                </p>
                <p className="text-2xl font-black text-brand font-anton mt-0.5">
                  {formatRp(amount)}
                </p>
                {nominalRupiah === 10 && (
                  <Badge variant="outline" className="mt-1 text-[11px] border-brand text-brand">
                    Uji Coba Sistem 10 Perak
                  </Badge>
                )}
              </div>

              {/* Area QR Code */}
              <div className="relative bg-white p-4 rounded-2xl border-2 border-dashed border-stone-300 inline-block mx-auto min-w-[260px] min-h-[260px] flex items-center justify-center">
                {loading ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-12 text-stone-500 text-xs">
                    <RefreshCw className="w-8 h-8 animate-spin text-brand" />
                    <span>Menghubungi Mayar Gateway...</span>
                  </div>
                ) : error ? (
                  <div className="text-red-600 p-4 text-xs space-y-2">
                    <AlertCircle className="w-8 h-8 mx-auto" />
                    <p className="font-medium">{error}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={fetchQris}
                      className="text-xs mt-2"
                    >
                      Coba Lagi
                    </Button>
                  </div>
                ) : qrisData?.qrisUrl ? (
                  <div className="space-y-2">
                    <div className="relative w-56 h-56 mx-auto bg-white rounded-lg p-1">
                      <Image
                        src={qrisData.qrisUrl}
                        alt="QRIS Second Home Coffee Mayar"
                        width={224}
                        height={224}
                        className="w-full h-full object-contain rounded"
                        unoptimized
                        priority
                      />
                    </div>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-stone-500 font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Berlaku: {formatTimer(timeLeft)}</span>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Instruksi Pembayaran */}
              <p className="text-xs text-stone-600 leading-relaxed px-2">
                Buka aplikasi m-Banking (BCA, Mandiri, BRI) atau e-Wallet (GoPay, OVO, Dana, ShopeePay), lalu <strong>scan QRIS</strong> di atas.
              </p>

              {/* Tombol Aksi & Simulator */}
              <div className="space-y-2 pt-1">
                {/* Tombol Simulasi Pembayaran Berhasil (khusus mode Sandbox/demo) */}
                <Button
                  onClick={handleSimulateSuccess}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-2 h-auto flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Simulasikan Pembayaran Berhasil (Tes)
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="w-full text-xs text-stone-600 border-stone-300"
                  >
                    Batal
                  </Button>
                  {qrisData?.qrisUrl && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(qrisData.qrisUrl, "_blank")}
                      className="w-full text-xs text-stone-700 border-stone-300 flex items-center justify-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Buka Gambar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
