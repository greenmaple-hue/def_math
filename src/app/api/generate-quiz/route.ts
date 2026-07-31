import { NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 60; // Set max duration for Vercel Hobby plan

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "dummy",
    });

    const body = await req.json();
    const { difficulty, count, chapter = "공통수학 2 - 도형의 방정식 - 도형의 이동(대칭이동, 평행이동)" } = body;

    if (!difficulty || !count) {
      return NextResponse.json({ error: "Missing difficulty or count" }, { status: 400 });
    }

    const systemPrompt = `
당신은 대한민국 고등학교 수학 교사입니다. 2022 개정 교육과정에 맞춘 고등학교 1학년 수준의 수학 문제를 출제해야 합니다.
주제: ${chapter}
요청받은 난이도 목록: [${difficulty}]
출제 문항 수: ${count}개

반드시 다음 조건을 지켜주세요:
1. 객관식 4지 선다형(1~4번)으로 출제하세요. 요청받은 난이도 목록 내에서 난이도를 골고루 섞어서 출제하세요.
2. 각 문제의 options 배열 길이는 정확히 4개여야 합니다.
3. correctAnswer는 정답의 인덱스(0부터 3까지)를 숫자로 입력하세요.
4. explanation에는 정답을 도출하는 친절한 풀이 과정을 작성하세요.
5. 수학 수식이나 좌표는 괄호나 텍스트로 읽기 편하게 작성하세요. (예: 점 (2, 3), 직선 y = x + 1 등)
6. **그림이나 그래프가 필요한 문제**의 경우, 문제 이해를 돕기 위해 HTML에 직접 삽입 가능한 형태의 <svg> 태그 문자열(viewBox 포함)을 'imageSvg' 필드에 작성하세요. 크기는 가급적 viewBox="0 0 200 200" 정도로 깔끔하게 맞춰주세요. 그림이 굳이 필요 없는 문제라면 'imageSvg' 필드에 null을 넣으세요.

응답은 오직 아래 JSON 구조와 정확히 일치해야 합니다:
{
  "questions": [
    {
      "id": 1,
      "difficulty": "난이도(예: 하)",
      "questionText": "문제 텍스트",
      "imageSvg": "<svg viewBox=\\"0 0 200 200\\">...</svg> 또는 null",
      "options": ["보기1", "보기2", "보기3", "보기4"],
      "correctAnswer": 0,
      "explanation": "해설 텍스트"
    }
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // GPT-4o-mini is cost-effective and capable
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `선택된 난이도(${difficulty})가 골고루 섞인 ${chapter} 문제 ${count}개를 JSON 형식으로 출제해 주세요.` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const aiMessage = response.choices[0].message.content;
    
    if (!aiMessage) {
      throw new Error("No content received from AI");
    }

    const parsedData = JSON.parse(aiMessage);
    
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("OpenAI Quiz Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz", details: error.message },
      { status: 500 }
    );
  }
}
