import { ImageResponse } from "next/og";

export const alt = "rankyourproduct — a row on the board starts at $1";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "#141413",
          color: "#FAF9F5",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 12,
              background: "#E15A2B",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 6,
              paddingBottom: 14,
            }}
          >
            <div style={{ width: 10, height: 18, background: "#FAF9F5", borderRadius: 2 }} />
            <div style={{ width: 10, height: 28, background: "#FAF9F5", borderRadius: 2 }} />
            <div style={{ width: 10, height: 40, background: "#FAF9F5", borderRadius: 2 }} />
          </div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: "#FAF9F5",
              letterSpacing: -1.5,
            }}
          >
            rankyourproduct
          </div>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: -2,
            maxWidth: 980,
          }}
        >
          Rank your product or X profile.
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 28,
            color: "#E15A2B",
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          A ROW STARTS AT $1
        </div>
      </div>
    ),
    { ...size },
  );
}
