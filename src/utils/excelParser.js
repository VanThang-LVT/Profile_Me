import * as XLSX from 'xlsx';

/**
 * Converts grade 10 to grade 4 and letter grade
 */
export const convertGrade = (grade10) => {
  const score = parseFloat(grade10);
  if (isNaN(score)) return { grade4: 0, letter: 'F' };
  
  if (score >= 8.5) return { grade4: 4.0, letter: 'A+' };
  if (score >= 8.0) return { grade4: 3.5, letter: 'A' };
  if (score >= 7.0) return { grade4: 3.0, letter: 'B' };
  if (score >= 6.5) return { grade4: 2.5, letter: 'B-' };
  if (score >= 5.5) return { grade4: 2.0, letter: 'C' };
  if (score >= 5.0) return { grade4: 1.5, letter: 'D+' };
  if (score >= 4.0) return { grade4: 1.0, letter: 'D' };
  return { grade4: 0.0, letter: 'F' };
};

/**
 * Parses uploaded Excel File into structured transcript object.
 * Automatically handles retaken subjects (Môn học lại / Cải thiện):
 * Keeps the HIGHEST grade per unique Subject Code for Cumulative GPA calculation.
 */
export const parseTranscriptExcel = (arrayBuffer) => {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
  
  if (!rows || rows.length === 0) {
    throw new Error("File Excel rỗng hoặc không có dữ liệu phù hợp.");
  }

  let currentSemester = 'Học kỳ 1';
  let codeIdx = -1, nameIdx = -1, creditIdx = -1, g10Idx = -1, g4Idx = -1, letterIdx = -1, semesterIdx = -1;
  
  const subjects = [];
  const semestersMap = {};

  rows.forEach((row, rowIndex) => {
    if (!row || row.length === 0) return;
    
    const rowStr = row.map(c => String(c || '').trim()).join(' ');
    const lowerRowStr = rowStr.toLowerCase();

    // 1. Detect Header Row
    if (lowerRowStr.includes('tên môn') || lowerRowStr.includes('tên mh') || lowerRowStr.includes('tên học phần')) {
      row.forEach((cell, idx) => {
        const c = String(cell || '').toLowerCase().trim();
        if (c.includes('mã')) codeIdx = idx;
        else if (c.includes('tên môn') || c.includes('tên mh') || c.includes('tên học phần')) nameIdx = idx;
        else if (c.includes('tín chỉ') || c.includes('stc') || c.includes('tc')) creditIdx = idx;
        else if (c.includes('(10)') || c.includes('điểm tk (10)') || c.includes('điểm 10') || c.includes('điểm tổng kết (10)')) g10Idx = idx;
        else if (c.includes('(4)') || c.includes('điểm tk (4)') || c.includes('điểm 4') || c.includes('điểm tổng kết (4)')) g4Idx = idx;
        else if (c.includes('(c)') || c.includes('chữ') || c.includes('xếp loại')) letterIdx = idx;
        else if (c.includes('học kỳ') || c.includes('hk')) semesterIdx = idx;
      });
      return;
    }

    // 2. Detect Semester Section Header
    const semCell = row.find(c => c && (String(c).toLowerCase().includes('học kỳ') || String(c).toLowerCase().includes('năm học')));
    if (semCell && row.filter(c => String(c || '').trim() !== '').length <= 3) {
      const semText = String(semCell).trim();
      if (semText.length > 3) {
        currentSemester = semText;
      }
      return;
    }

    // 3. Process Subject Data Row
    if (nameIdx !== -1 && row[nameIdx] !== undefined && row[nameIdx] !== null) {
      const name = String(row[nameIdx]).trim();
      
      if (!name || name.toLowerCase().includes('tên môn') || name.toLowerCase().includes('tổng cộng') || name.toLowerCase().includes('gpa')) {
        return;
      }

      const code = codeIdx !== -1 && row[codeIdx] ? String(row[codeIdx]).trim() : `MH${rowIndex}`;
      const credits = creditIdx !== -1 ? parseInt(row[creditIdx]) || 0 : 0;
      
      const g10 = g10Idx !== -1 ? parseFloat(row[g10Idx]) : NaN;
      let g4 = g4Idx !== -1 ? parseFloat(row[g4Idx]) : NaN;
      let letter = letterIdx !== -1 && row[letterIdx] ? String(row[letterIdx]).trim() : '';

      const semInRow = semesterIdx !== -1 && row[semesterIdx] ? String(row[semesterIdx]).trim() : '';
      const activeSemester = semInRow || currentSemester;

      if (!isNaN(g10) || !isNaN(g4)) {
        if (isNaN(g4) && !isNaN(g10)) {
          const converted = convertGrade(g10);
          g4 = converted.grade4;
          if (!letter) letter = converted.letter;
        } else if (!letter && !isNaN(g4)) {
          const converted = convertGrade(g10 || g4 * 2.5);
          letter = converted.letter;
        }

        const subjectItem = {
          id: `subj-${subjects.length}`,
          code,
          name,
          credits,
          grade10: isNaN(g10) ? 0 : g10,
          grade4: isNaN(g4) ? 0 : g4,
          letter: letter || 'B',
          semester: activeSemester
        };

        subjects.push(subjectItem);

        if (credits > 0) {
          if (!semestersMap[activeSemester]) {
            semestersMap[activeSemester] = { name: activeSemester, totalCredits: 0, sumScore10: 0, sumScore4: 0 };
          }
          semestersMap[activeSemester].totalCredits += credits;
          if (!isNaN(g10)) semestersMap[activeSemester].sumScore10 += g10 * credits;
          if (!isNaN(g4)) semestersMap[activeSemester].sumScore4 += g4 * credits;
        }
      }
    }
  });

  if (subjects.length === 0) {
    throw new Error("Không tìm thấy dữ liệu môn học hợp lệ. Vui lòng kiểm tra lại cấu trúc file Excel.");
  }

  // Deduplicate retaken subjects: Keep HIGHEST grade per unique Subject Code for Cumulative GPA
  const bestSubjectsMap = {};
  subjects.forEach(s => {
    if (!s.code) return;
    const existing = bestSubjectsMap[s.code];
    if (!existing || s.grade4 > existing.grade4) {
      bestSubjectsMap[s.code] = s;
    }
  });

  const bestValidSubjects = Object.values(bestSubjectsMap).filter(s => s.credits > 0);

  // Cumulative stats calculated strictly on highest attempts
  const totalCredits = bestValidSubjects.reduce((sum, s) => sum + s.credits, 0);
  const sumScore10 = bestValidSubjects.reduce((sum, s) => sum + (s.grade10 * s.credits), 0);
  const sumScore4 = bestValidSubjects.reduce((sum, s) => sum + (s.grade4 * s.credits), 0);

  const overallGpa10 = +(sumScore10 / (totalCredits || 1)).toFixed(2);
  const overallGpa4 = +(sumScore4 / (totalCredits || 1)).toFixed(2);

  let classification = 'Xuất sắc';
  if (overallGpa4 < 2.0) classification = 'Trung bình';
  else if (overallGpa4 < 2.5) classification = 'Trung bình Khá';
  else if (overallGpa4 < 3.2) classification = 'Khá';
  else if (overallGpa4 < 3.6) classification = 'Giỏi';

  // Semester Trends for Recharts (Order chronological)
  const semesterTrends = Object.values(semestersMap).reverse().map(s => ({
    semester: s.name.replace(' - Năm học ', ' '),
    gpa10: +(s.sumScore10 / (s.totalCredits || 1)).toFixed(2),
    gpa4: +(s.sumScore4 / (s.totalCredits || 1)).toFixed(2),
    credits: s.totalCredits
  }));

  return {
    subjects,
    semesterTrends,
    totalCredits,
    overallGpa10,
    overallGpa4,
    classification,
    lastUpdated: new Date().toLocaleDateString('vi-VN')
  };
};

/**
 * Generates sample Excel template
 */
export const generateExcelTemplate = () => {
  const templateData = [
    { "Mã MH": "CS03042", "Tên môn học": "Triển khai hệ thống thông tin", "Số tín chỉ": 3, "Điểm TK (10)": 8.0, "Điểm TK (4)": 3.5, "Điểm TK (C)": "A", "Học kỳ": "Học kỳ 2 - Năm học 2025 - 2026" },
    { "Mã MH": "CS03043", "Tên môn học": "Xây dựng phần mềm Web", "Số tín chỉ": 3, "Điểm TK (10)": 8.0, "Điểm TK (4)": 3.5, "Điểm TK (C)": "A", "Học kỳ": "Học kỳ 2 - Năm học 2025 - 2026" },
    { "Mã MH": "CS03057", "Tên môn học": "AI cơ bản và ứng dụng", "Số tín chỉ": 3, "Điểm TK (10)": 9.0, "Điểm TK (4)": 4.0, "Điểm TK (C)": "A+", "Học kỳ": "Học kỳ 2 - Năm học 2025 - 2026" }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "BangDiemDiemXlsx");
  
  XLSX.writeFile(workbook, "Mau_Bang_Diem_Hoc_Tap.xlsx");
};
