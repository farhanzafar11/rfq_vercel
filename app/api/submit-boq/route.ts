import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

// How long to wait for n8n to respond before assuming it's running in the background.
// Nginx typically times out at 60s — we respond well before that.
const N8N_WAIT_MS = 10_000

// ---------------------------------------------------------------------------
// Webhook message → user-facing message mapping
// Each entry: { match: substring to look for (case-insensitive), type, display }
// ---------------------------------------------------------------------------
const WEBHOOK_MESSAGE_MAP: {
  match: string
  type: "error" | "success"
  display: string
}[] = [
  {
    match: "invalid pdf",
    type: "error",
    display: "⚠️ Invalid PDF — please upload a valid BOQ document and try again.",
  },
  {
    match: "model was unable to respond",
    type: "error",
    display: "🔄 The AI server is busy. Please retry in 5 minutes.",
  },
  {
    match: "pdf api is not working",
    type: "error",
    display: "🔄 The PDF processing service is currently unavailable. Please retry in 5 minutes.",
  },
  {
    match: "proposal has been generated",
    type: "success",
    display: "✅ Proposal has been generated and sent via email. Please check your Gmail inbox.",
  },
]

function mapWebhookMessage(raw: string): { type: "error" | "success"; display: string } | null {
  const lower = raw.toLowerCase()
  for (const rule of WEBHOOK_MESSAGE_MAP) {
    if (lower.includes(rule.match.toLowerCase())) {
      return { type: rule.type, display: rule.display }
    }
  }
  return null
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null

  if (!file || file.type !== "application/pdf") {
    return NextResponse.json({ error: "A valid PDF is required" }, { status: 400 })
  }

  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: "File exceeds 20 MB limit" }, { status: 400 })
  }

  const n8nFormData = new FormData()
  n8nFormData.append("File_Upload", file, file.name)
  n8nFormData.append("submittedBy", session.user?.email ?? "unknown")

  if (!process.env.N8N_WEBHOOK_URL) {
    return NextResponse.json({ error: "Webhook URL not configured" }, { status: 500 })
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), N8N_WAIT_MS)

  try {
    const n8nRes = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.N8N_WEBHOOK_SECRET}`,
      },
      body: n8nFormData,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const responseText = await n8nRes.text()

    // If nginx / n8n returned an HTML error page, treat as background processing
    if (responseText.trim().startsWith("<")) {
      return NextResponse.json({
        success: true,
        message: "Your BOQ has been submitted and is being processed. You will receive the pricing proposal via email shortly.",
      })
    }

    // Extract the raw text message (handles both JSON and plain text)
    let responseData: any = responseText
    try {
      responseData = JSON.parse(responseText)
    } catch {
      // Plain text — use as-is
    }

    const rawMessage =
      typeof responseData === "object" && responseData !== null && "message" in responseData
        ? String(responseData.message)
        : typeof responseData === "string"
        ? responseData.trim()
        : ""

    // Check against known webhook message patterns
    const mapped = rawMessage ? mapWebhookMessage(rawMessage) : null

    if (mapped) {
      if (mapped.type === "error") {
        return NextResponse.json({ error: mapped.display }, { status: 422 })
      }
      return NextResponse.json({ success: true, message: mapped.display })
    }

    // Fallback: unknown response
    if (!n8nRes.ok) {
      return NextResponse.json(
        { error: rawMessage || "Processing pipeline error. Please try again." },
        { status: n8nRes.status }
      )
    }

    // Unknown success — spread all fields for the response panel
    const clientPayload =
      typeof responseData === "object" && responseData !== null
        ? { success: true, message: rawMessage, ...(responseData as Record<string, unknown>) }
        : { success: true, message: rawMessage }

    return NextResponse.json(clientPayload)

  } catch (err: any) {
    clearTimeout(timeoutId)

    // AbortError means n8n is still running — workflow is fine, email will arrive
    if (err?.name === "AbortError") {
      return NextResponse.json({
        success: true,
        message: "Your BOQ has been submitted and is being processed. You will receive the pricing proposal via email shortly.",
      })
    }

    return NextResponse.json({ error: "Failed to connect to processing pipeline." }, { status: 502 })
  }
}
