import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await (req.json() as Promise<{ prompt: string }>);
    
    if (!prompt) return NextResponse.json({ error: "Missing prompt" }, { status: 400 });

    const lowerPrompt = prompt.toLowerCase();
    
    // Mock AI Logic based on keywords
    let suggestions = [
      { title: "Đọc 20 trang sách", category: "học tập", targetType: "daily", description: "Bồi dưỡng kiến thức mỗi ngày." },
      { title: "Tập thể dục 15 phút", category: "sức khỏe", targetType: "daily", description: "Vận động nhẹ nhàng cho ngày mới." },
      { title: "Ngủ trước 23h", category: "kỷ luật", targetType: "daily", description: "Giữ tinh thần sảng khoái vào sáng hôm sau." }
    ];

    if (lowerPrompt.includes("học") || lowerPrompt.includes("study")) {
      suggestions = [
        { title: "Giải 5 bài tập toán", category: "học tập", targetType: "daily", description: "Luyện tập tư duy mỗi ngày." },
        { title: "Học 10 từ vựng mới", category: "học tập", targetType: "daily", description: "Cải thiện vốn từ giao tiếp." },
        { title: "Tóm tắt bài học cuối ngày", category: "học tập", targetType: "daily", description: "Ghi nhớ kiến thức hiệu quả hơn." }
      ];
    } else if (lowerPrompt.includes("tiền") || lowerPrompt.includes("tiết kiệm")) {
      suggestions = [
        { title: "Ghi chép chi tiêu", category: "tài chính", targetType: "daily", description: "Kiểm soát dòng tiền cá nhân." },
        { title: "Để dành 20k tiết kiệm", category: "tài chính", targetType: "daily", description: "Tích tiểu thành đại cho tương lai." },
        { title: "Không ăn hàng quán vỉa hè", category: "tài chính", targetType: "daily", description: "Vừa sạch vừa tiết kiệm hơn." }
      ];
    } else if (lowerPrompt.includes("khỏe") || lowerPrompt.includes("gym") || lowerPrompt.includes("chạy")) {
      suggestions = [
        { title: "Chạy bộ 2km", category: "sức khỏe", targetType: "daily", description: "Cải thiện sức bền tim mạch." },
        { title: "Uống 2 lít nước", category: "sức khỏe", targetType: "daily", description: "Thải độc và làm đẹp da." },
        { title: "Hít đất 30 cái", category: "sức khỏe", targetType: "daily", description: "Tăng cường sức mạnh cơ bắp." }
      ];
    }

    // Fake a 1-second "AI thinking" delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ suggestions });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
