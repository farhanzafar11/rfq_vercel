import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

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

  try {
    const n8nRes = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.N8N_WEBHOOK_SECRET}`,
      },
      body: n8nFormData,
    })

    const responseText = await n8nRes.text()
    let responseData: any = responseText
    try {
      responseData = JSON.parse(responseText)
    } catch {
      // It's just plain text
    }

    if (!n8nRes.ok) {
      const errorMessage = typeof responseData === 'object' && responseData !== null && 'message' in responseData ? String(responseData.message) : (typeof responseData === 'string' ? responseData : "Processing pipeline error. Try again.")
      return NextResponse.json({ error: errorMessage }, { status: n8nRes.status })
    }

    const successMessage = typeof responseData === 'object' && responseData !== null && 'message' in responseData ? String(responseData.message) : (typeof responseData === 'string' && responseData ? responseData : undefined)

    return NextResponse.json({ success: true, message: successMessage })
  } catch (err) {
    return NextResponse.json({ error: "Failed to connect to processing pipeline." }, { status: 502 })
  }
}
