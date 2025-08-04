import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function GET() {
  return Response.json(
    { success: true, message: "Terimakasih" },
    { status: 200 }
  );
}

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid, coverImage } =
    await request.json();

  try {
    const { text: question } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Tolong buatkan daftar pertanyaan untuk wawancara kerja.
                Posisi yang dilamar adalah: ${role}.
                Tingkat pengalaman yang dibutuhkan adalah: ${level}.
                Teknologi atau tools yang digunakan dalam pekerjaan ini adalah: ${techstack}.
                Fokus pertanyaan lebih condong ke: ${type}.
                Jumlah pertanyaan yang dibutuhkan adalah: ${amount}.
                Mohon hanya tampilkan daftar pertanyaannya saja, tanpa teks tambahan lainnya.
                Pertanyaan-pertanyaan ini akan dibacakan oleh AI suara, jadi jangan gunakan karakter khusus seperti "/" atau "*" karena bisa menyebabkan masalah.
                Tampilkan pertanyaannya dengan format seperti ini:
                ["Pertanyaan 1", "Pertanyaan 2", "Pertanyaan 3"]

                Terima kasih! ❤️`,
    });

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(","),
      question: JSON.parse(question),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({success: true}, {status: 200});
  } catch (error) {
    console.error(error);

    return Response.json({ success: false, error }, { status: 400 });
  }
}
