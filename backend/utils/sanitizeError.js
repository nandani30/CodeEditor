export default function sanitizeError(error) {
    if (!error) return null;
  
    const msg = typeof error === "string" ? error : error.message || "";
    return msg.replaceAll(process.cwd(), "[project]");
  }
  