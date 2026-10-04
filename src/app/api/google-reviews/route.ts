import { NextResponse } from "next/server";
import { BRAND, TESTIMONIALS } from "@/components/landing/data";

export const revalidate = 43200; // cache 12 jam — rating Google tidak perlu real-time

type GoogleReview = {
  authorAttribution?: { displayName?: string };
  rating?: number;
  relativePublishTimeDescription?: string;
  text?: { text?: string };
  originalText?: { text?: string };
};

export type ReviewsPayload = {
  source: "google" | "static";
  rating: string;
  total: number;
  reviews: {
    name: string;
    stars: number;
    time: string;
    role: string;
    text: string;
  }[];
};

const staticPayload = (): ReviewsPayload => ({
  source: "static",
  rating: BRAND.rating,
  total: BRAND.reviewCount,
  reviews: TESTIMONIALS.map((t) => ({
    name: t.name,
    stars: t.stars,
    time: t.time,
    role: t.role,
    text: t.text,
  })),
});

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  // Tanpa API key / Place ID -> fallback data statis (tetap tampil normal).
  if (!apiKey || !placeId) {
    return NextResponse.json(staticPayload());
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "rating,userRatingCount,reviews.rating,reviews.text,reviews.originalText,reviews.authorAttribution,reviews.relativePublishTimeDescription",
        },
        next: { revalidate },
      }
    );

    if (!res.ok) throw new Error(`Places API ${res.status}`);

    const data = (await res.json()) as {
      rating?: number;
      userRatingCount?: number;
      reviews?: GoogleReview[];
    };

    const reviews = (data.reviews ?? [])
      .map((r) => ({
        name: r.authorAttribution?.displayName ?? "Pengunjung Google",
        stars: Math.round(r.rating ?? 5),
        time: r.relativePublishTimeDescription ?? "",
        role: "Google Review",
        text:
          r.text?.text ??
          r.originalText?.text ??
          "Terima kasih sudah mampir dan memberi ulasan!",
      }))
      .filter((r) => r.stars >= 1)
      .slice(0, 6);

    if (reviews.length === 0) throw new Error("Reviews kosong");

    const payload: ReviewsPayload = {
      source: "google",
      rating: (data.rating ?? Number(BRAND.rating)).toFixed(1),
      total: data.userRatingCount ?? BRAND.reviewCount,
      reviews,
    };
    return NextResponse.json(payload);
  } catch {
    // API gagal (quota, network, dsb.) -> tetap tampilkan data statis
    return NextResponse.json(staticPayload());
  }
}
