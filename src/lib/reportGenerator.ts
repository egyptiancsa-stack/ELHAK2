import { Country } from './types';

function openPdfPrint(html: string) {
  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
    setTimeout(() => {
      win.print();
    }, 600);
  }
}

function downloadHtmlFile(html: string, filename: string) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadCsvFile(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadDocxFile(htmlContent: string, filename: string) {
  const docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>AHRI Human Rights Report</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'Times New Roman', Arial, sans-serif; line-height: 1.6; color: #16264f; padding: 40px; }
        h1, h2, h3, h4 { color: #0d1730; font-family: 'Arial', sans-serif; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 11px; }
        .badge-green { background-color: #dcfce7; color: #15803d; }
        .badge-orange { background-color: #ffedd5; color: #c2410c; }
        .badge-red { background-color: #fee2e2; color: #b91c1c; }
        .badge-gray { background-color: #f1f5f9; color: #475569; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
        th, td { border: 1px solid #cbd5e1; padding: 12px; text-align: right; }
        th { background-color: #f8fafc; font-weight: bold; }
        .cover-page { text-align: center; padding: 80px 40px; border: 4px double #334155; margin-bottom: 40px; page-break-after: always; }
        .bar-container { background-color: #f1f5f9; height: 12px; border-radius: 6px; width: 100%; position: relative; margin-top: 5px; }
        .bar-fill { height: 12px; border-radius: 6px; }
      </style>
    </head>
    <body style="direction: rtl;">
      ${htmlContent}
    </body>
    </html>
  `;
  const blob = new Blob(['\ufeff' + docHtml], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getBaseTemplate(title: string, content: string, dir: 'rtl' | 'ltr' = 'rtl') {
  return `
<!DOCTYPE html>
<html lang="ar" dir="${dir}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
  
  body { 
    font-family: 'Cairo', 'Inter', system-ui, sans-serif; 
    line-height: 1.7; 
    color: #16264f; 
    max-width: 1000px; 
    margin: 0 auto; 
    padding: 2.5rem; 
    background: #f8fafc; 
  }
  
  .document-container {
    background: #ffffff;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
    border-radius: 20px;
    padding: 3rem;
    border: 1px solid #e2e8f0;
  }

  h1, h2, h3, h4 { color: #0d1730; font-weight: 700; margin-top: 2rem; }
  h1 { font-size: 2.5rem; line-height: 1.2; }
  h2 { font-size: 1.8rem; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin-bottom: 1.5rem; }
  h3 { font-size: 1.3rem; color: #1e3a8a; }
  
  p { margin-bottom: 1.2rem; text-align: justify; }

  table { width: 100%; border-collapse: collapse; margin-block: 2rem; font-size: 0.95rem; }
  th, td { border: 1px solid #e2e8f0; padding: 1rem; text-align: right; }
  th { background-color: #f1f5f9; color: #16264f; font-weight: 700; }
  tr:nth-child(even) td { background-color: #f8fafc; }
  
  .cover-page {
    text-align: center; 
    padding: 120px 50px; 
    background: linear-gradient(135deg, #0d1730 0%, #16264f 100%); 
    color: #ffffff; 
    border-radius: 16px; 
    margin-bottom: 4rem; 
    page-break-after: always; 
    border: 4px double #3b82f6;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 750px;
  }
  
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 9999px;
    font-weight: 700;
    font-size: 0.8rem;
  }
  
  .badge-green { background-color: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
  .badge-lime { background-color: #ecfccb; color: #4d7c0f; border: 1px solid #d9f99d; }
  .badge-yellow { background-color: #fef9c3; color: #a16207; border: 1px solid #fef08a; }
  .badge-orange { background-color: #ffedd5; color: #c2410c; border: 1px solid #fed7aa; }
  .badge-red { background-color: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
  .badge-gray { background-color: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
  
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
  }
  .dot-green { background-color: #14b8a6; }
  .dot-lime { background-color: #84cc16; }
  .dot-yellow { background-color: #facc15; }
  .dot-orange { background-color: #fb923c; }
  .dot-red { background-color: #ef4444; }
  .dot-gray { background-color: #94a3b8; }
  .dot-green { background-color: #22c55e; box-shadow: 0 0 8px #22c55e; }
  .dot-orange { background-color: #f97316; box-shadow: 0 0 8px #f97316; }
  .dot-red { background-color: #ef4444; box-shadow: 0 0 8px #ef4444; }
  .dot-gray { background-color: #94a3b8; }

  .bar-container { background-color: #e2e8f0; height: 10px; border-radius: 9999px; width: 100%; position: relative; margin-top: 8px; }
  .bar-fill { height: 100%; border-radius: 9999px; }
  
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-block: 2rem;
  }
  
  @media (max-width: 768px) {
    .grid-2 { grid-template-columns: 1fr; }
    body { padding: 1rem; }
    .document-container { padding: 1.5rem; }
  }

  .footer { 
    text-align: center; 
    margin-top: 5rem; 
    padding-top: 2rem; 
    border-top: 2px dashed #e2e8f0; 
    font-size: 0.85rem; 
    color: #64748b; 
  }
  
  .academic-note {
    background-color: #eff6ff;
    border-right: 4px solid #3b82f6;
    padding: 1.5rem;
    border-radius: 8px;
    margin-block: 2rem;
    font-size: 0.95rem;
  }

  @media print {
    body { background: #fff; padding: 0; }
    .document-container { border: none; box-shadow: none; padding: 0; }
    .page-break { page-break-after: always; }
  }
</style>
</head>
<body>
  <div class="document-container">
    ${content}
    <div class="footer">
      <p>طورت هذه التقارير بالكامل عبر منصة المؤشر الأفريقي لحقوق الإنسان (AHRI)</p>
      <p style="margin-top: 4px;">مؤسسة الحق لحقوق الإنسان • <a href="http://www.elhak.org" style="color: #3b82f6; text-decoration: none;">www.elhak.org</a> • info@elhak.org</p>
      <p style="font-size: 11px; color: #94a3b8; margin-top: 8px;">جميع الحقوق محفوظة © ${new Date().getFullYear()}</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function generateSingleCountryReport(country: Country, format: 'pdf' | 'html' | 'csv' | 'docx') {
  if (format === 'csv') {
    const csvRows = [
      ['Metric', 'Value'],
      ['Country', country.name],
      ['Region', country.region],
      ['Is Evaluated', country.isEvaluated ? 'Yes' : 'No'],
      ['Overall Score', country.isEvaluated ? country.democracyScore : 'N/A'],
      ['Structural Indicators', country.isEvaluated ? country.indicators.structural : 'N/A'],
      ['Process Indicators', country.isEvaluated ? country.indicators.process : 'N/A'],
      ['Outcome Indicators', country.isEvaluated ? country.indicators.outcome : 'N/A'],
      ['Civil and Political Rights', country.isEvaluated ? country.indicators.civilPolitical : 'N/A'],
      ['Freedom of Opinion and Expression', country.isEvaluated ? country.indicators.opinionExpression : 'N/A'],
      ['Economic and Social Rights', country.isEvaluated ? country.indicators.economicSocial : 'N/A'],
      ['Rights of Vulnerable Groups', country.isEvaluated ? country.indicators.vulnerableGroups : 'N/A'],
      ['Right to Assembly and Organization', country.isEvaluated ? country.indicators.assemblyOrganization : 'N/A'],
      ['Right to Justice', country.isEvaluated ? country.indicators.justice : 'N/A'],
    ];
    const csvContent = csvRows.map(e => e.map(s => `"${String(s).replace(/"/g, '""')}"`).join(',')).join('\n');
    downloadCsvFile(csvContent, `${country.name.toLowerCase().replace(/\s+/g, '_')}_ahri_data.csv`);
    return;
  }

  // Calculate score level
  let levelClass = 'badge-gray';
  let levelText = 'غير مقيم / Not Evaluated';
  let levelDot = 'dot-gray';
  if (country.isEvaluated) {
    if (country.democracyScore >= 0.90) {
      levelClass = 'badge-green';
      levelText = 'ممتاز / Excellent';
      levelDot = 'dot-green';
    } else if (country.democracyScore >= 0.75) {
      levelClass = 'badge-lime';
      levelText = 'جيد جداً / Very Good';
      levelDot = 'dot-lime';
    } else if (country.democracyScore >= 0.60) {
      levelClass = 'badge-yellow';
      levelText = 'جيد / Good';
      levelDot = 'dot-yellow';
    } else if (country.democracyScore >= 0.45) {
      levelClass = 'badge-orange';
      levelText = 'مقبول / Acceptable';
      levelDot = 'dot-orange';
    } else {
      levelClass = 'badge-red';
      levelText = 'ضعيف جداً / Very Weak';
      levelDot = 'dot-red';
    }
  }

  const scoreDisplay = country.isEvaluated ? `${country.democracyScore}/1.00` : 'لم يتم تقييمها بعد / Not Evaluated';

  const coverHtml = `
    <div class="cover-page">
      <div style="text-align: right; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; gap: 15px;">
           <img src="https://elhak.org/wp-content/uploads/2025/04/cropped-1.png" alt="El Hak Foundation" style="height: 60px; object-fit: contain;" onerror="this.style.display='none'" />
           <img src="/ahri_logo.png" alt="AHRI Logo" style="height: 60px; object-fit: contain;" onerror="this.style.display='none'" />
        </div>
        <div>
          <span style="font-weight: 800; font-size: 1.4rem; color: #3b82f6;">مؤسسة الحق لحقوق الإنسان</span>
          <div style="font-size: 0.8rem; color: #94a3b8; font-family: sans-serif; margin-top: 4px;">ELHAK FOUNDATION FOR HUMAN RIGHTS</div>
        </div>
      </div>
      
      <div style="margin-block: auto; padding: 50px 0;">
        <p style="color: #60a5fa; font-weight: 700; letter-spacing: 2px; font-size: 1.1rem; margin-bottom: 15px; text-transform: uppercase;">تقرير الحالة الفردي للمؤشر الأفريقي</p>
        <h1 style="font-size: 4rem; font-weight: 800; color: #ffffff; margin: 0 0 20px 0;">${country.name}</h1>
        <div style="width: 100px; height: 5px; background-color: #3b82f6; margin: 25px auto; border-radius: 2px;"></div>
        <p style="font-size: 1.3rem; color: #cbd5e1; max-width: 700px; margin: 0 auto; line-height: 1.8;">
          تقييم شامل ومستند لبيانات الأداء الحقوقي والمؤشرات الديمقراطية للدولة لعام ${new Date().getFullYear()}
        </p>
      </div>

      <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 30px; display: flex; justify-content: space-between; align-items: end; text-align: right;">
        <div>
          <p style="margin: 0; color: #94a3b8; font-size: 0.9rem;">تاريخ الإصدار</p>
          <p style="margin: 4px 0 0 0; color: #ffffff; font-weight: bold; font-size: 1.1rem;">${new Date().toLocaleDateString('ar-EG')}</p>
        </div>
        <div>
          <p style="margin: 0; color: #94a3b8; font-size: 0.9rem; text-align: left;">الموقع الرسمي للمؤسسة</p>
          <a href="http://www.elhak.org" target="_blank" style="margin: 4px 0 0 0; display: block; color: #3b82f6; font-weight: bold; font-size: 1.1rem; text-decoration: none; text-align: left;">www.elhak.org</a>
        </div>
      </div>
    </div>
  `;

  const reportBody = `
    <div class="page-break"></div>
    
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px;">
      <h2 style="margin: 0; border: none; padding: 0;">نتائج تقييم الدولة: ${country.name}</h2>
      <span class="badge ${levelClass}">
        <span class="dot ${levelDot}"></span>
        ${levelText}
      </span>
    </div>

    <div class="academic-note">
      <strong>ملاحظة منهجية للباحثين:</strong> يرجى مراعاة أن درجات المؤشر مقسمة على ثلاثة محاور رئيسية (مؤشرات البنية والمؤشرات العملية ومؤشرات النتائج) لضمان دقة الرصد الإحصائي، وتجنب الخلط مع المجهود الدبلوماسي أو السياسي لضمان تقييم علمي مجرد.
    </div>

    <div class="grid-2">
      <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0;">
        <h3 style="margin-top: 0; margin-bottom: 15px;">الملخص الإحصائي العام</h3>
        <p><strong>الدولة المقيمة:</strong> ${country.name}</p>
        <p><strong>الإقليم الجغرافي:</strong> ${country.region}</p>
        <p><strong>مستوى التقييم الإجمالي:</strong> <span style="font-size: 1.3rem; font-weight: 800; color: #1e3a8a;">${scoreDisplay}</span></p>
        <p><strong>حالة التقييم:</strong> ${country.isEvaluated ? '<span style="color: #16a34a; font-weight: bold;">مكتمل وموثق</span>' : '<span style="color: #64748b; font-weight: bold; font-style: italic;">لم يتم تقييمها بعد</span>'}</p>
      </div>
      
      <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; justify-content: center;">
        <h3 style="margin-top: 0; margin-bottom: 10px;">توزيع الأداء العام</h3>
        <p style="font-size: 0.9rem; color: #475569; margin-bottom: 15px;">تم احتساب النسبة المئوية الموزونة بناءً على رصد التشريعات والالتزامات والممارسات الفعلية في السلطات التنفيذية والقضائية.</p>
      </div>
    </div>

    <h3>أولاً: أبعاد ومؤشرات التقرير الأفريقي الرئيسية</h3>
    <p>تنقسم مؤشرات القياس العامة إلى ثلاثة أبعاد ديناميكية تتيح رصد هيكل القوانين والمسارات الإجرائية المتبعة وصولاً إلى النتائج الملموسة على أرض الواقع:</p>
    
    <table>
      <thead>
        <tr>
          <th>المؤشر المرجعي الرئيسي (Main Dimension)</th>
          <th style="width: 150px;">النسبة المحققة (/1.00)</th>
          <th>المسار البياني للمؤشر</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>المؤشرات الهيكلية (Structural Indicators)</strong></td>
          <td style="font-weight: bold; color: #2563eb;">${country.isEvaluated ? `${country.indicators.structural}` : 'N/A'}</td>
          <td>
            <div class="bar-container">
              <div class="bar-fill" style="width: ${country.isEvaluated ? (country.indicators.structural || 0) * 100 : 0}%; background-color: #3b82f6;"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>مؤشرات العمليات والمسارات (Process Indicators)</strong></td>
          <td style="font-weight: bold; color: #6366f1;">${country.isEvaluated ? `${country.indicators.process}` : 'N/A'}</td>
          <td>
            <div class="bar-container">
              <div class="bar-fill" style="width: ${country.isEvaluated ? (country.indicators.process || 0) * 100 : 0}%; background-color: #6366f1;"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>مؤشرات النتائج والأثر الملموس (Outcome Indicators)</strong></td>
          <td style="font-weight: bold; color: #a855f7;">${country.isEvaluated ? `${country.indicators.outcome}` : 'N/A'}</td>
          <td>
            <div class="bar-container">
              <div class="bar-fill" style="width: ${country.isEvaluated ? (country.indicators.outcome || 0) * 100 : 0}%; background-color: #a855f7;"></div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="page-break"></div>

    <h3>ثانياً: التحليل التفصيلي بحسب فئات الحقوق والحريات</h3>
    <p>يتناول هذا القسم قياس الممارسة الفعلية في ست أبواب تفصيلية تمثل العهد الدولي الخاص بالحقوق المدنية والسياسية والمواثيق الأفريقية لحقوق الإنسان:</p>

    <table>
      <thead>
        <tr>
          <th>فئة الحقوق الأساسية (Rights Categories)</th>
          <th style="width: 150px;">الدرجة المحققة (/1.00)</th>
          <th>مستوى الضمان والحرية</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>الحقوق المدنية والسياسية الأساسية</strong></td>
          <td style="font-weight: bold;">${country.isEvaluated ? country.indicators.civilPolitical : 'N/A'}</td>
          <td>
            <div class="bar-container">
              <div class="bar-fill" style="width: ${country.isEvaluated ? (country.indicators.civilPolitical || 0) * 100 : 0}%; background-color: #2563eb;"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>حرية الرأي والتعبير وتداول المعلومات</strong></td>
          <td style="font-weight: bold;">${country.isEvaluated ? country.indicators.opinionExpression : 'N/A'}</td>
          <td>
            <div class="bar-container">
              <div class="bar-fill" style="width: ${country.isEvaluated ? (country.indicators.opinionExpression || 0) * 100 : 0}%; background-color: #f97316;"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>الحقوق الاقتصادية والاجتماعية والثقافية</strong></td>
          <td style="font-weight: bold;">${country.isEvaluated ? country.indicators.economicSocial : 'N/A'}</td>
          <td>
            <div class="bar-container">
              <div class="bar-fill" style="width: ${country.isEvaluated ? (country.indicators.economicSocial || 0) * 100 : 0}%; background-color: #14b8a6;"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>حقوق الفئات الأولى بالرعاية والمستضعفة</strong></td>
          <td style="font-weight: bold;">${country.isEvaluated ? country.indicators.vulnerableGroups : 'N/A'}</td>
          <td>
            <div class="bar-container">
              <div class="bar-fill" style="width: ${country.isEvaluated ? (country.indicators.vulnerableGroups || 0) * 100 : 0}%; background-color: #a855f7;"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>الحق في التجمع السلمي وتكوين الجمعيات</strong></td>
          <td style="font-weight: bold;">${country.isEvaluated ? country.indicators.assemblyOrganization : 'N/A'}</td>
          <td>
            <div class="bar-container">
              <div class="bar-fill" style="width: ${country.isEvaluated ? (country.indicators.assemblyOrganization || 0) * 100 : 0}%; background-color: #eab308;"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td><strong>الحق في المحاكمة العادلة والوصول للعدالة</strong></td>
          <td style="font-weight: bold;">${country.isEvaluated ? country.indicators.justice : 'N/A'}</td>
          <td>
            <div class="bar-container">
              <div class="bar-fill" style="width: ${country.isEvaluated ? (country.indicators.justice || 0) * 100 : 0}%; background-color: #ea1c0e;"></div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="academic-note" style="background-color: #fef2f2; border-right-color: #ef4444; margin-top: 30px;">
      <strong>توصية التقرير الفردي:</strong> بناءً على الأرقام الواردة، يوصى بتمكين الهيئات الحقوقية من ممارسة الرقابة الوقائية وتفعيل دور لجان المظالم ورفع القيود المفروضة على تأسيس وعمل الجمعيات الأهلية لرفع مؤشر الأثر الملموس.
    </div>
  `;

  if (format === 'docx') {
    downloadDocxFile(coverHtml + reportBody, `${country.name.toLowerCase().replace(/\s+/g, '_')}_ahri_report.doc`);
  } else {
    const html = getBaseTemplate(`${country.name} - Human Rights Report`, coverHtml + reportBody, 'rtl');
    if (format === 'pdf') {
      openPdfPrint(html);
    } else {
      downloadHtmlFile(html, `${country.name.toLowerCase().replace(/\s+/g, '_')}_ahri_report.html`);
    }
  }
}

export function generateCollectiveReport(countries: Country[], format: 'pdf' | 'html' | 'csv' | 'docx') {
  if (format === 'csv') {
    const headers = [
      'Country', 'Region', 'Is Evaluated', 'Overall Score', 
      'Structural', 'Process', 'Outcome',
      'Civil & Political Rights', 'Freedom of Opinion', 'Economic & Social Rights',
      'Vulnerable Groups', 'Assembly & Organization', 'Justice'
    ];
    
    const rows = countries.sort((a, b) => {
      if (a.isEvaluated && b.isEvaluated) return b.democracyScore - a.democracyScore;
      if (a.isEvaluated) return -1;
      if (b.isEvaluated) return 1;
      return a.name.localeCompare(b.name);
    }).map(c => [
      c.name, c.region, c.isEvaluated ? 'Yes' : 'No', 
      c.isEvaluated ? c.democracyScore : 'N/A',
      c.isEvaluated ? c.indicators.structural : 'N/A',
      c.isEvaluated ? c.indicators.process : 'N/A',
      c.isEvaluated ? c.indicators.outcome : 'N/A',
      c.isEvaluated ? c.indicators.civilPolitical : 'N/A',
      c.isEvaluated ? c.indicators.opinionExpression : 'N/A',
      c.isEvaluated ? c.indicators.economicSocial : 'N/A',
      c.isEvaluated ? c.indicators.vulnerableGroups : 'N/A',
      c.isEvaluated ? c.indicators.assemblyOrganization : 'N/A',
      c.isEvaluated ? c.indicators.justice : 'N/A',
    ]);
    
    const csvRows = [headers, ...rows];
    const csvContent = csvRows.map(e => e.map(s => `"${String(s).replace(/"/g, '""')}"`).join(',')).join('\n');
    downloadCsvFile(csvContent, `ahri_collective_data_${new Date().toISOString().split('T')[0]}.csv`);
    return;
  }

  // Cover Page (صفحة افتتاحية أولى)
  const coverHtml = `
    <div class="cover-page" style="border-color: #cb9243;">
      <div style="text-align: right; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; gap: 15px;">
           <img src="https://elhak.org/wp-content/uploads/2025/04/cropped-1.png" alt="El Hak Foundation" style="height: 60px; object-fit: contain;" onerror="this.style.display='none'" />
           <img src="/ahri_logo.png" alt="AHRI Logo" style="height: 60px; object-fit: contain;" onerror="this.style.display='none'" />
        </div>
        <div>
          <span style="font-weight: 800; font-size: 1.5rem; color: #cb9243;">مؤسسة الحق لحقوق الإنسان</span>
          <div style="font-size: 0.85rem; color: #94a3b8; font-family: sans-serif; margin-top: 4px;">ELHAK FOUNDATION FOR HUMAN RIGHTS</div>
        </div>
      </div>
      
      <div style="margin-block: auto; padding: 40px 0;">
        <p style="color: #34d399; font-weight: 700; letter-spacing: 3px; font-size: 1.2rem; margin-bottom: 15px; text-transform: uppercase;">المؤشر الأفريقي لحقوق الإنسان (AHRI)</p>
        <h1 style="font-size: 3.5rem; font-weight: 800; color: #ffffff; margin: 0 0 25px 0; line-height: 1.3;">التقرير التحليلي القاري المستند للمؤشرات</h1>
        <h2 style="font-size: 1.6rem; color: #cb9243; font-weight: 500; border: none; padding: 0; margin-bottom: 30px;">إصدار التقييم والتحليل المقارن السنوي لعام ${new Date().getFullYear()}</h2>
        <div style="width: 120px; height: 5px; background-color: #ea1c0e; margin: 25px auto; border-radius: 2px;"></div>
        <p style="font-size: 1.2rem; color: #cbd5e1; max-width: 800px; margin: 0 auto; line-height: 1.8;">
          دراسة مقارنة ورصد رقمي منهجي للأوضاع الدستورية والتشريعية والمسارات الإجرائية والممارسات الميدانية لحقوق الإنسان عبر الدول الأفريقية.
        </p>
      </div>

      <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 30px; display: flex; justify-content: space-between; align-items: end; text-align: right;">
        <div>
          <p style="margin: 0; color: #94a3b8; font-size: 0.9rem;">إصدار أكاديمي سنوي موثق</p>
          <p style="margin: 4px 0 0 0; color: #ffffff; font-weight: bold; font-size: 1.1rem;">مؤسسة الحق • Elhak Foundation</p>
        </div>
        <div>
          <p style="margin: 0; color: #94a3b8; font-size: 0.9rem; text-align: left;">البوابة الرقمية للمؤشر</p>
          <a href="http://www.elhak.org" target="_blank" style="margin: 4px 0 0 0; display: block; color: #ea1c0e; font-weight: bold; font-size: 1.1rem; text-decoration: none; text-align: left;">www.elhak.org</a>
        </div>
      </div>
    </div>
  `;

  // Page 2: Introduction and Methodology (صفحة افتتاحية ثانية)
  const introHtml = `
    <div class="page-break"></div>
    <div style="border-bottom: 2px solid #cb9243; padding-bottom: 12px; margin-bottom: 25px;">
      <h2 style="margin: 0; border: none; padding: 0; color: #0d1730;">مقدمة التقرير والمنهجية العلمية للمؤشر</h2>
    </div>
    
    <div class="grid-2">
      <div>
        <h3 style="margin-top: 0; color: #1e3b8b;">تمهيد وإطار فلسفي</h3>
        <p style="font-size: 0.95rem; line-height: 1.8; text-align: justify;">
          يأتي هذا الإصدار السنوي للتقرير الشامل للمؤشر الأفريقي لحقوق الإنسان ليسد ثغرة معلوماتية هامة للباحثين وصناع القرار في القارة السمراء. حيث يسعى التقرير إلى تفكيك القوانين والإجراءات المتبعة وتتبع نتائج السياسات التشريعية والتنفيذية بشكل علمي ومحايد.
        </p>
        <p style="font-size: 0.95rem; line-height: 1.8; text-align: justify;">
          يرتكز منهج مؤسسة الحق لحقوق الإنسان على قياس الأثر والتحول من فروع المنظومة الدستورية والقضائية إلى واقع الممارسات الميدانية للمواطن، تجنبا للأطر التقييمية المسيسة أو المنحازة.
        </p>
      </div>
      <div>
        <h3 style="margin-top: 0; color: #0284c7;">المحاور الثلاثة الرئيسية للقياس</h3>
        <p style="font-size: 0.9rem; line-height: 1.7;">
          <strong>1. البعد الهيكلي (Structural Dimensions):</strong> يتتبع الأساس التشريعي والدستوري وحالة التصديق على المعاهدات والاتفاقيات الدولية والإقليمية.
        </p>
        <p style="font-size: 0.9rem; line-height: 1.7;">
          <strong>2. بعد العمليات والمسارات (Process Dimensions):</strong> يقيس واقع تطبيق القوانين، الميزانيات المخصصة، الآليات القضائية لحماية الحق من الانتهاك والتجاوز.
        </p>
        <p style="font-size: 0.9rem; line-height: 1.7;">
          <strong>3. بعد النتائج (Outcome Dimensions):</strong> يعنى بدراسة الأثر النهائي المستمد من ممارسات المواطنين الفعلية ومعدل تمتعهم التام بالحقوق.
        </p>
      </div>
    </div>

    <div class="academic-note">
      <strong>فئات القياس وتوزيع المستويات:</strong> يتم فرز وتصنيف الدول المقيمة رقمياً إلى خمسة مستويات أداء واضحة:
      <ul>
        <li><strong style="color: #14b8a6;">ممتاز (Excellent) [0.90 - 1.00]:</strong> ضمان شامل ومؤسسي وضمان دستوري وقانوني وفضائي حقيقي ومستمر.</li>
        <li><strong style="color: #84cc16;">جيد جداً (Very Good) [0.75 - 0.89]:</strong> بيئة تشريعية متطورة مع التزام عالي بالممارسات التنفيذية.</li>
        <li><strong style="color: #facc15;">جيد (Good) [0.60 - 0.74]:</strong> توجد بيئة تشريعية جيدة ولكن يشوب المسار العملي بعض القيود والتلقائية.</li>
        <li><strong style="color: #fb923c;">مقبول (Acceptable) [0.45 - 0.59]:</strong> ضمانات قانونية محدودة وتحديات ملموسة تعرقل الوصول الفعال للحقوق.</li>
        <li><strong style="color: #ea1c0e;">ضعيف جداً (Very Weak) [دون 0.45]:</strong> غياب الضمانات المنهجية أو وجود انتهاكات منهجية جسيمة تقوض التمتع التام بالحقوق.</li>
        <li><strong>لم يتم تقييمها بعد (Not Evaluated):</strong> حرصاً على الحياد العلمي والمهنية، يتم وسام الدول التي لم تكتمل عملية رصد بياناتها بعبارة "لم يتم تقييمها بعد" ولا تأخذ درجة صفر لتلافي الالتباس في درجات التقييم.</li>
      </ul>
    </div>
  `;

  // Page 3: Comparative Freedoms Analysis & Custom HTML SVG Charts (صفحة التحليل والمقارنة)
  const evaluatedCountries = countries.filter(c => c.isEvaluated);
  const exprAvg = evaluatedCountries.length > 0 
    ? (evaluatedCountries.reduce((sum, c) => sum + (c.indicators.opinionExpression || 0), 0) / evaluatedCountries.length)
    : 0;
  const assemblyAvg = evaluatedCountries.length > 0 
    ? (evaluatedCountries.reduce((sum, c) => sum + (c.indicators.assemblyOrganization || 0), 0) / evaluatedCountries.length)
    : 0;
  const justiceAvg = evaluatedCountries.length > 0 
    ? (evaluatedCountries.reduce((sum, c) => sum + (c.indicators.justice || 0), 0) / evaluatedCountries.length)
    : 0;

  // Let's build a beautiful comparison list of evaluated countries to represent custom comparative stats visually
  const comparisonsList = evaluatedCountries.slice(0, 6).map(c => {
    return `
      <div style="border-bottom: 1px solid #e2e8f0; padding: 12px 0;">
        <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 5px;">
          <span>${c.name}</span>
          <span style="color: #3b82f6;">الملخص المقارن للنسب</span>
        </div>
        <div style="display: flex; gap: 15px; font-size: 0.85rem; color: #475569;">
          <span>حرية التعبير: <strong>${c.indicators.opinionExpression}</strong></span>
          <span>التجمع السلمي: <strong>${c.indicators.assemblyOrganization}</strong></span>
          <span>الحق في العدالة: <strong>${c.indicators.justice}</strong></span>
          <span>الدرجة الإجمالية : <strong>${c.democracyScore}</strong></span>
        </div>
      </div>
    `;
  }).join('');

  const analysisHtml = `
    <div class="page-break"></div>
    <div style="border-bottom: 2px solid #cb9243; padding-bottom: 12px; margin-bottom: 25px;">
      <h2 style="margin: 0; border: none; padding: 0; color: #0d1730;">دراسة مقارنة وتحليل إحصائي في الحريات ومعدلات التجمع السلمي</h2>
    </div>

    <p style="font-size: 0.95rem; line-height: 1.8;">
      رصد الباحثون والموثقون في مؤسسة الحق تفاوتاً كبيراً في مؤشر <strong>حرية الرأي والتعبير وتداول المعلومات</strong> بالمقارنة مع <strong>الحق في التجمع السلمي وتكوين الجمعيات</strong> عبر الأقاليم الأفريقية الخمسة. ويظهر التحليل الإحصائي أن تقييد التجمع السلمي غالباً ما يمثل عقبة هيكلية تسبق تقييد حرية التعبير، وهو ما ينعكس جلياً على مؤشرات النتائج والأثر السنوية.
    </p>

    <div class="grid-2">
      <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0;">
        <h3 style="margin-top: 0; font-size: 1.1rem; color: #1e3a8a;">متوسط الأداء القاري للدول المقيمة</h3>
        <div style="margin-block: 20px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: bold;">
            <span>حرية الرأي والتعبير</span>
            <span>${(exprAvg * 100).toFixed(1)}%</span>
          </div>
          <div class="bar-container" style="background-color: #e2e8f0;">
            <div class="bar-fill" style="width: ${exprAvg * 100}%; background-color: #f97316;"></div>
          </div>
        </div>
        <div style="margin-block: 20px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: bold;">
            <span>التجمع السلمي وحق التنظيم</span>
            <span>${(assemblyAvg * 100).toFixed(1)}%</span>
          </div>
          <div class="bar-container" style="background-color: #e2e8f0;">
            <div class="bar-fill" style="width: ${assemblyAvg * 100}%; background-color: #eab308;"></div>
          </div>
        </div>
        <div style="margin-block: 20px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: bold;">
            <span>الوصول للعدالة بسيادة القانون</span>
            <span>${(justiceAvg * 100).toFixed(1)}%</span>
          </div>
          <div class="bar-container" style="background-color: #e2e8f0;">
            <div class="bar-fill" style="width: ${justiceAvg * 100}%; background-color: #ef4444;"></div>
          </div>
        </div>
      </div>
      
      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; max-height: 400px; overflow-y: auto;">
        <h3 style="margin-top: 0; font-size: 1.1rem; color: #1e3a8a; margin-bottom: 12px;">مقارنات الدول الكبرى المحققة</h3>
        ${comparisonsList || '<p class="text-slate-500 italic">لا توجد دول تم تقييمها بعد لرصد مقارناتها المباشرة</p>'}
      </div>
    </div>

    <div class="academic-note" style="background-color: #fffbeb; border-right-color: #d97706;">
      <strong>تحليل إحصائي قاري:</strong> تظهر البيانات رغبة ملحة لدى الدول في تطوير التشريعات وحصد نقطة "هيكلية" مرتفعة، بينما تنخفض درجة "مؤشر النتائج والواقع الممارس" مما يدل على وجود فجوة حقيقية بين اعتراف الحكومات النظري بحقوق الإنسان في الدساتير الوطنية والتطبيق الميداني للعهود والمواثيق.
    </div>
  `;

  // Page 4: Interactive/Visual Continental Map Page (صفحة الخرائط)
  // Let's mock a gorgeous clean SVG interactive stylized mini map inside the document to make it visually spectacular!
  const mapSvg = `
    <svg viewBox="0 0 500 500" style="width: 100%; max-width: 420px; margin: 0 auto; display: block;" xmlns="http://www.w3.org/2000/svg">
      <!-- High fidelity stylized graphic map representation of Africa regions -->
      <path d="M180,50 L250,30 L320,50 L420,120 L440,180 L400,220 L450,280 L440,320 L460,360 L440,400 L350,470 L300,490 L270,420 L280,350 L240,320 L210,360 L180,310 L150,270 L110,240 L85,210 L110,180 L100,140 Z" fill="#16264f" stroke="#3b82f6" stroke-width="2" />
      
      <!-- Regions and major evaluation dots on coordinates with stylish pulse overlays -->
      <!-- Northern Africa -->
      <circle cx="260" cy="80" r="14" fill="#3b82f6" fill-opacity="0.2" />
      <circle cx="260" cy="80" r="7" fill="#3b82f6" />
      <text x="260" y="60" font-family="'Cairo' , sans-serif" font-weight="bold" font-size="12" fill="#38bdf8" text-anchor="middle">شمال أفريقيا</text>
      
      <!-- West Africa -->
      <circle cx="160" cy="190" r="14" fill="#f97316" fill-opacity="0.2" />
      <circle cx="160" cy="190" r="7" fill="#f97316" />
      <text x="140" y="175" font-family="'Cairo' , sans-serif" font-weight="bold" font-size="12" fill="#fb923c" text-anchor="end">غرب أفريقيا</text>
      
      <!-- Central Africa -->
      <circle cx="280" cy="240" r="14" fill="#a855f7" fill-opacity="0.2" />
      <circle cx="280" cy="240" r="7" fill="#a855f7" />
      <text x="280" y="270" font-family="'Cairo' , sans-serif" font-weight="bold" font-size="12" fill="#c084fc" text-anchor="middle">وسط أفريقيا</text>
      
      <!-- East Africa -->
      <circle cx="380" cy="230" r="14" fill="#14b8a6" fill-opacity="0.2" />
      <circle cx="380" cy="230" r="7" fill="#14b8a6" />
      <text x="400" y="245" font-family="'Cairo' , sans-serif" font-weight="bold" font-size="12" fill="#34d399" text-anchor="start">شرق أفريقيا</text>
      
      <!-- Southern Africa -->
      <circle cx="320" cy="380" r="14" fill="#ec4899" fill-opacity="0.2" />
      <circle cx="320" cy="380" r="7" fill="#ec4899" />
      <text x="320" y="415" font-family="'Cairo' , sans-serif" font-weight="bold" font-size="12" fill="#f472b6" text-anchor="middle">الجنوب الأفريقي</text>
    </svg>
  `;

  const mapHtml = `
    <div class="page-break"></div>
    <div style="border-bottom: 2px solid #cb9243; padding-bottom: 12px; margin-bottom: 25px;">
      <h2 style="margin: 0; border: none; padding: 0; color: #0d1730;">موقع وتموضع الدول جغرافياً بالمؤشر التفاعلي لقارة أفريقيا</h2>
    </div>

    <div class="grid-2" style="align-items: center;">
      <div style="background-color: #0d1730; border-radius: 16px; padding: 30px; border: 1px solid #16264f;">
        ${mapSvg}
      </div>
      <div>
        <h3 style="color: #1e3a8a; margin-top: 0;">الأقاليم الدستورية والحقوقية بالمقارنات</h3>
        <p style="font-size: 0.95rem; line-height: 1.8;">
          توزع معايير رصد الأداء الإقليمية جغرافياً لتعكس اتجاهات متباينة في القارة. حيث تستقر مؤشرات البنية القضائية بمستويات جيدة بمناطق معينة وتواجه تراجعاً في مناطق النزاعات النشطة.
        </p>
        <p style="font-size: 0.95rem; line-height: 1.8;">
          يتم ربط كل منطقة جغرافية على الخريطة بقاعدة بيانات الأداء لإعطاء الباحث نظرة متكاملة، ونسب المقارنة يتم الاستعانة بها لإجراء تحاليل التقارب الحقوقي والإقليمي.
        </p>
        
        <div style="margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          <h4 style="margin: 0 0 10px 0;">مفتاح رموز تصنيف وتقييم الدول:</h4>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem;">
            <div style="display: flex; align-items: center; gap: 8px;"><span class="dot dot-green"></span> <span><strong>ممتاز (Excellent)</strong> : 0.90 - 1.00</span></div>
            <div style="display: flex; align-items: center; gap: 8px;"><span class="dot dot-lime"></span> <span><strong>جيد جداً (Very Good)</strong> : 0.75 - 0.89</span></div>
            <div style="display: flex; align-items: center; gap: 8px;"><span class="dot dot-yellow"></span> <span><strong>جيد (Good)</strong> : 0.60 - 0.74</span></div>
            <div style="display: flex; align-items: center; gap: 8px;"><span class="dot dot-orange"></span> <span><strong>مقبول (Acceptable)</strong> : 0.45 - 0.59</span></div>
            <div style="display: flex; align-items: center; gap: 8px;"><span class="dot dot-red"></span> <span><strong>ضعيف جداً (Very Weak)</strong> : أقل من 0.45</span></div>
            <div style="display: flex; align-items: center; gap: 8px;"><span class="dot dot-gray"></span> <span><strong>لم يتم تقييمها بعد / Not Evaluated</strong> : لضمان دقة الرصد وعدم خلطه مع درجات الصفر</span></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Page 5: Main Consolidated Table (صفحة جدول البيانات المجمع والمستويات والشرائح الملونة)
  const rows = countries
    .sort((a, b) => {
      if (a.isEvaluated && b.isEvaluated) return b.democracyScore - a.democracyScore;
      if (a.isEvaluated) return -1;
      if (b.isEvaluated) return 1;
      return a.name.localeCompare(b.name);
    })
    .map(c => {
      let flagDotClass = 'dot-gray';
      let levelBadgeText = 'لم تقيم بعد / Not Evaluated';
      let levelBadgeClass = 'badge-gray';
      
      if (c.isEvaluated) {
        if (c.democracyScore >= 0.90) {
          flagDotClass = 'dot-green';
          levelBadgeText = 'ممتاز / Excellent';
          levelBadgeClass = 'badge-green';
        } else if (c.democracyScore >= 0.75) {
          flagDotClass = 'dot-lime';
          levelBadgeText = 'جيد جداً / Very Good';
          levelBadgeClass = 'badge-lime';
        } else if (c.democracyScore >= 0.60) {
          flagDotClass = 'dot-yellow';
          levelBadgeText = 'جيد / Good';
          levelBadgeClass = 'badge-yellow';
        } else if (c.democracyScore >= 0.45) {
          flagDotClass = 'dot-orange';
          levelBadgeText = 'مقبول / Acceptable';
          levelBadgeClass = 'badge-orange';
        } else {
          flagDotClass = 'dot-red';
          levelBadgeText = 'ضعيف جداً / Very Weak';
          levelBadgeClass = 'badge-red';
        }
      }

      return `
        <tr>
          <td style="font-weight: bold; color: #0d1730;">${c.name}</td>
          <td>${c.region}</td>
          <td style="text-align: center; font-weight: 800; color: ${c.isEvaluated ? '#0369a1' : '#64748b'};">
            ${c.isEvaluated ? c.democracyScore : '<span style="color: #94a3b8; font-weight: normal; font-size: 0.85rem;">لم يتم تقييمها</span>'}
          </td>
          <td style="text-align: center;">
            <span class="badge ${levelBadgeClass}">
              <span class="dot ${flagDotClass}" style="margin-left: 5px;"></span>
              ${levelBadgeText}
            </span>
          </td>
          <td style="text-align: center; color: #475569;">${c.isEvaluated ? c.indicators.structural : '-'}</td>
          <td style="text-align: center; color: #475569;">${c.isEvaluated ? c.indicators.process : '-'}</td>
          <td style="text-align: center; color: #475569;">${c.isEvaluated ? c.indicators.outcome : '-'}</td>
        </tr>
      `;
    }).join('');

  const tableHtml = `
    <div class="page-break"></div>
    <div style="border-bottom: 2px solid #cb9243; padding-bottom: 12px; margin-bottom: 25px;">
      <h2 style="margin: 0; border: none; padding: 0; color: #0d1730;">جدول الترتيب القاري العام لدرجات ومؤشرات الدول الأفريقية المقيمة</h2>
    </div>

    <p style="font-size: 0.95rem; margin-bottom: 20px;">يرتب الجدول كبريات الدول المدرجة بالمؤشر حسب ترتيب الأداء الكلي التنازلي لضمان توضيح الصدارة الإحصائية للباحثين والموثقين الأكاديميين:</p>

    <table>
      <thead>
        <tr>
          <th>الدول الإفريقية بالمجال</th>
          <th>الإقليم القاري</th>
          <th style="text-align: center; width: 110px;">المؤشر الكلي (/1.00)</th>
          <th style="text-align: center; width: 170px;">مستوى الضمان الدستوري</th>
          <th style="text-align: center; width: 85px;">الهيكلية</th>
          <th style="text-align: center; width: 85px;">المسار</th>
          <th style="text-align: center; width: 85px;">الأثر</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;

  const fullReportHtml = coverHtml + introHtml + analysisHtml + mapHtml + tableHtml;

  if (format === 'docx') {
    downloadDocxFile(fullReportHtml, `ahri_collective_continental_report.doc`);
  } else {
    const html = getBaseTemplate(`AHRI - Collective Continental Report`, fullReportHtml, 'rtl');
    if (format === 'pdf') {
      openPdfPrint(html);
    } else {
      downloadHtmlFile(html, `ahri_collective_report_${new Date().toISOString().split('T')[0]}.html`);
    }
  }
}
