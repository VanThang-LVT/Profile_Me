export const initialProfileInfo = {
  fullName: "Lương Văn Thắng",
  title: "Software Engineer / Web Developer",
  university: "Trường Đại học Công nghệ Sài Gòn (STU)",
  major: "Công nghệ Thông tin",
  email: "vanthang.luong2k4@gmail.com",
  phone: "0372036292",
  location: "TP. Hồ Chí Minh, Việt Nam",
  avatar: "/avatar.png",
  bio: "Sinh viên vừa hoàn thành chương trình học ngành Công nghệ Thông tin, có kiến thức cơ bản về Java, React.js và MySQL. Đã từng thực hành xây dựng các dự án web nhỏ trong quá trình học. Mong muốn ứng tuyển vị trí Software Engineer Intern để rèn luyện kỹ năng lập trình thực tế, tích lũy kinh nghiệm làm việc chuyên nghiệp và sẵn sàng học hỏi các công nghệ mới theo yêu cầu của công ty.",
  github: "https://github.com/VanThang-LVT",
  linkedin: "https://linkedin.com",
  facebook: "https://www.facebook.com/vanthang.luong.560",
  skills: [
    { name: "React.js", level: 50, category: "Frontend" },
    { name: "JavaScript (ES6+)", level: 50, category: "Frontend" },
    { name: "HTML5 / CSS3", level: 60, category: "Frontend" },
    { name: "Java / Spring Boot", level: 70, category: "Backend" },
    { name: "MySQL", level: 70, category: "Database" },
    { name: "Git / GitHub / Postman", level: 70, category: "Tools" }
  ],
  interests: ["Lập trình Web","Software Engineer", "Back-End Development","Du lịch", 
    "Nghe nhạc", "Chơi game"]
};

// Dữ liệu bảng điểm học tập tự động trích xuất từ file Diem.xlsx (STU)
export const initialTranscriptData = {
  "subjects": [
    {
      "id": "subj-0",
      "code": "CS03042",
      "name": "Triển khai hệ thống thông tin",
      "credits": 3,
      "grade10": 8,
      "grade4": 3.5,
      "letter": "A",
      "semester": "Học kỳ 2 - Năm học 2025 - 2026"
    },
    { 
      "id": "subj-1",
      "code": "CS03043",
      "name": "Xây dựng phần mềm Web",
      "credits": 3,
      "grade10": 8,
      "grade4": 3.5,
      "letter": "A",
      "semester": "Học kỳ 2 - Năm học 2025 - 2026"
    },
    {
      "id": "subj-2",
      "code": "CS03057",
      "name": "AI cơ bản và ứng dụng",
      "credits": 3,
      "grade10": 9,
      "grade4": 4,
      "letter": "A+",
      "semester": "Học kỳ 2 - Năm học 2025 - 2026"
    },
    {
      "id": "subj-3",
      "code": "CS03153",
      "name": "Đồ án / Khóa luận tốt nghiệp",
      "credits": 5,
      "grade10": 7,
      "grade4": 3,
      "letter": "B",
      "semester": "Học kỳ 2 - Năm học 2025 - 2026"
    },
    {
      "id": "subj-4",
      "code": "CS09151",
      "name": "Thực tập tốt nghiệp",
      "credits": 4,
      "grade10": 8,
      "grade4": 3.5,
      "letter": "A",
      "semester": "Học kỳ 2 - Năm học 2025 - 2026"
    },
    {
      "id": "subj-5",
      "code": "CS03030",
      "name": "Đồ án Phân tích thiết kế hệ thống thông tin",
      "credits": 2,
      "grade10": 7,
      "grade4": 3,
      "letter": "B",
      "semester": "Học kỳ 1 - Năm học 2025 - 2026"
    },
    {
      "id": "subj-6",
      "code": "CS03033",
      "name": "Phát triển phần mềm nguồn mở",
      "credits": 3,
      "grade10": 7,
      "grade4": 3,
      "letter": "B",
      "semester": "Học kỳ 1 - Năm học 2025 - 2026"
    },
    {
      "id": "subj-7",
      "code": "CS03034",
      "name": "Thực hành Phát triển phần mềm nguồn mở",
      "credits": 1,
      "grade10": 10,
      "grade4": 4,
      "letter": "A+",
      "semester": "Học kỳ 1 - Năm học 2025 - 2026"
    },
    {
      "id": "subj-8",
      "code": "CS03036",
      "name": "Lập trình Web",
      "credits": 3,
      "grade10": 5,
      "grade4": 1.5,
      "letter": "D",
      "semester": "Học kỳ 1 - Năm học 2025 - 2026"
    },
    {
      "id": "subj-9",
      "code": "CS03038",
      "name": "Lập trình cho thiết bị di động",
      "credits": 3,
      "grade10": 9,
      "grade4": 4,
      "letter": "A+",
      "semester": "Học kỳ 1 - Năm học 2025 - 2026"
    },
    {
      "id": "subj-10",
      "code": "CS03039",
      "name": "Thực hành Lập trình Web",
      "credits": 1,
      "grade10": 9,
      "grade4": 4,
      "letter": "A+",
      "semester": "Học kỳ 1 - Năm học 2025 - 2026"
    },
    {
      "id": "subj-11",
      "code": "CS03041",
      "name": "Thực hành Lập trình cho thiết bị di động",
      "credits": 1,
      "grade10": 9,
      "grade4": 4,
      "letter": "A+",
      "semester": "Học kỳ 1 - Năm học 2025 - 2026"
    },
    {
      "id": "subj-12",
      "code": "CS03059",
      "name": "Thực tập Chuyên ngành",
      "credits": 3,
      "grade10": 9,
      "grade4": 4,
      "letter": "A+",
      "semester": "Học kỳ 1 - Năm học 2025 - 2026"
    },
    {
      "id": "subj-13",
      "code": "CS09010",
      "name": "Phân tích thiết kế hệ thống thông tin",
      "credits": 3,
      "grade10": 7,
      "grade4": 3,
      "letter": "B",
      "semester": "Học kỳ 1 - Năm học 2025 - 2026"
    },
    {
      "id": "subj-14",
      "code": "GS09012",
      "name": "Kỹ năng giao tiếp",
      "credits": 2,
      "grade10": 9,
      "grade4": 4,
      "letter": "A+",
      "semester": "Học kỳ 1 - Năm học 2025 - 2026"
    },
    {
      "id": "subj-15",
      "code": "GS19002",
      "name": "Tiếng Anh 2",
      "credits": 2,
      "grade10": 8,
      "grade4": 3.5,
      "letter": "A",
      "semester": "Học kỳ 3 - Năm học 2024 - 2025"
    },
    {
      "id": "subj-16",
      "code": "GS19003",
      "name": "Tiếng Anh 3",
      "credits": 2,
      "grade10": 6,
      "grade4": 2.5,
      "letter": "B-",
      "semester": "Học kỳ 3 - Năm học 2024 - 2025"
    },
    {
      "id": "subj-17",
      "code": "CS03013",
      "name": "Công nghệ phần mềm",
      "credits": 3,
      "grade10": 8,
      "grade4": 3.5,
      "letter": "A",
      "semester": "Học kỳ 2 - Năm học 2024 - 2025"
    },
    {
      "id": "subj-18",
      "code": "CS03017",
      "name": "Lập trình ứng dụng cơ sở dữ liệu",
      "credits": 3,
      "grade10": 5,
      "grade4": 1.5,
      "letter": "D",
      "semester": "Học kỳ 2 - Năm học 2024 - 2025"
    },
    {
      "id": "subj-19",
      "code": "CS03020",
      "name": "Quản trị cơ sở dữ liệu",
      "credits": 3,
      "grade10": 8,
      "grade4": 3.5,
      "letter": "A",
      "semester": "Học kỳ 2 - Năm học 2024 - 2025"
    },
    {
      "id": "subj-20",
      "code": "CS03023",
      "name": "Thương mại điện tử",
      "credits": 3,
      "grade10": 8,
      "grade4": 3.5,
      "letter": "A",
      "semester": "Học kỳ 2 - Năm học 2024 - 2025"
    },
    {
      "id": "subj-21",
      "code": "CS03027",
      "name": "Thực hành Hệ quản trị cơ sơ dữ liệu",
      "credits": 1,
      "grade10": 5,
      "grade4": 1.5,
      "letter": "D",
      "semester": "Học kỳ 2 - Năm học 2024 - 2025"
    },
    {
      "id": "subj-22",
      "code": "CS03028",
      "name": "Thực hành Lập trình ứng dụng cơ sở dữ liệu",
      "credits": 1,
      "grade10": 6,
      "grade4": 2.5,
      "letter": "B-",
      "semester": "Học kỳ 2 - Năm học 2024 - 2025"
    },
    {
      "id": "subj-23",
      "code": "CS03045",
      "name": "Kiểm thử phần mềm",
      "credits": 3,
      "grade10": 6,
      "grade4": 2.5,
      "letter": "B-",
      "semester": "Học kỳ 2 - Năm học 2024 - 2025"
    },
    {
      "id": "subj-24",
      "code": "CS03056",
      "name": "Thực tập nghề nghiệp",
      "credits": 1,
      "grade10": 8,
      "grade4": 3.5,
      "letter": "A",
      "semester": "Học kỳ 2 - Năm học 2024 - 2025"
    },
    {
      "id": "subj-25",
      "code": "CS09003",
      "name": "Nhập môn Web và ứng dụng",
      "credits": 3,
      "grade10": 6,
      "grade4": 2.5,
      "letter": "B-",
      "semester": "Học kỳ 2 - Năm học 2024 - 2025"
    },
    {
      "id": "subj-26",
      "code": "CS09004",
      "name": "Thực hành Nhập môn Web và ứng dụng",
      "credits": 1,
      "grade10": 8,
      "grade4": 3.5,
      "letter": "A",
      "semester": "Học kỳ 2 - Năm học 2024 - 2025"
    },
    {
      "id": "subj-27",
      "code": "CS03014",
      "name": "Đồ án tin học",
      "credits": 2,
      "grade10": 9,
      "grade4": 4,
      "letter": "A+",
      "semester": "Học kỳ 1 - Năm học 2024 - 2025"
    },
    {
      "id": "subj-28",
      "code": "CS03015",
      "name": "Lập trình hướng đối tượng",
      "credits": 3,
      "grade10": 7,
      "grade4": 3,
      "letter": "B",
      "semester": "Học kỳ 1 - Năm học 2024 - 2025"
    },
    {
      "id": "subj-29",
      "code": "CS03016",
      "name": "Thực hành Lập trình hướng đối tượng",
      "credits": 1,
      "grade10": 7,
      "grade4": 3,
      "letter": "B",
      "semester": "Học kỳ 1 - Năm học 2024 - 2025"
    },
    {
      "id": "subj-30",
      "code": "CS03022",
      "name": "Quản lý dự án",
      "credits": 3,
      "grade10": 5,
      "grade4": 1.5,
      "letter": "D",
      "semester": "Học kỳ 1 - Năm học 2024 - 2025"
    },
    {
      "id": "subj-31",
      "code": "CS03024",
      "name": "An ninh máy tính",
      "credits": 2,
      "grade10": 8,
      "grade4": 3.5,
      "letter": "A",
      "semester": "Học kỳ 1 - Năm học 2024 - 2025"
    },
    {
      "id": "subj-32",
      "code": "CS03025",
      "name": "Thực tập An ninh máy tính",
      "credits": 1,
      "grade10": 7,
      "grade4": 3,
      "letter": "B",
      "semester": "Học kỳ 1 - Năm học 2024 - 2025"
    },
    {
      "id": "subj-33",
      "code": "CS09009",
      "name": "Mạng máy tính",
      "credits": 3,
      "grade10": 6,
      "grade4": 2.5,
      "letter": "B-",
      "semester": "Học kỳ 1 - Năm học 2024 - 2025"
    },
    {
      "id": "subj-34",
      "code": "GS79009",
      "name": "Tư tưởng Hồ Chí Minh",
      "credits": 2,
      "grade10": 9,
      "grade4": 4,
      "letter": "A+",
      "semester": "Học kỳ 1 - Năm học 2024 - 2025"
    },
    {
      "id": "subj-35",
      "code": "CS09001",
      "name": "Nhập môn lập trình",
      "credits": 3,
      "grade10": 7,
      "grade4": 3,
      "letter": "B",
      "semester": "Học kỳ 3 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-36",
      "code": "MI03002",
      "name": "Giáo dục quốc phòng (ĐH)",
      "credits": 0,
      "grade10": 6.9,
      "grade4": 2.5,
      "letter": "B-",
      "semester": "Học kỳ 3 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-37",
      "code": "CS03007",
      "name": "Cấu trúc dữ liệu và thuật giải",
      "credits": 3,
      "grade10": 7,
      "grade4": 3,
      "letter": "B",
      "semester": "Học kỳ 2 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-38",
      "code": "CS03008",
      "name": "Cơ sở dữ liệu",
      "credits": 3,
      "grade10": 6,
      "grade4": 2.5,
      "letter": "B-",
      "semester": "Học kỳ 2 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-39",
      "code": "CS03009",
      "name": "Hệ điều hành",
      "credits": 3,
      "grade10": 7,
      "grade4": 3,
      "letter": "B",
      "semester": "Học kỳ 2 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-40",
      "code": "CS03010",
      "name": "Thực hành Cấu trúc dữ liệu và thuật giải",
      "credits": 1,
      "grade10": 6,
      "grade4": 2.5,
      "letter": "B-",
      "semester": "Học kỳ 2 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-41",
      "code": "CS03011",
      "name": "Thực hành Cơ sở dữ liệu",
      "credits": 1,
      "grade10": 5,
      "grade4": 1.5,
      "letter": "D",
      "semester": "Học kỳ 2 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-42",
      "code": "CS03012",
      "name": "Thực hành Hệ điều hành",
      "credits": 1,
      "grade10": 7,
      "grade4": 3,
      "letter": "B",
      "semester": "Học kỳ 2 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-43",
      "code": "CS03047",
      "name": "Nhập môn công tác kỹ sư",
      "credits": 2,
      "grade10": 5,
      "grade4": 1.5,
      "letter": "D",
      "semester": "Học kỳ 2 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-44",
      "code": "GS19004",
      "name": "Tiếng Anh 4",
      "credits": 2,
      "grade10": 5,
      "grade4": 1.5,
      "letter": "D",
      "semester": "Học kỳ 2 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-45",
      "code": "GS79008",
      "name": "Lịch sử Đảng Cộng sản Việt Nam",
      "credits": 2,
      "grade10": 8,
      "grade4": 3.5,
      "letter": "A",
      "semester": "Học kỳ 2 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-46",
      "code": "CS03003",
      "name": "Kỹ thuật lập trình",
      "credits": 3,
      "grade10": 8,
      "grade4": 3.5,
      "letter": "A",
      "semester": "Học kỳ 1 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-47",
      "code": "CS03004",
      "name": "Thực hành Kỹ thuật lập trình",
      "credits": 1,
      "grade10": 6,
      "grade4": 2.5,
      "letter": "B-",
      "semester": "Học kỳ 1 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-48",
      "code": "CS03005",
      "name": "Toán tin học",
      "credits": 3,
      "grade10": 6,
      "grade4": 2.5,
      "letter": "B-",
      "semester": "Học kỳ 1 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-49",
      "code": "CS09005",
      "name": "Nhập môn cấu trúc dữ liệu",
      "credits": 3,
      "grade10": 5,
      "grade4": 1.5,
      "letter": "D",
      "semester": "Học kỳ 1 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-50",
      "code": "CS09006",
      "name": "Tổ chức cấu trúc máy tính",
      "credits": 3,
      "grade10": 8,
      "grade4": 3.5,
      "letter": "A",
      "semester": "Học kỳ 1 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-51",
      "code": "CS09007",
      "name": "Thực hành Nhập môn cấu trúc dữ liệu",
      "credits": 1,
      "grade10": 6,
      "grade4": 2.5,
      "letter": "B-",
      "semester": "Học kỳ 1 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-52",
      "code": "CS09008",
      "name": "Thực hành Tổ chức cấu trúc máy tính",
      "credits": 1,
      "grade10": 6,
      "grade4": 2.5,
      "letter": "B-",
      "semester": "Học kỳ 1 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-53",
      "code": "GS19003",
      "name": "Tiếng Anh 3",
      "credits": 2,
      "grade10": 4,
      "grade4": 1,
      "letter": "F",
      "semester": "Học kỳ 1 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-54",
      "code": "GS29001",
      "name": "Pháp luật Việt Nam đại cương",
      "credits": 3,
      "grade10": 8,
      "grade4": 3.5,
      "letter": "A",
      "semester": "Học kỳ 1 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-55",
      "code": "GS33003",
      "name": "Toán A3 (Đại số tuyến tính)",
      "credits": 3,
      "grade10": 6,
      "grade4": 2.5,
      "letter": "B-",
      "semester": "Học kỳ 1 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-56",
      "code": "GS79007",
      "name": "Chủ nghĩa xã hội khoa học",
      "credits": 2,
      "grade10": 8,
      "grade4": 3.5,
      "letter": "A",
      "semester": "Học kỳ 1 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-57",
      "code": "GS93003",
      "name": "Giáo dục thể chất 3",
      "credits": 0,
      "grade10": 6,
      "grade4": 2.5,
      "letter": "B-",
      "semester": "Học kỳ 1 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-58",
      "code": "GS93004",
      "name": "Giáo dục thể chất 4",
      "credits": 0,
      "grade10": 6,
      "grade4": 2.5,
      "letter": "B-",
      "semester": "Học kỳ 1 - Năm học 2023 - 2024"
    },
    {
      "id": "subj-59",
      "code": "CS03001",
      "name": "Kỹ thuật số",
      "credits": 2,
      "grade10": 6,
      "grade4": 2.5,
      "letter": "B-",
      "semester": "Học kỳ 2 - Năm học 2022 - 2023"
    },
    {
      "id": "subj-60",
      "code": "CS03002",
      "name": "Thí nghiệm Kỹ thuật số",
      "credits": 1,
      "grade10": 10,
      "grade4": 4,
      "letter": "A+",
      "semester": "Học kỳ 2 - Năm học 2022 - 2023"
    },
    {
      "id": "subj-61",
      "code": "CS09001",
      "name": "Nhập môn lập trình",
      "credits": 3,
      "grade10": 4,
      "grade4": 1,
      "letter": "F",
      "semester": "Học kỳ 2 - Năm học 2022 - 2023"
    },
    {
      "id": "subj-62",
      "code": "CS09002",
      "name": "Thực hành Nhập môn lập trình",
      "credits": 1,
      "grade10": 6,
      "grade4": 2.5,
      "letter": "B-",
      "semester": "Học kỳ 2 - Năm học 2022 - 2023"
    },
    {
      "id": "subj-63",
      "code": "GS19002",
      "name": "Tiếng Anh 2",
      "credits": 2,
      "grade10": 4,
      "grade4": 1,
      "letter": "F",
      "semester": "Học kỳ 2 - Năm học 2022 - 2023"
    },
    {
      "id": "subj-64",
      "code": "GS33002",
      "name": "Toán A2 (Hàm nhiều biến, giải tích vec tơ)",
      "credits": 4,
      "grade10": 8,
      "grade4": 3.5,
      "letter": "A",
      "semester": "Học kỳ 2 - Năm học 2022 - 2023"
    },
    {
      "id": "subj-65",
      "code": "GS43002",
      "name": "Vật lý 2",
      "credits": 4,
      "grade10": 9,
      "grade4": 4,
      "letter": "A+",
      "semester": "Học kỳ 2 - Năm học 2022 - 2023"
    },
    {
      "id": "subj-66",
      "code": "GS49005",
      "name": "Thí nghiệm Vật lý_Phần 2",
      "credits": 1,
      "grade10": 7,
      "grade4": 3,
      "letter": "B",
      "semester": "Học kỳ 2 - Năm học 2022 - 2023"
    },
    {
      "id": "subj-67",
      "code": "GS79005",
      "name": "Triết học Mác - Lênin",
      "credits": 3,
      "grade10": 8,
      "grade4": 3.5,
      "letter": "A",
      "semester": "Học kỳ 2 - Năm học 2022 - 2023"
    },
    {
      "id": "subj-68",
      "code": "GS79006",
      "name": "Kinh tế chính trị Mác - Lênin",
      "credits": 2,
      "grade10": 8,
      "grade4": 3.5,
      "letter": "A",
      "semester": "Học kỳ 2 - Năm học 2022 - 2023"
    },
    {
      "id": "subj-69",
      "code": "GS99001",
      "name": "Giáo dục thể chất 1",
      "credits": 0,
      "grade10": 8,
      "grade4": 3.5,
      "letter": "A",
      "semester": "Học kỳ 2 - Năm học 2022 - 2023"
    },
    {
      "id": "subj-70",
      "code": "GS99002",
      "name": "Giáo dục thể chất 2",
      "credits": 0,
      "grade10": 8,
      "grade4": 3.5,
      "letter": "A",
      "semester": "Học kỳ 2 - Năm học 2022 - 2023"
    },
    {
      "id": "subj-71",
      "code": "GS19001",
      "name": "Tiếng Anh 1",
      "credits": 2,
      "grade10": 5,
      "grade4": 1.5,
      "letter": "D",
      "semester": "Học kỳ 1 - Năm học 2022 - 2023"
    },
    {
      "id": "subj-72",
      "code": "GS19005",
      "name": "Tiếng Anh đầu khóa",
      "credits": 0,
      "grade10": 0.5,
      "grade4": 0,
      "letter": "F",
      "semester": "Học kỳ 1 - Năm học 2022 - 2023"
    },
    {
      "id": "subj-73",
      "code": "GS33001",
      "name": "Toán A1 (Hàm 1 biến, chuỗi)",
      "credits": 4,
      "grade10": 6,
      "grade4": 2.5,
      "letter": "B-",
      "semester": "Học kỳ 1 - Năm học 2022 - 2023"
    },
    {
      "id": "subj-74",
      "code": "GS43001",
      "name": "Vật lý 1",
      "credits": 3,
      "grade10": 7,
      "grade4": 3,
      "letter": "B",
      "semester": "Học kỳ 1 - Năm học 2022 - 2023"
    },
    {
      "id": "subj-75",
      "code": "GS49004",
      "name": "Thí nghiệm Vật lý_Phần 1",
      "credits": 1,
      "grade10": 7,
      "grade4": 3,
      "letter": "B",
      "semester": "Học kỳ 1 - Năm học 2022 - 2023"
    },
    {
      "id": "subj-76",
      "code": "GS59001",
      "name": "Tin học đại cương",
      "credits": 2,
      "grade10": 7,
      "grade4": 3,
      "letter": "B",
      "semester": "Học kỳ 1 - Năm học 2022 - 2023"
    },
    {
      "id": "subj-77",
      "code": "GS59002",
      "name": "Thực hành Tin học đại cương",
      "credits": 2,
      "grade10": 8,
      "grade4": 3.5,
      "letter": "A",
      "semester": "Học kỳ 1 - Năm học 2022 - 2023"
    }
  ],
  "semesterTrends": [
    {
      "semester": "Học kỳ 1 2022 - 2023",
      "gpa10": 6.57,
      "gpa4": 2.71,
      "credits": 14
    },
    {
      "semester": "Học kỳ 2 2022 - 2023",
      "gpa10": 7.09,
      "gpa4": 2.91,
      "credits": 23
    },
    {
      "semester": "Học kỳ 1 2023 - 2024",
      "gpa10": 6.6,
      "gpa4": 2.7,
      "credits": 25
    },
    {
      "semester": "Học kỳ 2 2023 - 2024",
      "gpa10": 6.33,
      "gpa4": 2.53,
      "credits": 18
    },
    {
      "semester": "Học kỳ 3 2023 - 2024",
      "gpa10": 7,
      "gpa4": 3,
      "credits": 3
    },
    {
      "semester": "Học kỳ 1 2024 - 2025",
      "gpa10": 7.06,
      "gpa4": 2.94,
      "credits": 17
    },
    {
      "semester": "Học kỳ 2 2024 - 2025",
      "gpa10": 6.82,
      "gpa4": 2.82,
      "credits": 22
    },
    {
      "semester": "Học kỳ 3 2024 - 2025",
      "gpa10": 7,
      "gpa4": 3,
      "credits": 4
    },
    {
      "semester": "Học kỳ 1 2025 - 2026",
      "gpa10": 7.77,
      "gpa4": 3.3,
      "credits": 22
    },
    {
      "semester": "Học kỳ 2 2025 - 2026",
      "gpa10": 7.89,
      "gpa4": 3.44,
      "credits": 18
    }
  ],
  "totalCredits": 159,
  "overallGpa10": 7.16,
  "overallGpa4": 3.01,
  "classification": "Khá",
  "lastUpdated": "13/9/2026"
};

export const sampleProjects = [
  {
    id: "proj-1",
    title: "Website Hồ Sơ Cá Nhân & Quản Lý Bảng Điểm",
    description: "Hệ thống portfolio tương tác cho phép xem CV PDF trực tiếp và tự động phân tích file Excel bảng điểm học tập bằng React & SheetJS.",
    tags: ["React", "Tailwind CSS", "Recharts", "SheetJS", "Vite"],
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800",
    demoLink: "#",
    githubLink: "#"
  },
  {
    id: "proj-2",
    title: "Ứng dụng Quản lý Nhiệm vụ SmartTask",
    description: "Nền tảng quản lý dự án & công việc nhóm với tính năng Kanban Board, thông báo thời gian thực và báo cáo tiến độ trực quan.",
    tags: ["React", "Node.js", "Express", "MongoDB", "Socket.io"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    demoLink: "#",
    githubLink: "#"
  },
  {
    id: "proj-3",
    title: "Hệ thống Phân tích & Đề xuất Sản phẩm AI",
    description: "Mô hình Machine Learning phân tích hành vi người dùng và đưa ra gợi ý sản phẩm phù hợp với độ chính xác cao.",
    tags: ["Python", "FastAPI", "Scikit-Learn", "PostgreSQL"],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    demoLink: "#",
    githubLink: "#"
  }
];

export const experienceTimeline = [
  {
    period: "2024 - Hiện tại",
    role: "Lập trình viên Frontend (Intern/Junior)",
    company: "Công ty Công nghệ Thông tin",
    description: "Tham gia phát triển các sản phẩm Web Application cho khách hàng, tối ưu hóa tốc độ tải trang và xây dựng Reusable Components."
  },
  {
    period: "2022 - 2026",
    role: "Sinh viên Chuyên ngành Công nghệ Thông tin",
    company: "Trường Đại học Công nghệ Sài Gòn (STU)",
    description: "Đang theo học chuyên ngành Công nghệ thông tin (Dự kiến tốt nghiệp Tháng 11/2026)."
  }
];
