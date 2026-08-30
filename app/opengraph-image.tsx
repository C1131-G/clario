import { ImageResponse } from "next/og";

export const alt = "Clario — business intelligence for SAP Business One";
export const size = { height: 630, width: 1200 };
export const contentType = "image/png";

const OpenGraphImage = () =>
  new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#0E1728",
        color: "#F8FAFC",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div style={{ color: "#3B82F6", fontSize: 28, letterSpacing: 8 }}>
        VEDHASOFT AI
      </div>
      <div style={{ fontSize: 112, fontWeight: 700, marginTop: 18 }}>
        Clario
      </div>
      <div style={{ color: "#A9B7CC", fontSize: 32, marginTop: 18 }}>
        Ask better questions of your SAP Business One data.
      </div>
    </div>,
    size
  );

export default OpenGraphImage;
