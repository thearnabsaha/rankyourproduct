import { ImageResponse } from "next/og";

export const alt = "rankyourproduct — a row on the board starts at $1";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          background: "#ffffff",
          color: "#111111",
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
              borderRadius: 16,
              background: "#FE4103",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 6,
              paddingBottom: 14,
            }}
          >
            <div style={{ width: 10, height: 18, background: "#fff", borderRadius: 2 }} />
            <div style={{ width: 10, height: 28, background: "#fff", borderRadius: 2 }} />
            <div style={{ width: 10, height: 40, background: "#fff", borderRadius: 2 }} />
          </div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: "#FE4103",
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
          Put your product on the board.
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 28,
            color: "#FE4103",
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
