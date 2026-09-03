
function Hero() {
  return (
    <section
      style={{
        padding: "60px 30px",
        margin: "20px",
        borderRadius: "16px",
        background:
          "linear-gradient(135deg, #111827, #374151)",
        color: "white",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          marginBottom: "15px",
        }}
      >
        Welcome to TechZone 💻
      </h1>

      <p
        style={{
          fontSize: "20px",
          marginBottom: "25px",
        }}
      >
        Discover the latest smartphones and technology
        at amazing prices.
      </p>

      <button
        style={{
          padding: "12px 25px",
          fontSize: "16px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        onClick={() => {
          document
            .getElementById("products")
            ?.scrollIntoView({
              behavior: "smooth",
            });
        }}
      >
        Explore Products ↓
      </button>
    </section>
  );
}

export default Hero;