import './nutripage.css';
export default function NutriPage() {
  const nutrients = [
    { name: "탄수화물", status: "적정", current: 280, recommended: 324, unit: "g", color: "bg-[#4CAF50]" },
    { name: "단백질", status: "적정", current: 95, recommended: 81, unit: "g", color: "bg-[#4CAF50]" },
    { name: "지방", status: "적정", current: 45, recommended: 54, unit: "g", color: "bg-[#4CAF50]" },
    { name: "식이섬유", status: "부족", current: 18, recommended: 25, unit: "g", color: "bg-[#FB3F4A]" },
    { name: "나트륨", status: "초과", current: 2800, recommended: 2000, unit: "mg", color: "bg-[#FF9800]" },
    { name: "비타민C", status: "적정", current: 85, recommended: 100, unit: "mg", color: "bg-[#4CAF50]" },
    { name: "칼슘", status: "적정", current: 620, recommended: 700, unit: "mg", color: "bg-[#4CAF50]" },
    { name: "철분", status: "적정", current: 14, recommended: 14, unit: "mg", color: "bg-[#4CAF50]" }
  ];

  const getStatusColor = (status) => {
    if (status === "적정") return "text-[#4CAF50]";
    if (status === "부족") return "text-[#FB3F4A]";
    if (status === "초과") return "text-[#FF9800]";
  };

  const getPercentage = (current, recommended) => {
    return Math.min((current / recommended) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f4f8] via-[#f5f5f5] to-[#e8f4f8] p-8">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">오늘의 영양 분석</h1>
          <p className="text-gray-600 text-lg">권장 섭취량 대비 현재 섭취 상태를 확인하세요</p>
        </div>

        {/* 영양성분 카드 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">영양성분 분석</h2>
          
          <div className="space-y-8">
            {nutrients.map((nutrient, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-gray-900">{nutrient.name}</span>
                    <span className={`text-sm font-medium ${getStatusColor(nutrient.status)}`}>
                      {nutrient.status}
                    </span>
                  </div>
                  <span className="text-base text-gray-600">
                    <span className="font-semibold text-gray-900">{nutrient.current}</span> / {nutrient.recommended} {nutrient.unit}
                  </span>
                </div>
                
                {/* 프로그레스 바 */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${nutrient.color} transition-all duration-500`}
                    style={{ width: `${getPercentage(nutrient.current, nutrient.recommended)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 범례 */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">영양 상태 기준</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#FB3F4A]" />
              <span className="text-gray-700">부족: 80% 미만</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#4CAF50]" />
              <span className="text-gray-700">적정: 80-120%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#FF9800]" />
              <span className="text-gray-700">초과: 120% 이상</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}