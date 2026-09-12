import { describe, expect, it } from "vitest";
import { decodeEntities, summarizeHtml } from "./html-summary";

const PAGE = `<!doctype html><html><head>
<title> Acme &amp; Co | Invoicing for agencies </title>
<meta property="og:description" content="OG text">
<meta content="Send invoices in one click &mdash; built for agencies." name="description">
<style>h1 { color: red }</style>
<script>document.title = "<h1>not a heading</h1>"</script>
</head><body>
<h1 class="hero">Invoicing <em>that</em> gets you paid</h1>
<!-- <h2>commented out</h2> -->
<h2>For agencies</h2><h2>For agencies</h2>
<h2>   </h2>
<h3>ignored</h3>
</body></html>`;

describe("summarizeHtml", () => {
  it("reads the title, the named meta description and the h1/h2 texts", () => {
    const summary = summarizeHtml(PAGE);
    expect(summary.title).toBe("Acme & Co | Invoicing for agencies");
    expect(summary.description).toBe("Send invoices in one click — built for agencies.");
    expect(summary.headings).toEqual(["Invoicing that gets you paid", "For agencies"]);
  });

  it("falls back to og:description and og:title", () => {
    const summary = summarizeHtml(`<meta property="og:title" content="Beta"><meta property="og:description" content="Only OG">`);
    expect(summary.title).toBe("Beta");
    expect(summary.description).toBe("Only OG");
  });

  it("returns empty fields for non-html input", () => {
    expect(summarizeHtml("just text")).toEqual({ title: "", description: "", headings: [] });
  });

  it("caps heading count and length", () => {
    const many = Array.from({ length: 30 }, (_, i) => `<h2>Heading ${i} ${"x".repeat(300)}</h2>`).join("");
    const summary = summarizeHtml(many);
    expect(summary.headings.length).toBeLessThanOrEqual(12);
    expect(summary.headings[0].length).toBeLessThanOrEqual(160);
  });
});

describe("decodeEntities", () => {
  it("decodes numeric, hex and named entities", () => {
    expect(decodeEntities("&#65;&#x42;&nbsp;&rsquo;&unknown;")).toBe("AB ’&unknown;");
  });
});
